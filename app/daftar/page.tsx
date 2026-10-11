export const metadata = { title: "Daftar" };

export default function Daftar() {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-extrabold">Daftar</h1>
      <form action="/api/auth/register" method="post" className="mt-4 grid gap-2">
        <label className="text-sm font-bold">Nama<input name="name" required className="mt-1 w-full rounded-xl border px-3 py-2.5 font-normal" /></label>
        <label className="text-sm font-bold">Email<input name="email" type="email" required className="mt-1 w-full rounded-xl border px-3 py-2.5 font-normal" /></label>
        <label className="text-sm font-bold">Profesi
          <select name="profesi" className="mt-1 w-full rounded-xl border px-3 py-2.5 font-normal">
            <option>PMIK</option><option>Mahasiswa RMIK</option><option>Dosen RMIK</option>
            <option>Manajemen RS</option><option>IT/SIMRS</option><option>Tim Legal RS</option><option>Lainnya</option>
          </select>
        </label>
        <label className="text-sm font-bold">Institusi<input name="institusi" className="mt-1 w-full rounded-xl border px-3 py-2.5 font-normal" /></label>
        <label className="text-sm font-bold">Kata sandi (min. 8)<input name="password" type="password" required minLength={8} className="mt-1 w-full rounded-xl border px-3 py-2.5 font-normal" /></label>
        <button className="rounded-xl bg-pagar-700 px-4 py-2.5 font-bold text-white">Buat akun</button>
      </form>
    </div>
  );
}
