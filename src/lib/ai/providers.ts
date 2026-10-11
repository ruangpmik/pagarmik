// AI Provider abstraction — model/provider dapat diganti tanpa mengubah business logic.
// - LlmProvider: extractive (default, tanpa key) | openai-compatible | ollama
// - EmbeddingProvider: local-tfidf (default) | openai-compatible

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LlmProvider {
  readonly name: string;
  generate(messages: ChatMessage[], opts?: { maxTokens?: number; temperature?: number }): Promise<string>;
}

export interface EmbeddingProvider {
  readonly name: string;
  embed(texts: string[]): Promise<number[][]>;
}

// --- Extractive provider: menyusun jawaban HANYA dari konteks ter-retrieve + sitasi.
// Ini BUKAN dummy: input → retrieval → context → generate → cite. Tanpa LLM eksternal,
// jawaban disusun ekstraktif dengan struktur: Simpulan → Key Points (dengan rujukan
// "Merujuk pada Pasal X ...") → Implikasi PMIK, sehingga anti-halusinasi by construction.
interface ParsedCtx {
  id: string;
  ref: string;
  pasal: string;
  norm: string;
  penjelasan: string;
  relevansi: string;
  topik: string[];
}

function parseCtxBlock(b: string): ParsedCtx | null {
  const header = b.split("]")[0];
  const parts = header.split("|").map((s) => s.trim());
  if (parts.length < 3) return null;
  const [id, ref, pasal] = parts;
  const topik = (parts[5] ?? "").replace(/^topik:/i, "").split(",").map((s) => s.trim()).filter(Boolean);
  const text = b.slice(b.indexOf("]") + 1).trim();
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const pick = (prefix: string) =>
    lines.find((l) => l.startsWith(prefix))?.slice(prefix.length).trim() ?? "";
  const norm = lines.filter((l) => !/^(Penjelasan|Relevansi PMIK|Risiko kepatuhan):/.test(l)).join(" ");
  const penjelasan = pick("Penjelasan:");
  const relevansi = pick("Relevansi PMIK:");
  return { id, ref, pasal, norm, penjelasan, relevansi, topik };
}

/** Keterkaitan antar aturan: pasangan chunk dari regulasi berbeda yang berbagi topik.
 * Murni metadata-driven (topik kurasi), bukan karangan — presisi ala analis hukum. */
function buildKeterkaitan(keys: ParsedCtx[], max = 4): string[] {
  const out: string[] = [];
  for (let i = 0; i < keys.length && out.length < max; i++) {
    for (let j = i + 1; j < keys.length && out.length < max; j++) {
      const a = keys[i], b = keys[j];
      if (a.ref === b.ref) continue;
      const shared = a.topik.filter((t) => b.topik.includes(t));
      if (!shared.length) continue;
      out.push(
        `• ${a.pasal} ${a.ref} ↔ ${b.pasal} ${b.ref}: sama-sama mengatur ${shared.map((t) => `#${t}`).join(", ")}. [${a.id}] [${b.id}]`
      );
    }
  }
  return out;
}
function firstSentence(text: string, max = 240): string {
  const clean = text.replace(/^RINGKASAN TERVERIFIKASI(\s*\([^)]*\))?\s*:\s*/i, "").trim();
  const m = clean.match(/^.*?[.!?](\s|$)/s);
  const s = (m?.[0] ?? clean).trim().replace(/\s+/g, " ");
  return s.length > max ? s.slice(0, max).trimEnd() + "…" : s;
}

export class ExtractiveProvider implements LlmProvider {
  readonly name = "extractive";
  async generate(messages: ChatMessage[]): Promise<string> {
    const combined = messages.map((m) => m.content).join("\n");
    const userRaw = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
    const q = (userRaw.split("PERTANYAAN:")[1] ?? userRaw).split("\n")[0].trim().slice(0, 140);
    const parsed = combined
      .split(/\[CTX:/)
      .slice(1)
      .map(parseCtxBlock)
      .filter((p): p is ParsedCtx => p !== null && p.norm.length > 0);
    if (!parsed.length) return "NO_SOURCE";

    const top = parsed[0];
    const simpulan = top.penjelasan || firstSentence(top.norm);
    // Diversitas regulasi: maks 2 chunk per regulasi agar jawaban mengkomparasikan
    // tiap aturan terkait (mis. RME ↔ PP 71/2019), bukan didominasi satu regulasi.
    const keyed: ParsedCtx[] = [];
    const perRef = new Map<string, number>();
    for (const p of parsed) {
      if (keyed.length >= 5) break;
      const c = perRef.get(p.ref) ?? 0;
      if (c >= 2) continue;
      perRef.set(p.ref, c + 1);
      keyed.push(p);
    }
    const keys = keyed.map(
      (p, i) => `${i + 1}. Merujuk pada ${p.pasal} ${p.ref} — ${firstSentence(p.norm)} [${p.id}]`
    );
    const links = buildKeterkaitan(keyed);
    const implHolder = parsed.find((p) => p.relevansi) ?? top;
    const lines = [
      `Untuk pertanyaan “${q}”, simpulannya:`,
      "",
      `**Simpulan:** ${simpulan} [${top.id}]`,
      "",
      "**Key Points:**",
      ...keys,
      "",
      ...(links.length ? ["**Keterkaitan Antar Aturan:**", ...links, ""] : []),
      ...(implHolder.relevansi
        ? [`**Implikasi untuk PMIK:** ${implHolder.relevansi} [${implHolder.id}]`, ""]
        : []),
      "Seluruh poin di atas disusun dari sumber terverifikasi di bawah — bukan karangan model.",
    ];
    return lines.join("\n");
  }
}

export class OpenAICompatibleProvider implements LlmProvider {
  readonly name = "openai-compatible";
  constructor(private baseUrl: string, private apiKey: string, private model: string) {}
  async generate(messages: ChatMessage[], opts?: { maxTokens?: number; temperature?: number }): Promise<string> {
    const res = await fetch(`${this.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: opts?.temperature ?? 0.1,
        max_tokens: opts?.maxTokens ?? 1200,
      }),
    });
    if (!res.ok) throw new Error(`LLM provider error: ${res.status}`);
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error("LLM provider returned empty response");
    return String(text);
  }
}

export function getLlmProvider(): LlmProvider {
  const kind = process.env.AI_PROVIDER ?? "extractive";
  if (kind === "openai-compatible" || kind === "ollama") {
    const base = process.env.AI_BASE_URL ?? "http://localhost:11434/v1";
    return new OpenAICompatibleProvider(base, process.env.AI_API_KEY ?? "ollama", process.env.AI_MODEL ?? "llama3.1:8b");
  }
  return new ExtractiveProvider();
}

// Embedding lokal deterministik (hashing trick) — fallback bila tanpa embedding service.
// Dipakai untuk re-scoring semantik; retrieval utama tetap hybrid BM25+TF-IDF.
export class LocalHashEmbedding implements EmbeddingProvider {
  readonly name = "local-hash";
  constructor(private dim = 256) {}
  async embed(texts: string[]): Promise<number[][]> {
    return texts.map((t) => {
      const v = new Array(this.dim).fill(0);
      for (const tok of t.toLowerCase().split(/[^a-z0-9]+/)) {
        if (tok.length < 2) continue;
        let h = 2166136261;
        for (let i = 0; i < tok.length; i++) { h ^= tok.charCodeAt(i); h = Math.imul(h, 16777619); }
        v[Math.abs(h) % this.dim] += 1;
      }
      const n = Math.sqrt(v.reduce((a, x) => a + x * x, 0)) || 1;
      return v.map((x) => x / n);
    });
  }
}

export class OpenAICompatibleEmbedding implements EmbeddingProvider {
  readonly name = "openai-compatible-embedding";
  constructor(private baseUrl: string, private apiKey: string, private model: string) {}
  async embed(texts: string[]): Promise<number[][]> {
    const res = await fetch(`${this.baseUrl.replace(/\/$/, "")}/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({ model: this.model, input: texts }),
    });
    if (!res.ok) throw new Error(`Embedding provider error: ${res.status}`);
    const data = await res.json();
    return (data?.data ?? []).map((d: { embedding: number[] }) => d.embedding);
  }
}

export function getEmbeddingProvider(): EmbeddingProvider {
  if (process.env.EMBEDDING_PROVIDER === "openai-compatible") {
    return new OpenAICompatibleEmbedding(
      process.env.EMBEDDING_BASE_URL ?? "http://localhost:11434/v1",
      process.env.EMBEDDING_API_KEY ?? "ollama",
      process.env.EMBEDDING_MODEL ?? "nomic-embed-text"
    );
  }
  return new LocalHashEmbedding();
}
