"use client";

import { useState } from "react";

interface Node { slug: string; label: string; }
interface Edge { from: string; to: string; type: string; }

const NODES: Node[] = [
  { slug: "uu-17-2023", label: "UU 17/2023" },
  { slug: "pp-28-2024", label: "PP 28/2024" },
  { slug: "uu-27-2022", label: "UU PDP 27/2022" },
  { slug: "permenkes-24-2022", label: "Permenkes 24/2022" },
  { slug: "permenkes-36-2012", label: "Permenkes 36/2012" },
  { slug: "permenkes-269-2008", label: "Permenkes 269/2008 ✝" },
  { slug: "permenkes-6-2026", label: "Permenkes 6/2026" },
  { slug: "permenkes-82-2013", label: "Permenkes 82/2013 ✝" },
];
const EDGES: Edge[] = [
  { from: "uu-17-2023", to: "pp-28-2024", type: "TURUNAN" },
  { from: "pp-28-2024", to: "uu-17-2023", type: "MELAKSANAKAN" },
  { from: "permenkes-24-2022", to: "permenkes-269-2008", type: "MENCABUT" },
  { from: "uu-27-2022", to: "permenkes-24-2022", type: "MEMPERKUAT" },
  { from: "uu-17-2023", to: "permenkes-36-2012", type: "BERIRISAN" },
  { from: "permenkes-6-2026", to: "permenkes-82-2013", type: "MENCABUT" },
  { from: "uu-17-2023", to: "permenkes-6-2026", type: "TURUNAN" },
];

// Graph interaktif ringan (SVG) — tanpa dependensi; data dari store/relations di production.
const POS: Record<string, [number, number]> = {
  "uu-17-2023": [200, 60], "uu-27-2022": [480, 60],
  "pp-28-2024": [200, 190], "permenkes-36-2012": [480, 190],
  "permenkes-24-2022": [200, 320], "permenkes-269-2008": [480, 320],
  "permenkes-6-2026": [200, 450], "permenkes-82-2013": [480, 450],
};

export default function GraphPage() {
  const [sel, setSel] = useState<Edge | null>(null);
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-extrabold">Relationship Graph</h1>
      <p className="mt-1 text-sm text-ink-900/60">Klik edge untuk melihat jenis hubungan. Hierarki: UU → PP → Permenkes → Pedoman.</p>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-100 bg-white p-2">
        <svg viewBox="0 0 680 530" className="min-w-[640px]" role="img" aria-label="Graf hubungan regulasi">
          {EDGES.map((e, i) => {
            const [x1, y1] = POS[e.from]; const [x2, y2] = POS[e.to];
            const active = sel === e;
            return (
              <g key={i} onClick={() => setSel(e)} className="cursor-pointer">
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={e.type === "MENCABUT" ? "#dc2626" : active ? "#1f6e58" : "#94a3b8"}
                  strokeWidth={active ? 3 : 2} strokeDasharray={e.type === "BERIRISAN" ? "6 4" : undefined} />
                <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} textAnchor="middle" fontSize="11" fontWeight="bold"
                  fill={e.type === "MENCABUT" ? "#dc2626" : "#1f6e58"}>{e.type}</text>
              </g>
            );
          })}
          {NODES.map((n) => {
            const [x, y] = POS[n.slug];
            return (
              <g key={n.slug}>
                <a href={`/regulasi/${n.slug}`}>
                  <rect x={x - 95} y={y - 22} width={190} height={44} rx={12} fill="#eef7f4" stroke="#1f6e58" strokeWidth={1.5} />
                  <text x={x} y={y + 5} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#17463b">{n.label}</text>
                </a>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-3 text-sm" aria-live="polite">
        {sel ? <>Hubungan: <strong>{sel.from}</strong> —[{sel.type}]→ <strong>{sel.to}</strong></> : "Pilih garis hubungan untuk detail."}
      </p>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        {["MENCABUT", "MENGUBAH", "MELAKSANAKAN", "MERUJUK", "TURUNAN", "MEMPERKUAT", "BERIRISAN"].map((t) => (
          <span key={t} className="rounded-full bg-ink-50/60 border px-2 py-0.5 font-bold">{t}</span>
        ))}
      </div>
    </div>
  );
}
