"use client";

import { useCallback, useEffect, useState } from "react";
import { directionScenarios, type DirectionScenario } from "@/data/direction-scenarios";
import { isTypingTarget } from "@/lib/keyboard";

export function DirectionQuiz() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, answered: 0 });
  const [done, setDone] = useState(false);

  const scenario = directionScenarios[index];
  const answered = selected !== null;
  const isCorrect = selected === scenario?.correctChoiceId;

  const next = useCallback(() => {
    if (index >= directionScenarios.length - 1) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }, [index]);

  const choose = useCallback(
    (id: string) => {
      if (selected || !scenario) return;
      setSelected(id);
      setScore((s) => ({
        answered: s.answered + 1,
        correct: s.correct + (id === scenario.correctChoiceId ? 1 : 0),
      }));
    },
    [selected, scenario],
  );

  const reset = () => {
    setIndex(0);
    setSelected(null);
    setScore({ correct: 0, answered: 0 });
    setDone(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (answered && !done) next();
        return;
      }

      if (!answered && scenario) {
        const n = Number(e.key);
        if (n >= 1 && n <= scenario.choices.length) {
          e.preventDefault();
          choose(scenario.choices[n - 1].id);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answered, done, next, scenario, choose]);

  if (done) {
    return (
      <div className="mx-auto max-w-xl py-8 text-center">
        <p className="text-sm tracking-widest text-[#f5c542]">COMPLETE</p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[#f5f0e6]">
          {score.correct} / {score.answered}
        </h2>
        <p className="mt-3 text-sm text-[#c5cbd8]">
          후진에서는 항상 <strong className="text-[#f5c542]">차미가 갈 쪽 = 핸들 방향</strong>으로
          기억하세요.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 bg-[#f5c542] px-5 py-2.5 text-sm font-medium text-[#121820]"
        >
          다시 풀기
        </button>
      </div>
    );
  }

  if (!scenario) return null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <Diagram scenario={scenario} highlight={answered} />

      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-[#8b93a7]">
          <span className="rounded-sm border border-white/15 px-2 py-0.5">
            {scenario.level}
          </span>
          <span>
            {index + 1} / {directionScenarios.length}
          </span>
          <span>
            정답 {score.correct}/{score.answered || 0}
          </span>
          <span
            className={
              scenario.gear === "reverse" ? "text-[#f5c542]" : "text-[#8ec8e8]"
            }
          >
            {scenario.gear === "reverse" ? "후진" : "전진"}
          </span>
        </div>

        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#f5f0e6]">
          {scenario.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#c5cbd8]">
          {scenario.situation}
        </p>

        <ul className="mt-6 space-y-2">
          {scenario.choices.map((c, i) => {
            let style =
              "border-white/15 hover:border-[#f5c542]/50 hover:bg-white/5";
            if (answered) {
              if (c.id === scenario.correctChoiceId)
                style = "border-[#3d9a6a] bg-[#3d9a6a]/15";
              else if (c.id === selected)
                style = "border-[#e85d4c] bg-[#e85d4c]/10";
              else style = "border-white/10 opacity-50";
            }
            return (
              <li key={c.id}>
                <button
                  type="button"
                  disabled={answered}
                  onClick={() => choose(c.id)}
                  className={`flex w-full items-start gap-3 rounded-sm border px-3 py-3 text-left text-sm text-[#f5f0e6] transition-colors ${style}`}
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-current text-[11px] text-[#8b93a7]">
                    {i + 1}
                  </span>
                  {c.label}
                </button>
              </li>
            );
          })}
        </ul>

        {answered && (
          <div className="mt-5 border-l-2 border-[#f5c542] bg-[#161d28] px-4 py-3">
            <p
              className={`text-sm font-medium ${isCorrect ? "text-[#7dcca0]" : "text-[#ff8f82]"}`}
            >
              {isCorrect ? "정답" : "오답"} · 해설
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-[#c5cbd8]">
              {scenario.explanation}
            </p>
            <button
              type="button"
              onClick={next}
              className="mt-4 text-sm text-[#f5c542] underline-offset-4 hover:underline"
            >
              다음 문제 (Enter / Space)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Diagram({
  scenario,
  highlight,
}: {
  scenario: DirectionScenario;
  highlight: boolean;
}) {
  const angle = scenario.carAngleDeg;
  const gear = scenario.gear;
  const side = scenario.targetSide;

  return (
    <div className="relative aspect-square max-h-[420px] w-full overflow-hidden rounded-sm border border-white/10 bg-[#0a0e14]">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent 49%, #f5c54233 49%, #f5c54233 51%, transparent 51%), linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px)",
          backgroundSize: "100% 100%, 40px 40px, 40px 40px",
        }}
      />
      <svg viewBox="0 0 200 200" className="relative h-full w-full p-4">
        {side !== "none" && (
          <rect
            x={side === "right" ? 130 : side === "left" ? 20 : 70}
            y={side === "behind" ? 140 : 70}
            width={side === "behind" ? 60 : 50}
            height={side === "behind" ? 40 : 60}
            fill="#f5c54222"
            stroke="#f5c542"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
        )}
        <g transform={`translate(100 100) rotate(${angle})`}>
          <rect
            x={-28}
            y={-14}
            width={56}
            height={28}
            rx={3}
            fill="#2a3344"
            stroke="#f5f0e6"
            strokeWidth="2"
          />
          <rect x={14} y={-10} width={10} height={20} fill="#f5c542" opacity={0.9} />
          <text
            x={-18}
            y={4}
            fill="#8b93a7"
            fontSize="8"
            style={{ fontFamily: "sans-serif" }}
          >
            FRONT
          </text>
          {highlight && gear === "reverse" && side === "right" && (
            <path
              d="M -20 0 Q -40 40 -10 55"
              fill="none"
              stroke="#f5c542"
              strokeWidth="2"
              markerEnd="url(#arrow)"
            />
          )}
          {highlight && gear === "reverse" && side === "left" && (
            <path
              d="M -20 0 Q -40 -40 -10 -55"
              fill="none"
              stroke="#f5c542"
              strokeWidth="2"
            />
          )}
        </g>
        <defs>
          <marker
            id="arrow"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill="#f5c542" />
          </marker>
        </defs>
      </svg>
      <p className="absolute bottom-3 left-3 right-3 text-center text-[11px] text-[#8b93a7]">
        탑다운 · 노란 부분이 차량 전방 · 점선은 목표 공간
      </p>
    </div>
  );
}
