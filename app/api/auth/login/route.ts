import { NextRequest, NextResponse } from "next/server";
import { signSession, verifyPassword } from "@/lib/auth/session";
import { readUsers } from "@/lib/auth/users";

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const email = String(form?.get("email") ?? "").toLowerCase().trim();
  const password = String(form?.get("password") ?? "");
  const next = String(form?.get("next") ?? "/");

  // Demo-mode: cocokkan dengan data/users.json yang dibuat seed (production: Prisma + verifyPassword)
  const user = readUsers().find((u) => u.email === email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.redirect(new URL("/masuk?error=1", req.url));
  }
  const res = NextResponse.redirect(new URL(next.startsWith("/") ? next : "/", req.url));
  const token = await signSession({ id: user.id, email: user.email, name: user.name, role: user.role });
  res.cookies.set("pagarmik_session", token, {
    httpOnly: true, sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
