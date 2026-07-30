import { SiteHeader } from "@/components/SiteHeader";
import { LawsExplorer } from "@/components/LawsExplorer";

export default function LawsPage() {
  return (
    <div className="road-atmosphere min-h-full">
      <SiteHeader active="/laws" />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <p className="text-xs tracking-[0.3em] text-[#f5c542]">RULES</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-wide text-[#f5f0e6]">
          도로교통법 핵심
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#8b93a7]">
          실전 운전·면허 운전에 바로 쓰는 요약입니다. 주차·후진 연습 전후로 필요한
          항목만 빠르게 훑어보세요.
        </p>
        <div className="mt-8">
          <LawsExplorer />
        </div>
      </main>
    </div>
  );
}
