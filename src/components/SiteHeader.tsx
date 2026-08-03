import Link from "next/link";

const links = [
  { href: "/signs", label: "안내판" },
  { href: "/signals", label: "신호등" },
  { href: "/controls", label: "조작" },
  { href: "/laws", label: "도로교통법" },
  { href: "/direction", label: "방향감각" },
  { href: "/parking", label: "후진·주차" },
];

export function SiteHeader({ active }: { active?: string }) {
  return (
    <header className="relative z-20 border-b border-white/10 bg-[#0c1118]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-[0.18em] text-[#f5f0e6]">
            CAR PLAY
          </span>
          <span className="hidden text-xs tracking-wide text-[#8b93a7] sm:inline">
            운전 감각 연습
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => {
            const isActive = active === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-sm px-2.5 py-1.5 text-sm transition-colors sm:px-3 ${
                  isActive
                    ? "bg-[#f5c542]/15 text-[#f5c542]"
                    : "text-[#c5cbd8] hover:bg-white/5 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
