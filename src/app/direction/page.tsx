import { SiteHeader } from "@/components/SiteHeader";
import { DirectionQuiz } from "@/components/DirectionQuiz";

export default function DirectionPage() {
  return (
    <div className="road-atmosphere min-h-full">
      <SiteHeader active="/direction" />
      <main className="mx-auto max-w-5xl px-5 py-10">
        <p className="text-xs tracking-[0.3em] text-[#f5c542]">ORIENTATION</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-wide text-[#f5f0e6]">
          방향감각 연습
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#8b93a7]">
          후진이 헷갈리는 이유는 차 앞이 반대로 스윙하기 때문입니다.{" "}
          <span className="text-[#f5c542]">차미가 들어갈 쪽 = 핸들 방향</span>으로
          고정하세요. 숫자 키 1–4로 선택, Enter로 다음.
        </p>
        <div className="mt-8">
          <DirectionQuiz />
        </div>
      </main>
    </div>
  );
}
