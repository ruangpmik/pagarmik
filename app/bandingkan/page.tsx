import { getStore } from "@/lib/data/store";
import { StatusBadge, Disclaimer } from "@/components/ui";

export const metadata = { title: "Bandingkan Regulasi" };

export default function Compare({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const store = getStore();
  const regs = store.regulations();
  const a = regs.find((r) => r.slug === searchParams.a);
  const b = regs.find((r) => r.slug === searchParams.b);

  const sel = (name: string, val: string | undefined) => (
    <select name={name} defaultValue={val ?? ""} className="w-full rounded-xl border px-3 py-2.5 text-sm">
      <option value="">— pilih regulasi —</option>
      {regs.map((r) => <option key={r.slug} value={r.slug}>{r.judul}</option>)}
    </select>
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
      <h1 className="text-2xl font-extrabold">Bandingkan Regulasi</h1>
      <form method="get" className="mt-4 grid gap-2 md:grid-cols-[1fr_1fr_auto]">
        {sel("a", searchParams.a)}
        {sel("b", searchParams.b)}
        <button className="rounded-xl bg-pagar-700 px-5 py-2.5 text-sm font-bold text-white">Bandingkan</button>
      </form>
      {a && b && (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-100">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="bg-pagar-950 text-white">
                <th className="p-3 text-left">Aspek</th>
                <th className="p-3 text-left">{a.judul}</th>
                <th className="p-3 text-left">{b.judul}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([k, va, vb], i) => (
                <tr key={k} className={i % 2 ? "bg-ink-50/50" : "bg-white"}>
                  <td className="p-3 font-bold">{k}</td>
                  <td className="p-3">{k === "Status" ? <StatusBadge status={va as typeof a.status} /> : va}</td>
                  <td className={`p-3 ${va !== vb ? "bg-amber-50" : ""}`}>{k === "Status" ? <StatusBadge status={vb as typeof b.status} /> : vb}</td>
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
