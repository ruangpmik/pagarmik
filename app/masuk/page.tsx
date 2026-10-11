export const metadata = { title: "Masuk" };

export default function Masuk({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-extrabold">Masuk</h1>
      {searchParams.error && <p className="mt-2 rounded-xl bg-red-50 p-3 text-sm text-red-800" role="alert">Email atau kata sandi salah.</p>}
      <form action="/api/auth/login" method="post" className="mt-4 grid gap-2">
        <input type="hidden" name="next" value={searchParams.next ?? "/"} />
        <label className="text-sm font-bold">Email<input name="email" type="email" required className="mt-1 w-full rounded-xl border px-3 py-2.5 font-normal" /></label>
        <label className="text-sm font-bold">Kata sandi<input name="password" type="password" required className="mt-1 w-full rounded-xl border px-3 py-2.5 font-normal" /></label>
        <button className="rounded-xl bg-pagar-700 px-4 py-2.5 font-bold text-white">Masuk</button>
      </form>
      <p className="mt-3 text-xs text-ink-900/60">Akun demo (dibuat saat seed): <code>admin@pagarmik.id / pagarmik123</code> · Google OAuth dihubungkan via Auth.js di production (lihat docs).</p>
      <p className="mt-1 text-xs"><a className="font-bold text-pagar-700 underline" href="/daftar">Belum punya akun? Daftar</a></p>
    </div>
  );
}
