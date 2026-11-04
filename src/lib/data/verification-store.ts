import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "fs";
import { randomUUID } from "crypto";
import { dirname, join } from "path";
import type { VerificationRecord } from "@/lib/data/types";

/** File-backed audit log for the single-process demo data store. */
export class JsonVerificationStore {
  constructor(private readonly filePath = join(process.cwd(), "data", "verification.json")) {}

  records(regulationSlug?: string): VerificationRecord[] {
    if (!existsSync(this.filePath)) return [];
    const parsed: unknown = JSON.parse(readFileSync(this.filePath, "utf-8"));
    if (!Array.isArray(parsed)) throw new Error("Verification audit file must contain an array.");
    const records = parsed as VerificationRecord[];
    return regulationSlug
      ? records.filter((record) => record.regulationSlug === regulationSlug)
      : records;
  }

  record(input: Omit<VerificationRecord, "createdAt">): VerificationRecord {
    const next: VerificationRecord = { ...input, createdAt: new Date().toISOString() };
    const records = [...this.records(), next];
    const dir = dirname(this.filePath);
    mkdirSync(dir, { recursive: true });

    // Rename a complete temporary file into place so a failed write cannot
    // leave a truncated audit log.
    const tempPath = `${this.filePath}.${process.pid}.${randomUUID()}.tmp`;
    try {
      writeFileSync(tempPath, JSON.stringify(records, null, 2), { encoding: "utf-8", flag: "wx" });
      renameSync(tempPath, this.filePath);
    } catch (error) {
      try {
        if (existsSync(tempPath)) unlinkSync(tempPath);
      } catch { /* preserve the original write error */ }
      throw error;
    }
    return next;
  }
}

let instance: JsonVerificationStore | null = null;
export function getVerificationStore(): JsonVerificationStore {
  if (!instance) instance = new JsonVerificationStore();
  return instance;
}
