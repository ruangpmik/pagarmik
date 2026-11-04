import { describe, expect, it } from "vitest";
import { canVerifyRegulationStatus } from "@/lib/auth/session";
import { isSameOrigin } from "@/lib/security/guards";

describe("verification authorization policy", () => {
  const user = (role: "ADMIN" | "EDITOR" | "VERIFIER" | "USER") => ({
    id: "test-user",
    email: "synthetic@example.test",
    name: "Synthetic User",
    role,
  });

  it("allows only verifier and admin roles to change regulation status", () => {
    expect(canVerifyRegulationStatus(user("VERIFIER"))).toBe(true);
    expect(canVerifyRegulationStatus(user("ADMIN"))).toBe(true);
    expect(canVerifyRegulationStatus(user("EDITOR"))).toBe(false);
    expect(canVerifyRegulationStatus(user("USER"))).toBe(false);
    expect(canVerifyRegulationStatus(null)).toBe(false);
  });
});

describe("same-origin mutation guard", () => {
  it("allows an exact same origin", () => {
    expect(isSameOrigin("https://pagarmik.example", "https://pagarmik.example/api/admin/verify")).toBe(true);
  });

  it("rejects a cross-origin, missing, or malformed origin", () => {
    expect(isSameOrigin("https://attacker.example", "https://pagarmik.example/api/admin/verify")).toBe(false);
    expect(isSameOrigin(null, "https://pagarmik.example/api/admin/verify")).toBe(false);
    expect(isSameOrigin("not a url", "https://pagarmik.example/api/admin/verify")).toBe(false);
  });
});
