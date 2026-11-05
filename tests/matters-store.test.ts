import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { MatterStore } from "@/lib/matters/store";

let testDir: string | undefined;

afterEach(() => {
  if (testDir) rmSync(testDir, { recursive: true, force: true });
  testDir = undefined;
});

describe("MatterStore", () => {
  it("creates a matter and appends an UPDATE_STATUS audit event", () => {
    testDir = mkdtempSync(join(tmpdir(), "pagarmik-matter-"));
    const store = new MatterStore(join(testDir, "matters.json"));

    const created = store.create({
      judul: "Kepatuhan pelepasan rekam medis",
      deskripsi: "Skenario permintaan salinan oleh pihak ketiga tanpa surat kuasa.",
      tipe: "RMIK",
      prioritas: "TINGGI",
      tenggat: "2026-12-31",
      ownedBy: "user@example.test",
      ownerName: "Wartini",
    });

    expect(created.status).toBe("BARU");
    expect(created.id).toMatch(/^kepatuhan-pelepasan-rekam-medis-/);
    expect(created.audit).toHaveLength(1);
    expect(created.audit[0].action).toBe("CREATE");

    const updated = store.updateStatus(created.id, "SELESAI", "Wartini <user@example.test>");
    expect(updated?.status).toBe("SELESAI");
    expect(updated?.audit).toHaveLength(2);
    expect(updated?.audit[1].action).toBe("UPDATE_STATUS");

    const reloaded = new MatterStore(join(testDir, "matters.json")).get(created.id);
    expect(reloaded?.status).toBe("SELESAI");
    expect(reloaded?.audit).toHaveLength(2);
  });

  it("returns an empty list when no matters file exists", () => {
    testDir = mkdtempSync(join(tmpdir(), "pagarmik-matter-"));
    expect(new MatterStore(join(testDir, "missing.json")).matters()).toEqual([]);
  });
});