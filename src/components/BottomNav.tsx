"use client";

import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/TopNav";

const ITEMS = [
  { href: "/", label: "Beranda", icon: "home" as const },
  { href: "/legal-search", label: "Cari", icon: "search" as const },
  { href: "/ai", label: "Tanya AI", icon: "spark" as const },
  { href: "/regulasi", label: "Regulasi", icon: "file" as const },
  { href: "/profil", label: "Profil", icon: "user" as const },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Navigasi bawah"
    >
      <div className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));
          return (
            <a
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={[
                "flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-center text-xs transition-colors focus-visible:outline",
                active ? "text-pagar-800" : "text-ink-900/70 hover:text-pagar-800",
              ].join(" ")}
            >
              <NavIcon name={item.icon} className="h-[18px] w-[18px]" />
              <span className={active ? "font-semibold" : "font-medium"}>{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
