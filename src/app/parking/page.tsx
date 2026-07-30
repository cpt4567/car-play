import { SiteHeader } from "@/components/SiteHeader";
import { ParkingSimulator } from "@/components/ParkingSimulator";

export default function ParkingPage() {
  return (
    <div className="road-atmosphere min-h-full">
      <SiteHeader active="/parking" />
      <main className="mx-auto max-w-5xl px-5 py-6">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-[#f5f0e6]">
            후진·주차 연습
          </h1>
          <p className="text-xs tracking-[0.3em] text-[#f5c542]">REVERSE · PARK</p>
        </div>
        <div className="mt-5">
          <ParkingSimulator />
        </div>
      </main>
    </div>
  );
}
