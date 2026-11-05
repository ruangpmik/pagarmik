// Pusat Kepatuhan: penyimpanan materi (intake) mode demo berbasis file JSON.
// Satu kontrak, siap migrasi ke Postgres/Prisma (tabel Matter + AuditLog) tanpa mengubah pemanggil.
// Audit log disimpan inline per materi — wajib demi kepatuhan UU PDP (jejak akses/mutasi).

import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "fs";
import { randomUUID } from "crypto";
import { dirname, join } from "path";
import { MATTER_STATUS_LABEL, type Matter, type MatterPriority, type MatterStatus, type MatterTipe } from "./labels";

export * from "./labels";

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "mater"
  );
}

export class MatterStore {
  constructor(private readonly filePath = join(process.cwd(), "data", "matters.json")) {}

  matters(): Matter[] {
    if (!existsSync(this.filePath)) return [];
    const parsed: unknown = JSON.parse(readFileSync(this.filePath, "utf-8"));
    if (!Array.isArray(parsed)) throw new Error("Matters file must contain an array.");
    return parsed as Matter[];
  }

  get(id: string): Matter | undefined {
    return this.matters().find((m) => m.id === id);
  }

  private write(matters: Matter[]): void {
    const dir = dirname(this.filePath);
    mkdirSync(dir, { recursive: true });
    // Tulis ke file sementara lalu rename agar write gagal tidak merusak log.
    const tempPath = `${this.filePath}.${process.pid}.${randomUUID()}.tmp`;
    try {
      writeFileSync(tempPath, JSON.stringify(matters, null, 2), { encoding: "utf-8", flag: "wx" });
      renameSync(tempPath, this.filePath);
    } catch (error) {
      try {
        if (existsSync(tempPath)) unlinkSync(tempPath);
      } catch { /* pertahankan error asli */ }
      throw error;
    }
  }

  create(input: {
    judul: string;
    deskripsi: string;
    tipe: MatterTipe;
    prioritas: MatterPriority;
    tenggat?: string;
    ownedBy: string;
    ownerName: string;
  }): Matter {
    const now = new Date().toISOString();
    const actor = `${input.ownerName} <${input.ownedBy}>`;
    const matter: Matter = {
      id: `${slugify(input.judul)}-${randomUUID().slice(0, 6)}`,
      judul: input.judul,
      deskripsi: input.deskripsi,
      tipe: input.tipe,
      status: "BARU",
      prioritas: input.prioritas,
      tenggat: input.tenggat,
      ownedBy: input.ownedBy,
      ownerName: input.ownerName,
      createdAt: now,
      updatedAt: now,
      audit: [{ at: now, actor, action: "CREATE", detail: "Intake materi kepatuhan dibuat" }],
    };
    this.write([...this.matters(), matter]);
    return matter;
  }

  updateStatus(id: string, status: MatterStatus, actor: string): Matter | null {
    const all = this.matters();
    const idx = all.findIndex((m) => m.id === id);
    if (idx < 0) return null;
    const prev = all[idx];
    if (prev.status === status) return prev;
    const next: Matter = {
      ...prev,
      status,
      updatedAt: new Date().toISOString(),
      audit: [
        ...prev.audit,
        {
          at: new Date().toISOString(),
          actor,
          action: "UPDATE_STATUS",
          detail: `${MATTER_STATUS_LABEL[prev.status]} → ${MATTER_STATUS_LABEL[status]}`,
        },
      ],
    };
    all[idx] = next;
    this.write(all);
    return next;
  }
}

let instance: MatterStore | null = null;
export function getMatterStore(): MatterStore {
  if (!instance) instance = new MatterStore();
  return instance;
}