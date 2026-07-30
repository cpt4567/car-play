export type Vec2 = { x: number; y: number };

export type RectObstacle = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  kind: "wall" | "car" | "curb";
};

export type ParkingSlot = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** 슬롯이 ‘바라보는’ 각도(라디안). 차 heading과 비교 */
  heading: number;
};

export type ParkingCourse = {
  id: string;
  name: string;
  description: string;
  width: number;
  height: number;
  carStart: { x: number; y: number; heading: number };
  obstacles: RectObstacle[];
  target: ParkingSlot;
  success: {
    maxCenterDist: number;
    maxHeadingDeg: number;
  };
};

export const parkingCourses: ParkingCourse[] = [
  {
    id: "reverse-straight",
    name: "후진 직진 감 잡기",
    description: "장애물 사이로 후진해 뒤쪽 목표 박스에 정렬하세요. 조향은 최소로.",
    width: 800,
    height: 520,
    carStart: { x: 400, y: 120, heading: Math.PI / 2 },
    obstacles: [
      { id: "l", x: 280, y: 200, w: 24, h: 220, kind: "curb", label: "경계" },
      { id: "r", x: 496, y: 200, w: 24, h: 220, kind: "curb", label: "경계" },
    ],
    target: { x: 340, y: 400, w: 120, h: 70, heading: Math.PI / 2 },
    success: { maxCenterDist: 28, maxHeadingDeg: 12 },
  },
  {
    id: "perp-right",
    name: "직각 주차 (우측)",
    description: "우측 주차 칸에 후진으로 진입하세요. 차미가 들어갈 쪽으로 핸들.",
    width: 800,
    height: 520,
    carStart: { x: 180, y: 260, heading: 0 },
    obstacles: [
      { id: "c1", x: 520, y: 80, w: 90, h: 150, kind: "car", label: "주차차량" },
      { id: "c2", x: 520, y: 320, w: 90, h: 150, kind: "car", label: "주차차량" },
      { id: "wall", x: 640, y: 60, w: 20, h: 400, kind: "wall" },
    ],
    target: { x: 520, y: 240, w: 100, h: 70, heading: 0 },
    success: { maxCenterDist: 30, maxHeadingDeg: 15 },
  },
  {
    id: "parallel-right",
    name: "평행주차 (우측)",
    description:
      "앞차·뒤차 사이 우측 연석 공간에 평행주차. 후진→우측 조향으로 차미 투입→반대로 풀어 정렬.",
    width: 800,
    height: 520,
    carStart: { x: 200, y: 160, heading: 0 },
    obstacles: [
      { id: "front", x: 520, y: 120, w: 140, h: 70, kind: "car", label: "앞차" },
      { id: "rear", x: 520, y: 320, w: 140, h: 70, kind: "car", label: "뒤차" },
      { id: "curb", x: 700, y: 100, w: 18, h: 320, kind: "curb", label: "연석" },
    ],
    target: { x: 540, y: 220, w: 130, h: 75, heading: Math.PI / 2 },
    success: { maxCenterDist: 32, maxHeadingDeg: 18 },
  },
  {
    id: "perp-left",
    name: "직각 주차 (좌측)",
    description: "왼쪽 칸 후진 주차. 차미 왼쪽 = 핸들 왼쪽.",
    width: 800,
    height: 520,
    carStart: { x: 620, y: 260, heading: Math.PI },
    obstacles: [
      { id: "c1", x: 160, y: 80, w: 90, h: 150, kind: "car", label: "주차차량" },
      { id: "c2", x: 160, y: 320, w: 90, h: 150, kind: "car", label: "주차차량" },
      { id: "wall", x: 120, y: 60, w: 20, h: 400, kind: "wall" },
    ],
    target: { x: 160, y: 240, w: 100, h: 70, heading: Math.PI },
    success: { maxCenterDist: 30, maxHeadingDeg: 15 },
  },
];
