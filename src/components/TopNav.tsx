"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

type IconName = "home" | "search" | "file" | "list" | "compare" | "network" | "clock" | "tag" | "book" | "scale" | "spark" | "user";

const GROUPS: { title: string; links: { href: string; label: string; icon: IconName }[] }[] = [
  {
    title: "Mulai",
    links: [
      { href: "/", label: "Beranda", icon: "home" },
      { href: "/legal-search", label: "Pencarian hukum", icon: "search" },
    ],
  },
  {
    title: "Rujukan hukum",
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
    links: [
      { href: "/topik", label: "Topik", icon: "tag" },
      { href: "/artikel", label: "Artikel", icon: "book" },
      { href: "/analisis-kasus", label: "Analisis kasus", icon: "scale" },
      { href: "/ai", label: "Tanya AI", icon: "spark" },
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
  }
}

export default function TopNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <aside className="app-sidebar" aria-label="Navigasi PAGARMIK">
      <a href="/" className="flex items-center gap-3 rounded-lg focus-visible:outline" aria-label="PAGARMIK beranda">
        <Image src="/icon.png" alt="" width={42} height={42} priority />
        <span className="min-w-0 leading-tight">
          <span className="block text-base font-bold tracking-tight text-pagar-800">PAGARMIK</span>
          <span className="mt-0.5 block text-xs font-semibold text-ink-900/70">by RUANGPMIK</span>
        </span>
      </a>

      <nav className="mt-8 min-h-0 flex-1 space-y-6 overflow-y-auto pb-4" aria-label="Navigasi utama">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <h2 className="mb-2 px-3 text-xs font-semibold text-ink-900/65">{group.title}</h2>
            <ul className="space-y-1">
              {group.links.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline",
                        active
                          ? "bg-[var(--nav-active)] text-pagar-800"
                          : "text-ink-900/75 hover:bg-white/70 hover:text-pagar-800",
                      ].join(" ")}
                    >
                      <NavIcon name={link.icon} className="h-4 w-4 shrink-0" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <a
        href="/profil"
        aria-current={isActive("/profil") ? "page" : undefined}
        className={[
          "flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline",
          isActive("/profil")
            ? "bg-[var(--nav-active)] text-pagar-800"
            : "text-ink-900/75 hover:bg-white/70 hover:text-pagar-800",
        ].join(" ")}
      >
        <NavIcon name="user" className="h-4 w-4 shrink-0" />
        Profil
      </a>
      <p className="mt-3 px-3 text-xs text-ink-900/65">Menjaga Batas. Melindungi Profesi.</p>
    </aside>
  );
}
