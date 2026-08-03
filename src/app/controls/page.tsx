import { SiteHeader } from "@/components/SiteHeader";
import { ControlsExplorer } from "@/components/ControlsExplorer";

export default function ControlsPage() {
  return (
    <div className="road-atmosphere min-h-full">
      <SiteHeader active="/controls" />
      <main className="mx-auto max-w-5xl px-5 py-10">
        <p className="text-xs tracking-[0.3em] text-[#f5c542]">COLUMN STALKS</p>
        <h1 className="font-display mt-2 text-4xl tracking-wide text-[#f5f0e6]">
          와이퍼 · 상향등 조작
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#8b93a7]">
          스티어링 옆 레버로 하는 일. 상향등·패싱·깜빡이, 와이퍼·워셔·미스트까지
          한국어 도해의 화살표와 번호를 따라 익힙니다.
        </p>
        <div className="mt-8">
          <ControlsExplorer />
        </div>
      </main>
    </div>
  );
}
