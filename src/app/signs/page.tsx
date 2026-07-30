import { SiteHeader } from "@/components/SiteHeader";
import { SignsExplorer } from "@/components/SignsExplorer";

export default function SignsPage() {
  return (
    <div className="road-atmosphere min-h-full">
      <SiteHeader active="/signs" />
      <main className="mx-auto max-w-3xl px-5 py-10">
        <p className="text-xs tracking-[0.3em] text-[#f5c542]">ROAD SIGNS</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl tracking-wide text-[#f5f0e6]">
          도로 안내판·표지
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#8b93a7]">
          주의·규제·지시·보조·노면·안내. 모양만 봐도 종류를 구분하고, 앞에서 무엇을
          해야 하는지 바로 확인합니다.
        </p>
        <div className="mt-8">
          <SignsExplorer />
        </div>
      </main>
    </div>
  );
}
