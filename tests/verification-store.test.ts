import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { JsonVerificationStore } from "@/lib/data/verification-store";

let testDir: string | undefined;

afterEach(() => {
  if (testDir) rmSync(testDir, { recursive: true, force: true });
  testDir = undefined;
});

describe("JsonVerificationStore", () => {
  it("persists the current status and keeps each verification in the audit history", () => {
    testDir = mkdtempSync(join(tmpdir(), "pagarmik-verification-"));
    const store = new JsonVerificationStore(join(testDir, "data", "verification.json"));

    store.record({
      regulationSlug: "uu-17-2023",
      status: "BERLAKU",
      catatan: "Status dikonfirmasi melalui sumber resmi.",
      sumberUrl: "https://example.test/regulasi/uu-17-2023",
      verifiedBy: "verifier@example.test",
    });
    store.record({
      regulationSlug: "uu-17-2023",
      status: "BERLAKU_DENGAN_CATATAN",
      catatan: "Catatan perubahan dicatat dari sumber resmi.",
      verifiedBy: "admin@example.test",
    });

    const history = new JsonVerificationStore(join(testDir, "data", "verification.json")).records("uu-17-2023");
    expect(history).toHaveLength(2);
    expect(history[0].status).toBe("BERLAKU");
    expect(history[1].status).toBe("BERLAKU_DENGAN_CATATAN");
    expect(history[1].verifiedBy).toBe("admin@example.test");
  });

  it("returns an empty history when no audit file exists", () => {
    testDir = mkdtempSync(join(tmpdir(), "pagarmik-verification-"));
    expect(new JsonVerificationStore(join(testDir, "missing.json")).records()).toEqual([]);
  });
});
