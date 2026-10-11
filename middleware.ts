import { NextResponse, type NextRequest } from "next/server";

// Baseline keamanan production:
// 1. HSTS — paksa HTTPS (aktifkan TLS di reverse proxy/load balancer).
// 2. CSP pragmatis untuk Next.js App Router.
// 3. CSRF: tolak POST/PUT/PATCH/DELETE /api yang Origin-nya bukan host sendiri.

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

export function middleware(req: NextRequest) {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const origin = req.headers.get("origin");
    if (origin) {
      let ok = false;
      try {
        ok = new URL(origin).host === req.nextUrl.host;
      } catch {
        ok = false;
      }
      if (!ok) return NextResponse.json({ error: "Permintaan ditolak (CSRF)." }, { status: 403 });
    }
  }
  const res = NextResponse.next();
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.headers.set("Content-Security-Policy", CSP);
  return res;
}

export const config = {
  matcher: ["/api/:path*"],
};
