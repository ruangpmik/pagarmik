import { getStore } from "@/lib/data/store";
import { StatusBadge, Disclaimer } from "@/components/ui";

export const metadata = { title: "Bandingkan regulasi" };

export default function Compare({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const store = getStore();
  const regs = store.regulations();
  const a = regs.find((r) => r.slug === searchParams.a);
  const b = regs.find((r) => r.slug === searchParams.b);

  const sel = (name: "a" | "b", val: string | undefined) => (
    <label htmlFor={`regulasi-${name}`} className="grid gap-1 text-sm font-semibold text-ink-900">
      Regulasi {name.toUpperCase()}
      <select id={`regulasi-${name}`} name={name} defaultValue={val ?? ""} className="min-h-11 w-full rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm font-normal">
        <option value="">Pilih regulasi</option>
        {regs.map((r) => <option key={r.slug} value={r.slug}>{r.judul}</option>)}
      </select>
    </label>
  );

  const rows: [string, string, string][] = a && b ? [
    ["Judul", a.judul, b.judul],
    ["Jenis / Tahun", `${a.jenis} · ${a.tahun}`, `${b.jenis} · ${b.tahun}`],
    ["Status", a.status, b.status],
    ["Ringkasan", a.ringkasan, b.ringkasan],
    ["Topik", a.topik.join(", "), b.topik.join(", ")],
    ["Jumlah pasal terindeks", String(store.pasalsOf(a.slug).length), String(store.pasalsOf(b.slug).length)],
  ] : [];

  return (
    <div className="mx-auto max-w-4xl">
      <h1>Bandingkan regulasi</h1>
      <form method="get" className="mt-4 grid gap-2 md:grid-cols-[1fr_1fr_auto]">
        {sel("a", searchParams.a)}
        {sel("b", searchParams.b)}
        <button className="min-h-11 rounded-lg bg-pagar-700 px-5 py-2.5 text-sm font-semibold text-white">Bandingkan</button>
      </form>
      {a && b && (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-100" role="region" aria-label="Tabel perbandingan regulasi" tabIndex={0}>
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-ink-900/70">
                <th scope="col" className="p-3 font-medium">Aspek</th>
                <th scope="col" className="p-3 font-medium">{a.judul}</th>
                <th scope="col" className="p-3 font-medium">{b.judul}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([k, va, vb]) => (
                <tr key={k} className="border-b border-ink-100 align-top last:border-b-0">
                  <th scope="row" className="p-3 text-left font-semibold">{k}</th>
                  <td className="p-3">{k === "Status" ? <StatusBadge status={va as typeof a.status} /> : va}</td>
                  <td className="p-3">
                    {k === "Status" ? <StatusBadge status={vb as typeof b.status} /> : vb}
                    {va !== vb && <span className="ml-2 text-xs font-semibold text-amber-800">Berbeda</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-5"><Disclaimer /></div>
    </div>
  );
}
