"use client";

import { useMemo, useState } from "react";
import {
  SIGN_CATEGORIES,
  roadSigns,
  type SignCategory,
} from "@/data/road-signs";
import { SignBadge } from "@/components/SignBadge";

export function SignsExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SignCategory | "전체">("전체");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return roadSigns.filter((sign) => {
      if (category !== "전체" && sign.category !== category) return false;
      if (!q) return true;
      const hay =
        `${sign.name} ${sign.meaning} ${sign.action} ${sign.tags.join(" ")}`.toLowerCase();
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
            placeholder="표지 검색 (예: 정지, 스쿨존, 횡단보도, 버스전용)"
            className="w-full rounded-sm border border-white/15 bg-[#121820] px-3 py-2.5 text-sm text-[#f5f0e6] outline-none ring-[#f5c542]/40 placeholder:text-[#6b7385] focus:ring-2"
          />
        </label>
        <p className="text-xs text-[#8b93a7] sm:w-40 sm:text-right">
          {filtered.length}개 표지
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={category === "전체"}
          onClick={() => setCategory("전체")}
          label="전체"
        />
        {SIGN_CATEGORIES.map((c) => (
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
          <span className="text-[#f5c542]">노란 마름모</span> = 주의 (앞에 위험)
        </p>
        <p>
          <span className="text-[#ff8f82]">빨간 원·팔각</span> = 규제 (하면 안 됨 / 의무)
        </p>
        <p>
          <span className="text-[#8ec8e8]">파란·초록</span> = 지시·안내 (가야 할 곳 / 정보)
        </p>
      </div>

      <ul className="space-y-3">
        {filtered.map((sign) => (
          <li
            key={sign.id}
            className="flex gap-4 border-l-2 border-[#f5c542]/70 bg-gradient-to-r from-[#161d28] to-transparent px-4 py-4 sm:px-5"
          >
            <SignBadge src={sign.image} alt={`${sign.name} 실제 교통표지`} />
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="text-xs tracking-wide text-[#8b93a7]">
                  {sign.category}
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-lg text-[#f5f0e6]">
                {sign.name}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[#c5cbd8]">
                {sign.meaning}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#f5c542]/90">
                <span className="font-medium text-[#f5c542]">운전 시 · </span>
                {sign.action}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {sign.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] text-[#6b7385] before:content-['#']"
                  >
                    {t}
                  </span>
                ))}
                <a
                  href={`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(sign.sourceFile.replaceAll(" ", "_"))}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-1 text-[11px] text-[#6b7385] underline decoration-white/20 underline-offset-2 hover:text-[#c5cbd8]"
                >
                  이미지 출처
                </a>
              </div>
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
        대한민국 교통표지 벡터·현장 사진은 Wikimedia Commons 자료를 로컬 이미지로
        사용했습니다. 각 항목의 출처 링크에서 저작자와 라이선스를 확인할 수 있으며,
        현장 표지·보조표지·신호가 우선입니다.
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
