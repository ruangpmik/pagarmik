// Tokenisasi Bahasa Indonesia untuk search & RAG.
// Ringan, tanpa dependensi: normalisasi, stopword, stemming sederhana.

const STOPWORDS = new Set([
  "yang", "dan", "atau", "di", "ke", "dari", "pada", "untuk", "dengan", "tentang",
  "adalah", "ini", "itu", "dalam", "sebagai", "oleh", "karena", "jika", "apakah",
  "apa", "siapa", "bagaimana", "boleh", "dapat", "harus", "tidak", "bukan", "ada",
  "saya", "kami", "pasien", // "pasien" terlalu umum — disimpan terpisah sebagai konteks
  "the", "of", "to", "a", "an",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s/]/g, " ")
    .split(/\s+/)
    .map((t) => stemId(t.trim()))
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

function stemId(token: string): string {
  // Stemming prefiks/sufiks umum BI (ringan, bukan Nazief-Adriani penuh)
  let w = token;
  for (const pre of ["meng", "meny", "men", "mem", "me", "peng", "peny", "pen", "pem", "pe", "ber", "ter", "di", "ke", "se"]) {
    if (w.startsWith(pre) && w.length - pre.length > 3) { w = w.slice(pre.length); break; }
  }
  for (const suf of ["kan", "nya", "lah", "kah", "an", "i"]) {
    if (w.endsWith(suf) && w.length - suf.length > 3) { w = w.slice(0, -suf.length); break; }
  }
  return w;
}

// Kamus sinonim domain MIK → dinormalisasi ke istilah kanonik untuk recall.
const SYNONYMS: Record<string, string> = {
  "rm": "rekam medis", "rme": "rekam medis elektronik", "rmk": "rekam medis",
  "mik": "informasi kesehatan", "rmik": "rekam medis",
  "pmik": "perekam medis", "perekam": "perekam medis",
  "rahasia": "kerahasiaan", "confidential": "kerahasiaan",
  "satusehat": "satusehat interoperability",
  "pdp": "pelindungan data pribadi", "privacy": "privasi",
  "keluarga": "keluarga kuasa persetujuan", "istri": "keluarga kuasa persetujuan",
  "suami": "keluarga kuasa persetujuan", "anak": "keluarga kuasa persetujuan",
  "salinan": "salinan akses", "copy": "salinan akses",
  "bocor": "kebocoran insiden", "bocoran": "kebocoran insiden",
};

export function expandQuery(query: string): string {
  let q = query.toLowerCase();
  for (const [k, v] of Object.entries(SYNONYMS)) {
    if (q.includes(k)) q += " " + v;
  }
  return q;
}

// Deteksi topik dari pertanyaan untuk metadata search.
const TOPIC_SIGNALS: Record<string, string[]> = {
  "rekam-medis": ["rekam", "medis", "rm "],
  "privasi": ["rahasia", "kerahasiaan", "rahasia kedokteran", "confidential"],
  "perlindungan-data": ["pdp", "data pribadi", "kebocoran", "bocor", "dpo"],
  "hak-pasien": ["hak pasien", "salinan", "akses pasien", "minta"],
  "rme": ["elektronik", "rme", "satusehat", "digital"],
  "simrs": ["simrs", "sistem informasi", "aplikasi", "vendor"],
  "pmik": ["pmik", "perekam", "kewenangan", "kompetensi"],
  "sengketa": ["sengketa", "gugatan", "pengadilan", "mediasi"],
};

export function detectTopics(query: string): string[] {
  const q = query.toLowerCase();
  return Object.entries(TOPIC_SIGNALS)
    .filter(([, sigs]) => sigs.some((s) => q.includes(s)))
    .map(([t]) => t);
}
