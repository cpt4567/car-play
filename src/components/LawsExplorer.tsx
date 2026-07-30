"use client";

import { useMemo, useState } from "react";
import {
  LAW_CATEGORIES,
  trafficLaws,
  type LawCategory,
  type LawSeverity,
} from "@/data/traffic-laws";

const severityStyle: Record<LawSeverity, string> = {
  info: "border-[#3d7ea6]/50 text-[#8ec8e8]",
  caution: "border-[#f5c542]/50 text-[#f5c542]",
  critical: "border-[#e85d4c]/50 text-[#ff8f82]",
};

const severityLabel: Record<LawSeverity, string> = {
  info: "참고",
  caution: "주의",
  critical: "중요",
};

export function LawsExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<LawCategory | "전체">("전체");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return trafficLaws.filter((law) => {
      if (category !== "전체" && law.category !== category) return false;
      if (!q) return true;
      const hay = `${law.title} ${law.summary} ${law.practiceTip} ${law.tags.join(" ")}`.toLowerCase();
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
            placeholder="키워드 검색 (예: 후진, 횡단보도, 스쿨존)"
            className="w-full rounded-sm border border-white/15 bg-[#121820] px-3 py-2.5 text-sm text-[#f5f0e6] outline-none ring-[#f5c542]/40 placeholder:text-[#6b7385] focus:ring-2"
          />
        </label>
        <p className="text-xs text-[#8b93a7] sm:w-40 sm:text-right">
          {filtered.length}개 항목
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={category === "전체"}
          onClick={() => setCategory("전체")}
          label="전체"
        />
        {LAW_CATEGORIES.map((c) => (
          <FilterChip
            key={c}
            active={category === c}
            onClick={() => setCategory(c)}
            label={c}
          />
        ))}
      </div>

      <ul className="space-y-4">
        {filtered.map((law) => (
          <li
            key={law.id}
            className="border-l-2 border-[#f5c542]/70 bg-gradient-to-r from-[#161d28] to-transparent px-4 py-4 sm:px-5"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-xs tracking-wide text-[#8b93a7]">
                {law.category}
              </span>
              <span
                className={`rounded-sm border px-1.5 py-0.5 text-[10px] tracking-wider uppercase ${severityStyle[law.severity]}`}
              >
                {severityLabel[law.severity]}
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-lg text-[#f5f0e6]">
              {law.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#c5cbd8]">
              {law.summary}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#f5c542]/90">
              <span className="font-medium text-[#f5c542]">실전 팁 · </span>
              {law.practiceTip}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {law.tags.map((t) => (
                <span
                  key={t}
                  className="text-[11px] text-[#6b7385] before:content-['#']"
                >
                  {t}
                </span>
              ))}
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="py-10 text-center text-sm text-[#8b93a7]">
            검색 결과가 없습니다. 다른 키워드를 시도해 보세요.
          </li>
        )}
      </ul>

      <p className="border-t border-white/10 pt-4 text-xs leading-relaxed text-[#6b7385]">
        본 내용은 학습·참고용 요약이며 법령 전문이 아닙니다. 최신 도로교통법·지자체
        고시는 공식 출처를 확인하세요.
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
