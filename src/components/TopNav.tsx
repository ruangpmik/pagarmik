"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

type IconName = "home" | "search" | "file" | "list" | "compare" | "network" | "clock" | "tag" | "book" | "scale" | "spark" | "user" | "shield";

const GROUPS: { title: string; desc: string; links: { href: string; label: string; icon: IconName }[] }[] = [
  {
    title: "Mulai",
    desc: "Beranda dan pencarian",
    links: [
      { href: "/", label: "Beranda", icon: "home" },
      { href: "/legal-search", label: "Pencarian hukum", icon: "search" },
    ],
  },
  {
    title: "Rujukan hukum",
    desc: "Katalog, pasal, dan relasi",
    links: [
      { href: "/regulasi", label: "Regulasi", icon: "file" },
      { href: "/pasal", label: "Pasal", icon: "list" },
      { href: "/bandingkan", label: "Bandingkan", icon: "compare" },
      { href: "/grafik", label: "Peta hubungan", icon: "network" },
      { href: "/timeline", label: "Linimasa", icon: "clock" },
    ],
  },
  {
    title: "Pengetahuan",
    desc: "Topik, artikel, dan AI riset",
    links: [
      { href: "/topik", label: "Topik", icon: "tag" },
      { href: "/artikel", label: "Artikel", icon: "book" },
      { href: "/analisis-kasus", label: "Analisis kasus", icon: "scale" },
      { href: "/ai", label: "Tanya AI", icon: "spark" },
    ],
  },
  {
    title: "Operasional",
    desc: "Intake dan pengelolaan kepatuhan",
    links: [
      { href: "/kepatuhan", label: "Pusat Kepatuhan", icon: "shield" },
      { href: "/kepatuhan/intake", label: "Intake Baru", icon: "list" },
    ],
  },
];

export function NavIcon({ name, className = "h-[18px] w-[18px]" }: { name: IconName; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    focusable: false as const,
  };

  switch (name) {
    case "home":
      return <svg {...common}><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></svg>;
    case "search":
      return <svg {...common}><circle cx="10.8" cy="10.8" r="6.6" /><path d="m16 16 4.5 4.5" /></svg>;
    case "file":
      return <svg {...common}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 12h6M9 16h6" /></svg>;
    case "list":
      return <svg {...common}><path d="M8 6h12M8 12h12M8 18h12" /><path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" /></svg>;
    case "compare":
      return <svg {...common}><rect x="3" y="4" width="7" height="16" rx="1" /><rect x="14" y="4" width="7" height="16" rx="1" /></svg>;
    case "network":
      return <svg {...common}><circle cx="12" cy="5" r="2.5" /><circle cx="5" cy="18" r="2.5" /><circle cx="19" cy="18" r="2.5" /><path d="m10.8 7.2-4.5 8.6m6.9-8.6 4.5 8.6M7.5 18h9" /></svg>;
    case "clock":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>;
    case "tag":
      return <svg {...common}><path d="M20 13 13 20 3.5 10.5V4h6.5z" /><circle cx="7.5" cy="7.5" r="1" /></svg>;
    case "book":
      return <svg {...common}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z" /><path d="M4 5.5v14A2.5 2.5 0 0 1 6.5 17H20M8 7h8M8 10h8" /></svg>;
    case "scale":
      return <svg {...common}><path d="M12 4v16M7 20h10M5 7h14M12 4l-2-2m2 2 2-2" /><path d="m5 7-3 6h6zM19 7l-3 6h6z" /></svg>;
    case "spark":
      return <svg {...common}><path d="m12 3 1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8z" /><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" /></svg>;
    case "user":
      return <svg {...common}><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-1.5a7 7 0 0 1 14 0V21z" /></svg>;
    case "shield":
      return <svg {...common}><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" /><path d="m9 12 2 2 4-4" /></svg>;
  }
}

export default function TopNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <aside className="app-sidebar print:hidden" aria-label="Navigasi PAGARMIK">
      <a href="/" className="flex items-center gap-3 rounded-xl p-2 focus-visible:outline hover:bg-slate-200/50 transition-colors" aria-label="PAGARMIK beranda">
        <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-slate-900/10 bg-white flex items-center justify-center p-1.5 shrink-0">
          <Image src="/icon.png" alt="PAGARMIK Logo" width={32} height={32} priority className="object-contain" />
        </div>
        <div className="min-w-0 leading-tight">
          <div className="flex items-center space-x-1.5">
            <span className="font-bold tracking-tight text-base text-slate-900">
              PAGAR<span className="text-teal-600">MIK</span>
            </span>
            <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-pmik-orange text-navy-950">
              RUANGPMIK
            </span>
          </div>
          <span className="block text-[11px] font-medium text-slate-500 mt-0.5">Legal Intelligence</span>
        </div>
      </a>

      <nav className="mt-6 min-h-0 flex-1 space-y-6 overflow-y-auto pb-4 pr-1" aria-label="Navigasi utama">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <h2 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">{group.title}</h2>
            <p className="mb-2 px-3 text-[10px] font-medium leading-snug text-slate-400">{group.desc}</p>
            <ul className="space-y-1">
              {group.links.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "flex min-h-10 items-center gap-3 rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline",
                        active
                          ? "bg-slate-200 text-teal-800"
                          : "text-slate-600 hover:bg-white/80 hover:text-slate-900",
                      ].join(" ")}
                    >
                      <NavIcon name={link.icon} className={`h-4 w-4 shrink-0 ${active ? "text-teal-700" : "text-slate-400"}`} />
                      <span className="flex-1 truncate">{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="pt-2 border-t border-slate-200">
        <a
          href="/profil"
          aria-current={isActive("/profil") ? "page" : undefined}
          className={[
            "flex min-h-10 items-center gap-3 rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline",
            isActive("/profil")
              ? "bg-slate-200 text-teal-800"
              : "text-slate-600 hover:bg-white/80 hover:text-slate-900",
          ].join(" ")}
        >
          <NavIcon name="user" className="h-4 w-4 shrink-0 text-slate-400" />
          <span>Profil & Simpanan</span>
        </a>
        <p className="mt-2.5 px-3 text-[10px] font-medium text-slate-400">
          Menjaga Batas · Melindungi Profesi
        </p>
      </div>
    </aside>
  );
}
