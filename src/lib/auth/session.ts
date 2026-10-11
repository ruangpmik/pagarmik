// Auth: JWT (jose) + password hashing (scrypt via node:crypto).
// RBAC: ADMIN > EDITOR > VERIFIER > USER. Google OAuth: interface siap dihubungkan via Auth.js.

import { SignJWT, jwtVerify } from "jose";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
export type AppRole = "ADMIN" | "EDITOR" | "VERIFIER" | "USER";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: AppRole;
}

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET ?? "";
  if (process.env.NODE_ENV === "production") {
    if (s.length < 32) {
      throw new Error("AUTH_SECRET wajib diisi (min 32 karakter) di production. Aplikasi menolak berjalan.");
    }
  }
  return new TextEncoder().encode(s || "dev-secret-min-32-karakter-ganti-di-prod");
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${buf.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hex] = stored.split(":");
  if (!salt || !hex) return false;
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hex, "hex");
  return buf.length === expected.length && timingSafeEqual(buf, expected);
}

export async function signSession(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function readSession(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return { id: String(payload.id), email: String(payload.email), name: String(payload.name), role: payload.role as AppRole };
  } catch {
    return null;
  }
}

const RANK: Record<AppRole, number> = { USER: 0, VERIFIER: 1, EDITOR: 2, ADMIN: 3 };
export function can(user: SessionUser | null, minimum: AppRole): boolean {
  if (!user) return false;
  return RANK[user.role] >= RANK[minimum];
}

// NOTE: user demo tersimpan di data/users.json (dibuat saat seed). Production: tabel User via Prisma.
// Google OAuth: tambahkan provider di route /api/auth/[...provider] memakai Auth.js dan petakan ke SessionUser.
