import { cookies } from "next/headers";
import { readSession } from "@/lib/auth/session";

export const metadata = { title: "Profil" };

export default async function Profil() {
  const token = cookies().get("pagarmik_session")?.value;
  const user = await readSession(token);
  if (!user) {
    return <div className="mx-auto max-w-sm text-sm">Belum masuk. <a className="font-bold text-pagar-700 underline" href="/masuk?next=/profil">Masuk →</a></div>;
  }
  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-extrabold">Profil</h1>
      <div className="mt-4 rounded-2xl border bg-white p-5 text-sm">
        <p className="text-lg font-extrabold">{user.name}</p>
        <p className="text-ink-900/60">{user.email} · {user.role}</p>
        <form action="/api/auth/logout" method="post" className="mt-4">
          <button className="rounded-xl border px-4 py-2 font-bold">Keluar</button>
        </form>
      </div>
      <h2 className="mt-6 font-extrabold">Riwayat & Bookmark</h2>
      <p className="mt-1 text-sm text-ink-900/60">Riwayat pencarian, percakapan AI, dan bookmark regulasi/pasal tersimpan di sini (production: PostgreSQL; demo: sesi browser).</p>
    </div>
  );
}
