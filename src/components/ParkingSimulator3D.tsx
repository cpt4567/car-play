"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, PerspectiveCamera, Box, Plane, Grid } from "@react-three/drei";
import * as THREE from "three";
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

const DRIVE_KEYS = new Set(["w", "a", "s", "d", "r", "space", "arrowup", "arrowdown", "arrowleft", "arrowright"]);
const SCALE = 0.1; // 2D 픽셀을 3D 미터로 변환

function initialCar(course: ParkingCourse): CarState {
  return {
    x: course.carStart.x,
    y: course.carStart.y,
    heading: course.carStart.heading,
    speed: 0,
    steer: 0,
  };
}

// 3D 씬 컴포넌트
function ParkingScene({
  course,
  carRef,
  inputRef,
  flagsRef,
  setHud,
}: {
  course: ParkingCourse;
  carRef: React.MutableRefObject<CarState>;
  inputRef: React.MutableRefObject<ControlInput>;
  flagsRef: React.MutableRefObject<{ collided: boolean; success: boolean }>;
  setHud: (hud: any) => void;
}) {
  const carGroupRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { camera } = useThree();

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.033); // 최대 30fps 제한으로 물리 튐 방지
    let car = carRef.current;
    let { collided, success } = flagsRef.current;

    // 1. 물리 업데이트
    if (!collided && !success) {
      car = stepCar(car, inputRef.current, dt);

      // 충돌 체크
      let hit = false;
      for (const o of course.obstacles) {
        if (carHitsAabb(car, o.x, o.y, o.w, o.h)) hit = true;
      }
      if (car.x < 10 || car.y < 10 || car.x > course.width - 10 || car.y > course.height - 10) hit = true;

      if (hit) {
        collided = true;
        car = { ...car, speed: 0 };
      } else {
        // 성공 체크
        const t = course.target;
        const cx = car.x + Math.cos(car.heading) * DEFAULT_CAR.wheelbase * 0.45;
        const cy = car.y + Math.sin(car.heading) * DEFAULT_CAR.wheelbase * 0.45;
        const dist = Math.hypot(cx - (t.x + t.w / 2), cy - (t.y + t.h / 2));
        const hdg = headingDiffDeg(car.heading, t.heading);
        if (dist <= course.success.maxCenterDist && hdg <= course.success.maxHeadingDeg && Math.abs(car.speed) < 12) {
          success = true;
          car = { ...car, speed: 0 };
        }
      }

      carRef.current = car;
      flagsRef.current = { collided, success };
    }

    // 2. 3D 모델 위치 업데이트 (2D x,y -> 3D x,z)
    if (carGroupRef.current) {
      // 2D의 +y가 3D의 +z가 되도록 매핑
      carGroupRef.current.position.set(car.x * SCALE, 0, car.y * SCALE);
      // 2D heading 0은 +x 방향. 3D에서 Y축 회전으로 맞춤.
      carGroupRef.current.rotation.y = -car.heading;
    }

    // 3. 카메라 위치 (1인칭 운전석)
    if (cameraRef.current && carGroupRef.current) {
      // 운전석 위치 (차량 중심 기준)
      const isReversing = car.speed < -0.1 || (car.speed === 0 && inputRef.current.throttle < 0);
      
      if (isReversing) {
        // 후진 시: 고개를 뒤로 돌린 시점 (차량의 뒤쪽, -X 방향을 봄)
        cameraRef.current.position.set(DEFAULT_CAR.wheelbase * 0.2 * SCALE, 1.2, 0);
        cameraRef.current.rotation.set(0, Math.PI / 2, 0);
      } else {
        // 전진 시: 정면 (차량의 앞쪽, +X 방향을 봄)
        cameraRef.current.position.set(DEFAULT_CAR.wheelbase * 0.5 * SCALE, 1.2, -0.3);
        cameraRef.current.rotation.set(0, -Math.PI / 2, 0);
      }
    }

    // 4. HUD 업데이트
    const gear = gearLabel(car.speed);
    const hint = steerHint(car.speed, car.steer);
    setHud((prev: any) => {
      if (prev.gear === gear && prev.hint === hint && prev.collided === collided && prev.success === success && prev.steer === car.steer && prev.throttle === inputRef.current.throttle && prev.brake === inputRef.current.brake) {
        return prev;
      }
      return { gear, hint, collided, success, steer: car.steer, throttle: inputRef.current.throttle, brake: inputRef.current.brake };
    });
  });

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      {/* 바닥 */}
      <Plane args={[course.width * SCALE, course.height * SCALE]} rotation={[-Math.PI / 2, 0, 0]} position={[(course.width * SCALE) / 2, 0, (course.height * SCALE) / 2]} receiveShadow>
        <meshStandardMaterial color="#222" roughness={0.8} />
      </Plane>
      <Grid position={[(course.width * SCALE) / 2, 0.01, (course.height * SCALE) / 2]} args={[course.width * SCALE, course.height * SCALE]} cellSize={1} cellThickness={0.5} cellColor="#333" sectionSize={5} sectionThickness={1} sectionColor="#444" fadeDistance={50} />

      {/* 목표 지점 (주차선) */}
      <Box args={[course.target.w * SCALE, 0.1, course.target.h * SCALE]} position={[course.target.x * SCALE + (course.target.w * SCALE) / 2, 0.05, course.target.y * SCALE + (course.target.h * SCALE) / 2]} rotation={[0, -course.target.heading, 0]}>
        <meshBasicMaterial color={flagsRef.current.success ? "#3d9a6a" : "#f5c542"} wireframe />
      </Box>

      {/* 장애물 */}
      {course.obstacles.map((o) => {
        const color = o.kind === "car" ? "#2a3344" : o.kind === "curb" ? "#3a3428" : "#1e2430";
        const height = o.kind === "curb" ? 0.3 : 1.5;
        return (
          <Box key={o.id} args={[o.w * SCALE, height, o.h * SCALE]} position={[o.x * SCALE + (o.w * SCALE) / 2, height / 2, o.y * SCALE + (o.h * SCALE) / 2]} castShadow receiveShadow>
            <meshStandardMaterial color={color} />
          </Box>
        );
      })}

      {/* 내 차량 */}
      <group ref={carGroupRef}>
        <PerspectiveCamera ref={cameraRef} makeDefault fov={75} near={0.1} far={1000} />
        
        {/* 차체 (렌더링용, 카메라는 이 그룹 안에 있으므로 차체 내부에서 밖을 보게 됨) */}
        {/* 시야를 가리지 않도록 차체는 반투명하거나 뼈대만 렌더링 */}
        <Box args={[DEFAULT_CAR.length * SCALE, 1.4, DEFAULT_CAR.width * SCALE]} position={[DEFAULT_CAR.wheelbase * 0.45 * SCALE, 0.7, 0]} castShadow>
          <meshStandardMaterial color="#e85d4c" transparent opacity={0.2} wireframe />
        </Box>
      </group>
    </>
  );
}

export function ParkingSimulator3D() {
  const [courseId, setCourseId] = useState(parkingCourses[0].id);
  const course = parkingCourses.find((c) => c.id === courseId) ?? parkingCourses[0];

  const carRef = useRef<CarState>(initialCar(course));
  const inputRef = useRef<ControlInput>({ throttle: 0, steer: 0, brake: false });
  const keysRef = useRef<Set<string>>(new Set());
  const flagsRef = useRef({ collided: false, success: false });
  const courseRef = useRef(course);
  courseRef.current = course;

  const [hud, setHud] = useState({
    gear: "정지",
    hint: "조향 중립",
    collided: false,
    success: false,
    steer: 0,
    throttle: 0,
    brake: false,
  });

  const reset = () => {
    carRef.current = initialCar(courseRef.current);
    inputRef.current = { throttle: 0, steer: 0, brake: false };
    flagsRef.current = { collided: false, success: false };
    setHud({ gear: "정지", hint: "조향 중립", collided: false, success: false, steer: 0, throttle: 0, brake: false });
  };

  useEffect(() => {
    reset();
  }, [courseId]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = normalizeKey(e);
      if (!DRIVE_KEYS.has(k)) return;
      e.preventDefault();
      keysRef.current.add(k);
      if (k === "r") reset();
      updateInput();
    };
    const up = (e: KeyboardEvent) => {
      keysRef.current.delete(normalizeKey(e));
      updateInput();
    };
    const blur = () => {
      keysRef.current.clear();
      updateInput();
    };

    const updateInput = () => {
      const keys = keysRef.current;
      let throttle = 0;
      let steer = 0;
      if (keys.has("w") || keys.has("arrowup")) throttle += 1;
      if (keys.has("s") || keys.has("arrowdown")) throttle -= 1;
      if (keys.has("d") || keys.has("arrowright")) steer += 1;
      if (keys.has("a") || keys.has("arrowleft")) steer -= 1;
      inputRef.current = { throttle, steer, brake: keys.has("space") };
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);

  // 미니맵 그리기 (2D Canvas)
  useEffect(() => {
    const canvas = document.getElementById("minimap-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const renderMinimap = () => {
      const car = carRef.current;
      const c = course;
      const { collided, success } = flagsRef.current;

      canvas.width = c.width;
      canvas.height = c.height;
      ctx.clearRect(0, 0, c.width, c.height);

      // 배경
      ctx.fillStyle = "#0c1018";
      ctx.fillRect(0, 0, c.width, c.height);

      // 목표 지점
      const t = c.target;
      ctx.fillStyle = success ? "rgba(61,154,106,0.35)" : "rgba(245,197,66,0.18)";
      ctx.strokeStyle = success ? "#3d9a6a" : "#f5c542";
      ctx.lineWidth = 4;
      ctx.fillRect(t.x, t.y, t.w, t.h);
      ctx.strokeRect(t.x, t.y, t.w, t.h);

      // 장애물
      for (const o of c.obstacles) {
        ctx.fillStyle = o.kind === "car" ? "#2a3344" : o.kind === "curb" ? "#3a3428" : "#1e2430";
        ctx.strokeStyle = "#8b93a7";
        ctx.lineWidth = 2;
        ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.strokeRect(o.x, o.y, o.w, o.h);
      }

      // 차량
      const rearToCenter = DEFAULT_CAR.wheelbase * 0.45;
      const cx = car.x + Math.cos(car.heading) * rearToCenter;
      const cy = car.y + Math.sin(car.heading) * rearToCenter;
      
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(car.heading);
      
      ctx.fillStyle = collided ? "#e85d4c" : "#3d4a5c";
      ctx.strokeStyle = "#f5f0e6";
      ctx.lineWidth = 3;
      
      const hw = DEFAULT_CAR.width / 2;
      const hl = DEFAULT_CAR.length / 2;
      
      // 차체
      ctx.fillRect(-hl, -hw, DEFAULT_CAR.length, DEFAULT_CAR.width);
      ctx.strokeRect(-hl, -hw, DEFAULT_CAR.length, DEFAULT_CAR.width);
      
      // 전면 표시 (노란색)
      ctx.fillStyle = "#f5c542";
      ctx.fillRect(hl - 10, -hw + 2, 8, DEFAULT_CAR.width - 4);
      
      // 후면 표시 (빨간색)
      ctx.fillStyle = "#e85d4c";
      ctx.fillRect(-hl + 2, -hw + 2, 6, DEFAULT_CAR.width - 4);
      
      ctx.restore();

      animationFrameId = requestAnimationFrame(renderMinimap);
    };

    renderMinimap();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [course]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {parkingCourses.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCourseId(c.id)}
            className={`rounded-sm px-3 py-1.5 text-xs transition-colors ${
              courseId === c.id ? "bg-[#f5c542] text-[#121820]" : "border border-white/15 text-[#c5cbd8] hover:border-white/30"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <p className="text-sm text-[#c5cbd8]">{course.description}</p>

      {/* 3D 뷰포트 & 대시보드 오버레이 */}
      <div className="relative overflow-hidden rounded-sm border border-white/10 bg-[#0a0e14] h-[60vh] min-h-[400px]">
        {/* 3D 캔버스 */}
        <Canvas shadows>
          <ParkingScene course={course} carRef={carRef} inputRef={inputRef} flagsRef={flagsRef} setHud={setHud} />
        </Canvas>

        {/* 미니맵 (상황판) */}
        <div className="absolute top-4 right-4 w-48 h-32 bg-[#0a0e14] border-2 border-[#2a3344] rounded-md overflow-hidden shadow-lg z-10">
          <div className="absolute top-0 left-0 w-full bg-[#2a3344] text-center text-[10px] font-bold text-white py-0.5">
            상황판 (TOP VIEW)
          </div>
          {/* 캔버스는 부모 크기에 맞춰 CSS로 스케일링 됨 */}
          <canvas id="minimap-canvas" className="w-full h-full object-contain mt-3" />
        </div>

        {/* 대시보드 UI 오버레이 */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none flex items-end justify-between px-6 pb-4">
          
          {/* 왼쪽: 페달 */}
          <div className="flex items-end gap-3 mb-2">
            <div className={`w-12 h-20 rounded-md border-2 flex items-center justify-center transition-colors ${hud.brake ? 'bg-red-500/40 border-red-500 text-white' : 'bg-white/5 border-white/20 text-white/50'}`}>
              <span className="text-[10px] font-bold">BRAKE</span>
            </div>
            <div className={`w-10 h-28 rounded-md border-2 flex items-center justify-center transition-colors ${hud.throttle > 0 ? 'bg-green-500/40 border-green-500 text-white' : hud.throttle < 0 ? 'bg-yellow-500/40 border-yellow-500 text-white' : 'bg-white/5 border-white/20 text-white/50'}`}>
              <span className="text-[10px] font-bold rotate-[-90deg]">GAS</span>
            </div>
          </div>

          {/* 중앙: 스티어링 휠 */}
          <div className="relative w-40 h-40 flex items-center justify-center translate-y-8">
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full transition-transform duration-75"
              style={{ transform: `rotate(${hud.steer * 90}deg)` }}
            >
              {/* 핸들 림 */}
              <circle cx="50" cy="50" r="45" fill="none" stroke="#2a3344" strokeWidth="10" />
              {/* 스포크 */}
              <path d="M 10 50 L 90 50 M 50 50 L 50 95" stroke="#1e2430" strokeWidth="12" strokeLinecap="round" />
              {/* 중앙 혼 */}
              <circle cx="50" cy="50" r="16" fill="#121820" stroke="#3a4454" strokeWidth="2" />
              <text x="50" y="53" fill="#8b93a7" fontSize="8" fontWeight="bold" textAnchor="middle">SUD</text>
            </svg>
          </div>

          {/* 오른쪽: 기어 및 상태 */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex flex-col bg-black/60 rounded-lg p-2 border border-white/10 text-xl font-bold text-center w-12">
              <span className={hud.gear === "정지" ? "text-red-500" : "text-white/20"}>P</span>
              <span className={hud.gear === "후진" ? "text-yellow-500" : "text-white/20"}>R</span>
              <span className="text-white/20">N</span>
              <span className={hud.gear === "전진" ? "text-green-500" : "text-white/20"}>D</span>
            </div>
          </div>
        </div>

        {/* 중앙 메시지 오버레이 */}
        {(hud.collided || hud.success) && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <h2 className={`text-4xl font-bold mb-4 ${hud.success ? 'text-[#7dcca0]' : 'text-[#ff8f82]'}`}>
                {hud.success ? '주차 성공!' : '충돌 발생'}
              </h2>
              <button
                type="button"
                onClick={reset}
                className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-[#f5c542] transition-colors"
              >
                다시 시작 (R)
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-2 text-xs text-[#8b93a7] sm:grid-cols-2">
        <p>
          <kbd className="text-[#f5c542]">W/↑</kbd> 전진 · <kbd className="text-[#f5c542]">S/↓</kbd> 후진 · <kbd className="text-[#f5c542]">A/D</kbd> 조향 · <kbd className="text-[#f5c542]">Space</kbd> 브레이크
        </p>
        <p>
          1인칭 시점입니다. 후진(S)을 누르면 자동으로 고개를 돌려 뒤를 봅니다.
        </p>
      </div>
    </div>
  );
}
