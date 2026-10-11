// Penyimpanan user mode demo (file JSON). Production: ganti dengan Prisma (tabel User).
// Dipisah dari route handler karena Next.js hanya mengizinkan export handler HTTP di route.ts.

import { readFileSync } from "fs";
import { join } from "path";

export interface DemoUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "ADMIN" | "EDITOR" | "VERIFIER" | "USER";
  profesi?: string;
  institusi?: string;
}

export function readUsers(): DemoUser[] {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), "data", "users.json"), "utf-8"));
  } catch {
    return [];
  }
}
