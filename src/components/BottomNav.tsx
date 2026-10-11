"use client";

const ITEMS = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/legal-search", label: "Search", icon: "⌕" },
  { href: "/ai", label: "AI", icon: "✦" },
  { href: "/regulasi", label: "Regulasi", icon: "▤" },
  { href: "/profil", label: "Profile", icon: "○" },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-white/95 backdrop-blur md:hidden"
      aria-label="Navigasi bawah"
    >
      <div className="grid grid-cols-5">
        {ITEMS.map((it) => (
          <a
            key={it.href + it.label}
            href={it.href}
            className="flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-ink-900/70 active:text-pagar-700"
          >
            <span className="text-lg leading-none" aria-hidden>{it.icon}</span>
            {it.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
