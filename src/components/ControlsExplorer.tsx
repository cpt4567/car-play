"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  CONTROL_CATEGORIES,
  vehicleControls,
  type ControlCategory,
} from "@/data/vehicle-controls";

export function ControlsExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ControlCategory | "전체">("전체");
  const [focusId, setFocusId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vehicleControls
      .filter((item) => {
        if (category !== "전체" && item.category !== category) return false;
        if (!q) return true;
        const hay =
          `${item.name} ${item.how} ${item.meaning} ${item.practiceTip} ${item.tags.join(" ")}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => a.number - b.number);
  }, [query, category]);

  return (
    <div className="space-y-6">
      <section aria-labelledby="stalk-manual-title" className="space-y-4">
        <div>
          <p className="text-xs tracking-[0.25em] text-[#f5c542]">
            한눈에 보는 조작
          </p>
          <h2
            id="stalk-manual-title"
            className="mt-1 text-xl font-semibold text-[#f5f0e6]"
          >
            직관적인 한글 이미지 설명서
          </h2>
        </div>

        <div className="overflow-hidden rounded-sm border border-white/10 bg-[#0f151d]">
          <div className="relative aspect-video w-full border-b border-white/10">
            <Image
              src="/controls/controls-manual-ai-ko.png"
              alt="운전대 레버 한눈에 보기 한글 설명서. 왼쪽은 조명과 깜빡이, 오른쪽은 와이퍼와 워셔를 큰 화살표와 번호로 설명"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1100px"
              className="object-contain"
            />
          </div>

          <div className="grid gap-px bg-white/10 sm:grid-cols-2">
            <div className="bg-[#121a24] p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f5c542] text-sm font-bold text-[#111821]">
                  L
                </span>
                <h3 className="font-semibold text-[#f5f0e6]">
                  왼쪽 레버{" "}
                  <span className="text-xs font-normal text-[#8b93a7] ml-1">
                    조명 · 방향지시등
                  </span>
                </h3>
              </div>
              <ul className="space-y-3 text-sm text-[#c5cbd8]">
                <li className="flex gap-2">
                  <strong className="text-[#f5c542] min-w-12">위/아래</strong>{" "}
                  우측/좌측 깜빡이 (방향지시등)
                </li>
                <li className="flex gap-2">
                  <strong className="text-[#f5c542] min-w-12">앞/뒤</strong>{" "}
                  앞으로 밀면 상향등, 당기면 패싱
                </li>
                <li className="flex gap-2">
                  <strong className="text-[#f5c542] min-w-12">끝 회전</strong>{" "}
                  전조등 · 미등 · AUTO 조절
                </li>
                <li className="flex gap-2">
                  <strong className="text-[#f5c542] min-w-12">안쪽 링</strong>{" "}
                  안개등 ON / OFF
                </li>
              </ul>
            </div>
            <div className="bg-[#121a24] p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#73b8ff] text-sm font-bold text-[#111821]">
                  R
                </span>
                <h3 className="font-semibold text-[#f5f0e6]">
                  오른쪽 레버{" "}
                  <span className="text-xs font-normal text-[#8b93a7] ml-1">
                    와이퍼 · 워셔액
                  </span>
                </h3>
              </div>
              <ul className="space-y-3 text-sm text-[#c5cbd8]">
                <li className="flex gap-2">
                  <strong className="text-[#73b8ff] min-w-12">위/아래</strong>{" "}
                  와이퍼 속도 조절 (HI/LO/INT/OFF/MIST)
                </li>
                <li className="flex gap-2">
                  <strong className="text-[#73b8ff] min-w-12">당기기</strong>{" "}
                  앞유리 워셔액 분사
                </li>
                <li className="flex gap-2">
                  <strong className="text-[#73b8ff] min-w-12">끝 회전</strong>{" "}
                  뒷유리 와이퍼 조절
                </li>
                <li className="flex gap-2">
                  <strong className="text-[#73b8ff] min-w-12">안쪽 링</strong>{" "}
                  INT(간헐) 모드 시간 간격 조절
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">검색</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색 (예: 상향등, 패싱, 워셔, 미스트)"
            className="w-full rounded-sm border border-white/15 bg-[#121820] px-3 py-2.5 text-sm text-[#f5f0e6] outline-none ring-[#f5c542]/40 placeholder:text-[#6b7385] focus:ring-2"
          />
        </label>
        <p className="text-xs text-[#8b93a7] sm:w-36 sm:text-right">
          {filtered.length}개 조작
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={category === "전체"}
          onClick={() => setCategory("전체")}
          label="전체"
        />
        {CONTROL_CATEGORIES.map((c) => (
          <FilterChip
            key={c}
            active={category === c}
            onClick={() => setCategory(c)}
            label={c}
          />
        ))}
      </div>

      <div className="mb-2 grid gap-2 text-[11px] text-[#6b7385] sm:grid-cols-2">
        <p>
          <span className="text-[#f5c542]">번호</span> = 위 도해의 번호와
          같습니다
        </p>
        <p>
          <span className="text-[#7dcca0]">실전</span> = 바로 몸에 익힐 한 줄 팁
        </p>
      </div>

      <ul className="space-y-4">
        {filtered.map((item) => {
          const focused = focusId === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setFocusId(focused ? null : item.id)}
                className={`w-full border-l-2 bg-linear-to-r from-[#161d28] to-transparent px-4 py-4 text-left transition-colors sm:px-5 ${
                  focused
                    ? "border-[#f5c542]"
                    : "border-[#f5c542]/40 hover:border-[#f5c542]/80"
                }`}
              >
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-sm bg-[#f5c542] px-1.5 text-xs font-semibold text-[#121820]">
                    {item.number}
                  </span>
                  <span className="text-xs tracking-wide text-[#8b93a7]">
                    {item.category}
                  </span>
                  <h2 className="text-base font-medium text-[#f5f0e6]">
                    {item.name}
                  </h2>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#c5cbd8]">
                  <span className="text-[#f5c542]">조작 </span>
                  {item.how}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#8b93a7]">
                  {item.meaning}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#7dcca0]">
                  실전 · {item.practiceTip}
                </p>
              </button>
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-[#8b93a7]">
          검색 결과가 없습니다. 다른 키워드를 시도해 보세요.
        </p>
      )}

      <p className="text-[11px] leading-relaxed text-[#6b7385]">
        차종·연식에 따라 스위치 위치와 기호가 다를 수 있습니다. 실제 운전 전
        해당 차량 매뉴얼을 확인하세요. 도해는 일반적인 칼럼 레버 배치
        예시입니다.
      </p>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
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
