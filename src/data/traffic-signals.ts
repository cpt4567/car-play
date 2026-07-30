export type SignalCategory =
  | "기본 색등"
  | "좌회전 화살표"
  | "점멸"
  | "신호등 형태"
  | "보행자";

export type TrafficSignal = {
  id: string;
  category: SignalCategory;
  name: string;
  meaning: string;
  action: string;
  /** public/signals 아래의 실제 대한민국 신호등 이미지 */
  image: string;
  /** Wikimedia Commons 원본 파일명 */
  sourceFile: string;
  tags: string[];
};

export const SIGNAL_CATEGORIES: SignalCategory[] = [
  "기본 색등",
  "좌회전 화살표",
  "점멸",
  "신호등 형태",
  "보행자",
];

export const trafficSignals: TrafficSignal[] = [
  {
    id: "green",
    category: "기본 색등",
    name: "녹색등 — 진행",
    meaning: "직진이 가능한 신호입니다. (원형 녹색)",
    action:
      "안전 확인 후 진행. 우회전은 별도 규제·보행자·우회전 전용신호가 있으면 그에 따릅니다.",
    image: "/signals/state-green.png",
    sourceFile: "Korea Trafficlight(RYAG) 3.gif",
    tags: ["녹색", "직진", "진행"],
  },
  {
    id: "yellow",
    category: "기본 색등",
    name: "황색등 — 정지 준비",
    meaning: "곧 적색으로 바뀝니다. 정지선 앞에서 안전하게 멈출 수 있으면 정지합니다.",
    action:
      "이미 교차로에 깊숙이 들어간 경우에만 신속히 통과. ‘노란불 밟고 가기’는 위험합니다.",
    image: "/signals/state-yellow.png",
    sourceFile: "Korea Trafficlight(RYA) 2.gif",
    tags: ["황색", "감속", "정지"],
  },
  {
    id: "red",
    category: "기본 색등",
    name: "적색등 — 정지",
    meaning: "정지선·횡단보도·교차로 앞에서 완전히 멈춰야 합니다.",
    action:
      "녹색(또는 좌회전 화살표)이 될 때까지 대기. 적색에서 무조건 우회전하지 마세요.",
    image: "/signals/state-red.png",
    sourceFile: "Korea Trafficlight(RYAG) 5.gif",
    tags: ["적색", "정지"],
  },
  {
    id: "left-only",
    category: "좌회전 화살표",
    name: "좌회전 화살표",
    meaning: "좌회전(필요 시 유턴 허용 구간)이 가능한 녹색 화살표입니다.",
    action: "대향차·보행자를 확인하고 좌회전. 화살표가 꺼지면 교차로 안에 머물지 않습니다.",
    image: "/signals/state-left-only.png",
    sourceFile: "Korea Trafficlight(RYAG) 4.gif",
    tags: ["좌회전", "화살표"],
  },
  {
    id: "left-protected",
    category: "좌회전 화살표",
    name: "적색 + 좌회전 화살표",
    meaning: "직진은 정지, 좌회전만 허용되는 보호 좌회전 상태입니다.",
    action: "좌회전 차로에서만 진입. 직진 차로에 있으면 대기합니다.",
    image: "/signals/state-left-protected.png",
    sourceFile: "Korea Trafficlight(RYAG) 5.gif",
    tags: ["좌회전", "보호좌회전", "직진정지"],
  },
  {
    id: "both",
    category: "좌회전 화살표",
    name: "직진 녹색 + 좌회전 화살표",
    meaning: "직진과 좌회전이 동시에 가능한 상태입니다.",
    action: "직진·좌회전 모두 가능. 같은 방향 차와 동선이 겹치지 않게 차로를 지킵니다.",
    image: "/signals/state-both.png",
    sourceFile: "Korea Trafficlight(RYAG) 1.gif",
    tags: ["동시신호", "직좌"],
  },
  {
    id: "yellow-flash",
    category: "점멸",
    name: "황색 점멸",
    meaning: "주의하며 진행하라는 신호입니다. ‘무조건 통과’가 아닙니다.",
    action: "감속하고 좌우·횡단보도를 확인한 뒤 안전할 때만 통과합니다.",
    image: "/signals/yellow-flash.gif",
    sourceFile: "Korea Trafficlight(RYA) Flickering Yellow.gif",
    tags: ["점멸", "황색", "주의"],
  },
  {
    id: "red-flash",
    category: "점멸",
    name: "적색 점멸",
    meaning: "일시정지 후 확인·진행과 같은 의미로 이해합니다.",
    action: "정지선에서 완전 정지 → 좌우 확인 → 안전할 때 출발.",
    image: "/signals/red-flash.gif",
    sourceFile: "Korea Trafficlight(RYA) Flickering Red.gif",
    tags: ["점멸", "적색", "일시정지"],
  },
  {
    id: "ryag-yellow-flash",
    category: "점멸",
    name: "황색 점멸 (4색)",
    meaning: "직진·좌회전 겸용 신호등의 황색 점멸입니다.",
    action: "교차로 전체를 주의 구간으로 보고 저속·양보 후 통과합니다.",
    image: "/signals/ryag-yellow-flash.gif",
    sourceFile: "Korea Trafficlight(RYAG) Flickering Yellow.gif",
    tags: ["점멸", "4색"],
  },
  {
    id: "ryag-red-flash",
    category: "점멸",
    name: "적색 점멸 (4색)",
    meaning: "4색 신호의 적색 점멸 — 일시정지 후 확인이 필요합니다.",
    action: "완전 정지 후 직진·좌회전 모두 안전 확인. 우선도로·표지를 함께 봅니다.",
    image: "/signals/ryag-red-flash.gif",
    sourceFile: "Korea Trafficlight(RYAG) Flickering Red.gif",
    tags: ["점멸", "적색", "4색"],
  },
  {
    id: "vertical-3",
    category: "신호등 형태",
    name: "세로형 3색 신호등",
    meaning: "위에서부터 적·황·녹 순의 기본 차량용 신호등입니다.",
    action: "가장 흔한 형태. 색 위치는 고정이므로 멀리서도 어느 등이 켜졌는지 파악합니다.",
    image: "/signals/vertical-3.svg",
    sourceFile: "Korea Traffic Safety Sign - Signal Light - Vertical 3.svg",
    tags: ["3색", "세로"],
  },
  {
    id: "horizontal-4",
    category: "신호등 형태",
    name: "가로형 4색 (직진+좌회전)",
    meaning: "적·황·좌회전 화살표·직진 녹색이 한 줄로 배치된 형태입니다.",
    action: "‘원형 녹색 = 직진, 녹색 화살표 = 좌회전’으로 칸을 구분해 봅니다.",
    image: "/signals/horizontal-4.svg",
    sourceFile: "Korea Traffic Safety Sign - Signal Light - Horizontal 4.svg",
    tags: ["4색", "가로", "좌회전"],
  },
  {
    id: "caution-unit",
    category: "신호등 형태",
    name: "주의·경보형 신호 유닛",
    meaning: "공사·위험 구간 등에서 주의 점멸을 알리는 신호 장치 형태입니다.",
    action: "보이면 속도를 줄이고 차선·작업 구간을 확인합니다.",
    image: "/signals/caution-unit.svg",
    sourceFile: "Korea Traffic Safety Sign - Signal Light - Caution.svg",
    tags: ["주의", "공사"],
  },
  {
    id: "pedestrian",
    category: "보행자",
    name: "보행자 신호등",
    meaning: "보행자 횡단용 신호입니다. 차량 운전자도 반드시 함께 봅니다.",
    action:
      "보행 녹색이면 횡단 중인·건너려는 사람을 우선. 우회전·좌회전 시 특히 확인합니다.",
    image: "/signals/pedestrian.svg",
    sourceFile: "Korea Traffic Safety Sign - Signal Light - Pedestrian.svg",
    tags: ["보행자", "횡단보도"],
  },
];
