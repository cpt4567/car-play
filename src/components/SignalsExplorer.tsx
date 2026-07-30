"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  SIGNAL_CATEGORIES,
  trafficSignals,
  type SignalCategory,
} from "@/data/traffic-signals";

export function SignalsExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SignalCategory | "전체">("전체");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return trafficSignals.filter((signal) => {
      if (category !== "전체" && signal.category !== category) return false;
      if (!q) return true;
      const hay =
        `${signal.name} ${signal.meaning} ${signal.action} ${signal.tags.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">검색</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="신호 검색 (예: 좌회전, 점멸, 황색, 보행자)"
            className="w-full rounded-sm border border-white/15 bg-[#121820] px-3 py-2.5 text-sm text-[#f5f0e6] outline-none ring-[#f5c542]/40 placeholder:text-[#6b7385] focus:ring-2"
          />
        </label>
        <p className="text-xs text-[#8b93a7] sm:w-40 sm:text-right">
          {filtered.length}개 신호
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={category === "전체"}
          onClick={() => setCategory("전체")}
          label="전체"
        />
        {SIGNAL_CATEGORIES.map((c) => (
          <FilterChip
            key={c}
            active={category === c}
            onClick={() => setCategory(c)}
            label={c}
          />
        ))}
      </div>

      <div className="mb-2 grid gap-2 text-[11px] text-[#6b7385] sm:grid-cols-3">
        <p>
          <span className="text-[#7dcca0]">녹색</span> = 진행 가능
        </p>
        <p>
          <span className="text-[#f5c542]">황색</span> = 정지 준비 / 점멸 시 주의 통과
        </p>
        <p>
          <span className="text-[#ff8f82]">적색</span> = 정지 / 점멸 시 일시정지 후 확인
        </p>
      </div>

      <ul className="space-y-4">
        {filtered.map((signal) => {
          const isGif = signal.image.endsWith(".gif");
          return (
            <li
              key={signal.id}
              className="border-l-2 border-[#f5c542]/70 bg-gradient-to-r from-[#161d28] to-transparent px-4 py-4 sm:px-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="relative mx-auto h-28 w-full max-w-[320px] shrink-0 overflow-hidden rounded-sm bg-black sm:mx-0 sm:h-24 sm:w-64">
                  {isGif ? (
                    // eslint-disable-next-line @next/next/no-img-element -- GIF 애니메이션 유지
                    <img
                      src={signal.image}
                      alt={`${signal.name} 실제 신호등`}
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <Image
                      src={signal.image}
                      alt={`${signal.name} 실제 신호등`}
                      fill
                      sizes="256px"
                      className="object-contain p-2"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs tracking-wide text-[#8b93a7]">
                      {signal.category}
                    </span>
                  </div>
                  <h2 className="font-[family-name:var(--font-display)] text-lg text-[#f5f0e6]">
                    {signal.name}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#c5cbd8]">
                    {signal.meaning}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#f5c542]/90">
                    <span className="font-medium text-[#f5c542]">운전 시 · </span>
                    {signal.action}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {signal.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] text-[#6b7385] before:content-['#']"
                      >
                        {t}
                      </span>
                    ))}
                    <a
                      href={`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(signal.sourceFile.replaceAll(" ", "_"))}`}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-1 text-[11px] text-[#6b7385] underline decoration-white/20 underline-offset-2 hover:text-[#c5cbd8]"
                    >
                      이미지 출처
                    </a>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="py-10 text-center text-sm text-[#8b93a7]">
            검색 결과가 없습니다. 다른 키워드를 시도해 보세요.
          </li>
        )}
      </ul>

      <p className="border-t border-white/10 pt-4 text-xs leading-relaxed text-[#6b7385]">
        대한민국 차량·보행자 신호등 도안·시뮬레이션 이미지를 Wikimedia Commons에서
        로컬로 사용합니다. 현장 신호·보조표지·경찰 수신호가 우선이며, 우회전 전용신호
        등은 교차로마다 다를 수 있습니다.
      </p>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-sm px-3 py-1.5 text-xs transition-colors ${
        active
          ? "bg-[#f5c542] text-[#121820]"
          : "border border-white/15 text-[#c5cbd8] hover:border-white/30"
      }`}
    >
      {label}
    </button>
  );
}
