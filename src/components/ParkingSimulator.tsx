"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { parkingCourses, type ParkingCourse } from "@/data/parking-courses";
import { isTypingTarget, normalizeKey } from "@/lib/keyboard";
import {
  DEFAULT_CAR,
  carHitsAabb,
  gearLabel,
  headingDiffDeg,
  stepCar,
  steerHint,
  type CarState,
  type ControlInput,
} from "@/lib/parking-physics";

const DRIVE_KEYS = new Set([
  "w",
  "a",
  "s",
  "d",
  "r",
  "space",
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright",
]);

function initialCar(course: ParkingCourse): CarState {
  return {
    x: course.carStart.x,
    y: course.carStart.y,
    heading: course.carStart.heading,
    speed: 0,
    steer: 0,
  };
}

export function ParkingSimulator() {
  const [courseId, setCourseId] = useState(parkingCourses[0].id);
  const course = parkingCourses.find((c) => c.id === courseId) ?? parkingCourses[0];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const carRef = useRef<CarState>(initialCar(course));
  const inputRef = useRef<ControlInput>({ throttle: 0, steer: 0, brake: false });
  const keysRef = useRef<Set<string>>(new Set());
  const flagsRef = useRef({ collided: false, success: false });
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const courseRef = useRef(course);
  courseRef.current = course;

  const [hud, setHud] = useState({
    gear: "정지",
    hint: "조향 중립",
    collided: false,
    success: false,
  });

  const reset = useCallback(() => {
    carRef.current = initialCar(courseRef.current);
    inputRef.current = { throttle: 0, steer: 0, brake: false };
    flagsRef.current = { collided: false, success: false };
    setHud({ gear: "정지", hint: "조향 중립", collided: false, success: false });
  }, []);

  useEffect(() => {
    reset();
  }, [courseId, reset]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = normalizeKey(e);
      if (!DRIVE_KEYS.has(k)) return;
      e.preventDefault();
      keysRef.current.add(k);
      if (k === "r") reset();
    };
    const up = (e: KeyboardEvent) => {
      keysRef.current.delete(normalizeKey(e));
    };
    const blur = () => keysRef.current.clear();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, [reset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const syncInput = () => {
      const keys = keysRef.current;
      let throttle = 0;
      let steer = 0;
      if (keys.has("w") || keys.has("arrowup")) throttle += 1;
      if (keys.has("s") || keys.has("arrowdown")) throttle -= 1;
      if (keys.has("d") || keys.has("arrowright")) steer += 1;
      if (keys.has("a") || keys.has("arrowleft")) steer -= 1;
      inputRef.current = {
        throttle,
        steer,
        brake: keys.has("space"),
      };
    };

    const checkCollision = (car: CarState, c: ParkingCourse) => {
      for (const o of c.obstacles) {
        if (carHitsAabb(car, o.x, o.y, o.w, o.h)) return true;
      }
      return (
        car.x < 10 ||
        car.y < 10 ||
        car.x > c.width - 10 ||
        car.y > c.height - 10
      );
    };

    const checkSuccess = (car: CarState, c: ParkingCourse) => {
      const t = c.target;
      const cx = car.x + Math.cos(car.heading) * DEFAULT_CAR.wheelbase * 0.45;
      const cy = car.y + Math.sin(car.heading) * DEFAULT_CAR.wheelbase * 0.45;
      const dist = Math.hypot(cx - (t.x + t.w / 2), cy - (t.y + t.h / 2));
      const hdg = headingDiffDeg(car.heading, t.heading);
      return (
        dist <= c.success.maxCenterDist &&
        hdg <= c.success.maxHeadingDeg &&
        Math.abs(car.speed) < 12
      );
    };

    const draw = (
      car: CarState,
      c: ParkingCourse,
      collided: boolean,
      success: boolean,
    ) => {
      canvas.width = c.width;
      canvas.height = c.height;
      ctx.clearRect(0, 0, c.width, c.height);

      const g = ctx.createLinearGradient(0, 0, c.width, c.height);
      g.addColorStop(0, "#151b24");
      g.addColorStop(1, "#0c1018");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, c.width, c.height);

      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < c.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, c.height);
        ctx.stroke();
      }

      const t = c.target;
      ctx.fillStyle = success ? "rgba(61,154,106,0.35)" : "rgba(245,197,66,0.18)";
      ctx.strokeStyle = success ? "#3d9a6a" : "#f5c542";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.fillRect(t.x, t.y, t.w, t.h);
      ctx.strokeRect(t.x, t.y, t.w, t.h);
      ctx.setLineDash([]);
      ctx.fillStyle = "#f5c542";
      ctx.font = "11px sans-serif";
      ctx.fillText("GOAL", t.x + 8, t.y + 16);

      for (const o of c.obstacles) {
        if (o.kind === "car") {
          ctx.fillStyle = "#2a3344";
          ctx.strokeStyle = "#8b93a7";
        } else if (o.kind === "curb") {
          ctx.fillStyle = "#3a3428";
          ctx.strokeStyle = "#f5c54288";
        } else {
          ctx.fillStyle = "#1e2430";
          ctx.strokeStyle = "#c5cbd8";
        }
        ctx.lineWidth = 1.5;
        ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.strokeRect(o.x, o.y, o.w, o.h);
        if (o.label) {
          ctx.fillStyle = "#8b93a7";
          ctx.font = "10px sans-serif";
          ctx.fillText(o.label, o.x + 4, o.y + 14);
        }
      }

      const rearToCenter = DEFAULT_CAR.wheelbase * 0.45;
      const cx = car.x + Math.cos(car.heading) * rearToCenter;
      const cy = car.y + Math.sin(car.heading) * rearToCenter;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(car.heading);
      ctx.fillStyle = collided ? "#e85d4c" : "#3d4a5c";
      ctx.strokeStyle = "#f5f0e6";
      ctx.lineWidth = 2;
      const hw = DEFAULT_CAR.width / 2;
      const hl = DEFAULT_CAR.length / 2;
      ctx.beginPath();
      ctx.moveTo(-hl + 3, -hw);
      ctx.lineTo(hl - 3, -hw);
      ctx.quadraticCurveTo(hl, -hw, hl, -hw + 3);
      ctx.lineTo(hl, hw - 3);
      ctx.quadraticCurveTo(hl, hw, hl - 3, hw);
      ctx.lineTo(-hl + 3, hw);
      ctx.quadraticCurveTo(-hl, hw, -hl, hw - 3);
      ctx.lineTo(-hl, -hw + 3);
      ctx.quadraticCurveTo(-hl, -hw, -hl + 3, -hw);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#f5c542";
      ctx.fillRect(hl - 10, -hw + 3, 8, DEFAULT_CAR.width - 6);
      ctx.fillStyle = "#e85d4c";
      ctx.fillRect(-hl + 2, -6, 5, 12);
      ctx.strokeStyle = "#f5c542";
      ctx.lineWidth = 2;
      for (const side of [-1, 1] as const) {
        ctx.save();
        ctx.translate(DEFAULT_CAR.wheelbase * 0.35, side * (hw + 2));
        ctx.rotate(car.steer);
        ctx.beginPath();
        ctx.moveTo(-6, 0);
        ctx.lineTo(6, 0);
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();

      if (success) {
        ctx.fillStyle = "rgba(12,16,24,0.55)";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = "#f5c542";
        ctx.font = "bold 28px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("주차 성공", c.width / 2, c.height / 2);
        ctx.font = "14px sans-serif";
        ctx.fillStyle = "#c5cbd8";
        ctx.fillText(
          "R 키로 리셋 · 다른 코스도 도전해 보세요",
          c.width / 2,
          c.height / 2 + 28,
        );
        ctx.textAlign = "start";
      } else if (collided) {
        ctx.fillStyle = "rgba(232,93,76,0.12)";
        ctx.fillRect(0, 0, c.width, c.height);
      }
    };

    const loop = (ts: number) => {
      const dt = Math.min(0.033, (ts - (lastRef.current || ts)) / 1000);
      lastRef.current = ts;
      const c = courseRef.current;

      syncInput();
      let car = carRef.current;
      let { collided, success } = flagsRef.current;

      if (!collided && !success) {
        car = stepCar(car, inputRef.current, dt);
        if (checkCollision(car, c)) {
          collided = true;
          car = { ...car, speed: 0 };
        } else if (checkSuccess(car, c)) {
          success = true;
          car = { ...car, speed: 0 };
        }
        carRef.current = car;
        flagsRef.current = { collided, success };
      }

      draw(car, c, collided, success);

      const gear = gearLabel(car.speed);
      const hint = steerHint(car.speed, car.steer);
      setHud((prev) => {
        if (
          prev.gear === gear &&
          prev.hint === hint &&
          prev.collided === collided &&
          prev.success === success
        ) {
          return prev;
        }
        return { gear, hint, collided, success };
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {parkingCourses.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCourseId(c.id)}
            className={`rounded-sm px-3 py-1.5 text-xs transition-colors ${
              courseId === c.id
                ? "bg-[#f5c542] text-[#121820]"
                : "border border-white/15 text-[#c5cbd8] hover:border-white/30"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <p className="text-sm text-[#c5cbd8]">{course.description}</p>

      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="rounded-sm border border-white/15 px-2 py-1 text-[#f5f0e6]">
          기어 <strong className="text-[#f5c542]">{hud.gear}</strong>
        </span>
        <span className="rounded-sm border border-white/15 px-2 py-1 text-[#c5cbd8]">
          {hud.hint}
        </span>
        {hud.collided && <span className="text-[#ff8f82]">충돌 — R 로 리셋</span>}
        {hud.success && <span className="text-[#7dcca0]">성공!</span>}
        <button
          type="button"
          onClick={reset}
          className="ml-auto border border-white/20 px-3 py-1 text-[#f5f0e6] hover:border-[#f5c542]"
        >
          리셋 (R)
        </button>
      </div>

      <div className="overflow-hidden rounded-sm border border-white/10 bg-[#0a0e14]">
        <canvas
          ref={canvasRef}
          width={course.width}
          height={course.height}
          className="mx-auto block h-auto max-h-[58vh] w-auto max-w-full touch-none"
          tabIndex={0}
        />
      </div>

      <div className="grid gap-2 text-xs text-[#8b93a7] sm:grid-cols-2">
        <p>
          <kbd className="text-[#f5c542]">W/↑</kbd> 전진 ·{" "}
          <kbd className="text-[#f5c542]">S/↓</kbd> 후진 ·{" "}
          <kbd className="text-[#f5c542]">A/D</kbd> 조향 ·{" "}
          <kbd className="text-[#f5c542]">Space</kbd> 브레이크
        </p>
        <p>
          노란 면 = 차량 <strong className="text-[#f5c542]">전방</strong>, 빨간 점 ={" "}
          <strong className="text-[#ff8f82]">차미</strong>. 후진 시 차미가 핸들 쪽으로
          갑니다.
        </p>
      </div>
    </div>
  );
}
