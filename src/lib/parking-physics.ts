export type CarState = {
  x: number;
  y: number;
  /** 라디안, 0 = 오른쪽(+x) */
  heading: number;
  speed: number;
  steer: number;
};

export type CarDims = {
  length: number;
  width: number;
  wheelbase: number;
};

export const DEFAULT_CAR: CarDims = {
  length: 56,
  width: 28,
  wheelbase: 34,
};

const MAX_SPEED = 140;
const ACCEL = 90;
const BRAKE = 160;
const DRAG = 40;
const MAX_STEER = 0.55;
const STEER_RATE = 2.2;

export type ControlInput = {
  throttle: number; // -1..1
  steer: number; // -1..1
  brake: boolean;
};

export function stepCar(
  car: CarState,
  input: ControlInput,
  dt: number,
  dims: CarDims = DEFAULT_CAR,
): CarState {
  let { x, y, heading, speed, steer } = car;

  const targetSteer = clamp(input.steer, -1, 1) * MAX_STEER;
  const steerDiff = targetSteer - steer;
  steer += clamp(steerDiff, -STEER_RATE * dt, STEER_RATE * dt);

  if (input.brake) {
    const sign = Math.sign(speed) || 0;
    speed -= sign * BRAKE * dt;
    if (Math.abs(speed) < 8) speed = 0;
  } else {
    speed += input.throttle * ACCEL * dt;
  }

  const drag = DRAG * dt * Math.sign(speed || 0);
  if (Math.abs(speed) > Math.abs(drag)) speed -= drag;
  else speed = 0;

  speed = clamp(speed, -MAX_SPEED * 0.65, MAX_SPEED);

  // bicycle model: rear axle reference
  const beta = Math.tan(steer) / dims.wheelbase;
  heading += speed * beta * dt;
  x += Math.cos(heading) * speed * dt;
  y += Math.sin(heading) * speed * dt;

  return { x, y, heading, speed, steer };
}

export function carCorners(
  car: CarState,
  dims: CarDims = DEFAULT_CAR,
): { x: number; y: number }[] {
  // rear axle at (x,y); body extends forward along heading
  const rearToCenter = dims.wheelbase * 0.45;
  const cx = car.x + Math.cos(car.heading) * rearToCenter;
  const cy = car.y + Math.sin(car.heading) * rearToCenter;
  const hl = dims.length / 2;
  const hw = dims.width / 2;
  const cos = Math.cos(car.heading);
  const sin = Math.sin(car.heading);
  const pts = [
    { x: -hl, y: -hw },
    { x: hl, y: -hw },
    { x: hl, y: hw },
    { x: -hl, y: hw },
  ];
  return pts.map((p) => ({
    x: cx + p.x * cos - p.y * sin,
    y: cy + p.x * sin + p.y * cos,
  }));
}

export function aabbOverlap(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

/** Separating axis for OBB (car) vs AABB obstacle — approximate via car AABB */
export function carHitsAabb(
  car: CarState,
  ox: number,
  oy: number,
  ow: number,
  oh: number,
  dims: CarDims = DEFAULT_CAR,
): boolean {
  const corners = carCorners(car, dims);
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const c of corners) {
    minX = Math.min(minX, c.x);
    minY = Math.min(minY, c.y);
    maxX = Math.max(maxX, c.x);
    maxY = Math.max(maxY, c.y);
  }
  return aabbOverlap(minX, minY, maxX - minX, maxY - minY, ox, oy, ow, oh);
}

export function normalizeAngle(a: number) {
  let x = a;
  while (x > Math.PI) x -= Math.PI * 2;
  while (x < -Math.PI) x += Math.PI * 2;
  return x;
}

export function headingDiffDeg(a: number, b: number) {
  return (Math.abs(normalizeAngle(a - b)) * 180) / Math.PI;
}

export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function gearLabel(speed: number): "전진" | "후진" | "정지" {
  if (speed > 4) return "전진";
  if (speed < -4) return "후진";
  return "정지";
}

export function steerHint(speed: number, steer: number): string {
  if (Math.abs(steer) < 0.05) return "조향 중립";
  const side = steer > 0 ? "오른쪽" : "왼쪽";
  if (speed < -4) return `후진 중 · 차미가 ${side}으로`;
  if (speed > 4) return `전진 중 · 차 앞이 ${side}으로`;
  return `정지 · 핸들 ${side}`;
}
