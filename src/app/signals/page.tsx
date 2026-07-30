import { SiteHeader } from "@/components/SiteHeader";
import { SignalsExplorer } from "@/components/SignalsExplorer";

export default function SignalsPage() {
  return (
    <div className="road-atmosphere min-h-full">
      <SiteHeader active="/signals" />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <p className="text-xs tracking-[0.3em] text-[#f5c542]">TRAFFIC LIGHTS</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-wide text-[#f5f0e6]">
          차량 신호등
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#8b93a7]">
          녹색·황색·적색, 좌회전 화살표, 점멸까지. 실제 신호등 이미지로 의미가 무엇인지,
          앞에서 무엇을 해야 하는지 확인합니다.
        </p>
        <div className="mt-8">
          <SignalsExplorer />
        </div>
      </main>
    </div>
  );
}
