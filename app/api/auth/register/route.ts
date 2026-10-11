import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { hashPassword, signSession } from "@/lib/auth/session";
import { readUsers } from "@/lib/auth/users";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const email = String(form.get("email") ?? "").toLowerCase().trim();
  const name = String(form.get("name") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email.includes("@") || name.length < 2 || password.length < 8) {
    return NextResponse.redirect(new URL("/daftar", req.url));
  }
  const users = readUsers();
  if (users.some((u) => u.email === email)) return NextResponse.redirect(new URL("/masuk?error=1", req.url));
  const user = {
    id: `u-${Date.now()}`, email, name, role: "USER" as const,
    passwordHash: await hashPassword(password),
    profesi: String(form.get("profesi") ?? ""), institusi: String(form.get("institusi") ?? ""),
  };
  const dir = join(process.cwd(), "data");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "users.json"), JSON.stringify([...users, user], null, 2));
  const res = NextResponse.redirect(new URL("/", req.url));
  const token = await signSession({ id: user.id, email, name, role: "USER" });
  res.cookies.set("pagarmik_session", token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}
