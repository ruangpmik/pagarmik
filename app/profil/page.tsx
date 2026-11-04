import { cookies } from "next/headers";
import { readSession } from "@/lib/auth/session";
import LibraryView from "@/components/LibraryView";

export const metadata = { title: "Profil" };

export default async function Profil() {
  const token = cookies().get("pagarmik_session")?.value;
  const user = await readSession(token);
  if (!user) {
    return (
      <div className="mx-auto max-w-sm text-sm">
        <h1>Profil</h1>
        <p className="mt-3">Belum masuk. <a className="font-bold text-pagar-700 underline" href="/masuk?next=/profil">Masuk →</a></p>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-md">
      <h1>Profil</h1>
      <div className="mt-4 rounded-2xl border bg-white p-5 text-sm">
        <p className="text-lg font-extrabold">{user.name}</p>
        <p className="text-ink-900/60">{user.email} · {user.role}</p>
        <form action="/api/auth/logout" method="post" className="mt-4">
          <button className="rounded-xl border px-4 py-2 font-bold">Keluar</button>
        </form>
      </div>
      <h2 className="mt-6 font-extrabold">Riwayat & Bookmark</h2>
      <LibraryView />
    </div>
  );
}
