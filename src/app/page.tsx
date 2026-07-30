import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

const modules = [
  {
    href: "/signs",
    label: "안내판",
    title: "도로에서 보는 표지 종류",
    body: "주의·규제·지시·노면·안내. 모양으로 구분하고 대처를 바로 확인.",
  },
  {
    href: "/signals",
    label: "신호등",
    title: "적·황·녹, 화살표, 점멸",
    body: "실제 신호등 이미지로 의미가 무엇인지, 앞에서 무엇을 할지 확인.",
  },
  {
    href: "/direction",
    label: "방향감각",
    title: "후진 핸들, 왜 헷갈릴까",
    body: "차미가 갈 쪽 = 핸들 방향. BeamNG·실차와 같은 규칙으로 퀴즈 연습.",
  },
  {
    href: "/parking",
    label: "후진·주차",
    title: "탑다운으로 반복 주차",
    body: "평행·직각·후진 코스. 키보드로 회사에서도 감각을 굳힙니다.",
  },
  {
    href: "/laws",
    label: "도로교통법",
    title: "실전에 필요한 핵심만",
    body: "신호·속도·주차·보행자·고속도로. 검색과 카테고리로 바로 확인.",
  },
];

export default function HomePage() {
  return (
    <div className="road-atmosphere relative min-h-full">
      <div className="lane-lines pointer-events-none absolute inset-0 opacity-60" />
      <SiteHeader />

      <main className="relative mx-auto flex min-h-[calc(100vh-65px)] max-w-6xl flex-col justify-center px-5 py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="animate-rise text-xs tracking-[0.35em] text-[#f5c542]">
            DESK · WHEEL · ROAD
          </p>
          <h1 className="animate-rise-delay mt-4 font-[family-name:var(--font-display)] text-5xl font-semibold tracking-[0.12em] text-[#f5f0e6] sm:text-7xl">
            CAR PLAY
          </h1>
          <p className="animate-rise-delay-2 mt-5 max-w-md text-base leading-relaxed text-[#c5cbd8] sm:text-lg">
            T300과 BeamNG로 익히던 후진·주차 감각을, 회사 책상에서도. 안내판·방향감각·
            도로교통법까지 한곳에서.
          </p>
          <div className="animate-rise-delay-2 mt-8 flex flex-wrap gap-3">
            <Link
              href="/parking"
              className="bg-[#f5c542] px-5 py-2.5 text-sm font-semibold tracking-wide text-[#121820] transition hover:bg-[#ffd56a]"
            >
              주차 연습 시작
            </Link>
            <Link
              href="/direction"
              className="border border-white/25 px-5 py-2.5 text-sm text-[#f5f0e6] transition hover:border-[#f5c542] hover:text-[#f5c542]"
            >
              방향감각 퀴즈
            </Link>
          </div>
        </div>

        <div className="lane-pulse mt-16 h-px max-w-xl bg-gradient-to-r from-[#f5c542]/80 via-[#f5c542]/25 to-transparent" />

        <section className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {modules.map((m) => (
            <Link key={m.href} href={m.href} className="group block">
              <p className="text-xs tracking-[0.2em] text-[#f5c542]">{m.label}</p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl tracking-wide text-[#f5f0e6] group-hover:text-[#f5c542]">
                {m.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#8b93a7]">{m.body}</p>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
