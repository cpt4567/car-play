export type LawCategory =
  | "신호·표지"
  | "속도"
  | "우선순위"
  | "주차·정차"
  | "회전·차로"
  | "보행자·보호"
  | "고속도로";

export type LawSeverity = "info" | "caution" | "critical";

export type TrafficLaw = {
  id: string;
  category: LawCategory;
  title: string;
  summary: string;
  practiceTip: string;
  severity: LawSeverity;
  tags: string[];
};

export const LAW_CATEGORIES: LawCategory[] = [
  "신호·표지",
  "속도",
  "우선순위",
  "주차·정차",
  "회전·차로",
  "보행자·보호",
  "고속도로",
];

export const trafficLaws: TrafficLaw[] = [
  {
    id: "signal-stop",
    category: "신호·표지",
    title: "적색 신호 — 정지선 앞 완전 정지",
    summary:
      "적색일 때는 교차로·횡단보도 진입 금지. 정지선이 있으면 그 앞에서 멈춘다. 우회전도 원칙적으로 적색에서 바로 들어가면 안 된다(별도 허용 표지·신호 확인).",
    practiceTip:
      "노란불이 보이면 ‘통과할지’보다 ‘안전하게 설 수 있는지’를 먼저 판단한다. 애매하면 선다.",
    severity: "critical",
    tags: ["신호", "교차로", "정지선"],
  },
  {
    id: "signal-yellow",
    category: "신호·표지",
    title: "황색 신호 — 이미 진입한 경우만 통과",
    summary:
      "황색은 정지를 위한 여유다. 정지선 앞에서 안전하게 멈출 수 있으면 정지. 이미 교차로에 깊숙이 들어간 경우에만 신속히 통과한다.",
    practiceTip:
      "‘노란불 밟고 가기’ 습관은 사고·단속 모두에 취약하다. 시뮬에서도 여유 있게 감속하는 감각을 만든다.",
    severity: "caution",
    tags: ["황색", "교차로"],
  },
  {
    id: "speed-city",
    category: "속도",
    title: "일반도로 제한속도 준수",
    summary:
      "표지·구간에 명시된 제한속도를 지킨다. 비·눈·안개 등 시야·노면이 나쁠 때는 제한속도 이하로 감속한다.",
    practiceTip:
      "도심에서는 ‘흐름에 맞추되 제한을 넘지 않기’. 앞차와의 차간거리는 속도(km/h)의 대략 절반(m)을 참고.",
    severity: "caution",
    tags: ["제한속도", "도심"],
  },
  {
    id: "speed-school",
    category: "속도",
    title: "어린이보호구역(스쿨존) 30km/h",
    summary:
      "어린이보호구역에서는 통상 시속 30km 이내. 주·정차 금지·주정차 위반 단속이 강화된 구간이 많다.",
    practiceTip:
      "학교 앞은 ‘느리게 + 시야 넓게’. 주차 연습 때도 보호구역 표지를 먼저 찾는 습관을 들인다.",
    severity: "critical",
    tags: ["스쿨존", "30km"],
  },
  {
    id: "right-of-way-uncontrolled",
    category: "우선순위",
    title: "신호 없는 교차로 — 우측 우선·직진 우선 감각",
    summary:
      "신호·표지가 없으면 우측에서 오는 차에 주의하고, 좌회전은 직진·우회전에 양보하는 상황을 많이 만난다. 현장 표지·노면표시가 최우선이다.",
    practiceTip:
      "진입 전 ‘한번 더 고개’ — 사각·가로수·주차 차량 뒤에서 갑자기 나올 수 있다.",
    severity: "caution",
    tags: ["교차로", "양보"],
  },
  {
    id: "yield-pedestrian",
    category: "우선순위",
    title: "횡단보도 — 보행자 보호 의무",
    summary:
      "횡단보도 보행자가 건너거나 건너려 하면 일시정지 후 통과. 앞차가 횡단보도 앞에서 멈췄다면 추월하지 않는다.",
    practiceTip:
      "횡단보도 직전에서는 브레이크를 살짝 올려 ‘멈출 준비’ 자세를 유지한다.",
    severity: "critical",
    tags: ["횡단보도", "보행자"],
  },
  {
    id: "parking-ban",
    category: "주차·정차",
    title: "주차·정차 금지 장소",
    summary:
      "교차로·횡단보도·버스정류장 인근, 소방시설 주변, 터널·다리 위, 갓길 일부 등 금지 구간이 많다. 노란 실선·점선·표지를 반드시 본다.",
    practiceTip:
      "주차 전에 ‘여기에 세워도 되나?’를 표지·노면색으로 확인. 애매하면 다른 곳을 찾는다.",
    severity: "caution",
    tags: ["주차금지", "정차"],
  },
  {
    id: "parking-parallel-sense",
    category: "주차·정차",
    title: "평행주차 — 차미가 들어갈 쪽으로 조향",
    summary:
      "법규라기보다 실전 감각: 후진으로 공간을 넣을 때 핸들은 ‘차 뒤가 들어가길 원하는 방향’으로 먼저 꺾는다. (전진과 체감이 반대처럼 느껴짐)",
    practiceTip:
      "이 앱의 방향감각·주차 모듈에서 ‘후진+우핸들=차미 우측’을 반복하면 BeamNG/실차 감각이 빨리 붙는다.",
    severity: "info",
    tags: ["평행주차", "후진", "조향"],
  },
  {
    id: "lane-change",
    category: "회전·차로",
    title: "차로 변경 — 방향지시등·사각 확인",
    summary:
      "차로를 바꾸기 전 방향지시등을 켜고, 미러·어깨 너머 사각을 확인한 뒤 여유 있게 진입한다. 급작스러운 끼어들기는 사고·시비의 원인.",
    practiceTip:
      "‘깜빡이 → 미러 → 어깨 → 이동’ 순서를 입으로 말하며 연습하면 몸이 기억한다.",
    severity: "caution",
    tags: ["차로변경", "방향지시등"],
  },
  {
    id: "turn-left",
    category: "회전·차로",
    title: "좌회전 — 교차로 중앙 부근에서 대기 후 회전",
    summary:
      "좌회전 신호가 있거나 가능한 상황에서 확인한다. 대향 직진·보행자에 주의하고, 교차로 안에서 불필요하게 오래 머물지 않는다.",
    practiceTip:
      "좌회전 대기 시 핸들을 미리 과도하게 꺾어 두지 않는다(추돌 시 밀릴 위험). 회전 직전에 조향.",
    severity: "caution",
    tags: ["좌회전", "교차로"],
  },
  {
    id: "child-protect",
    category: "보행자·보호",
    title: "어린이·노인·장애인 보호",
    summary:
      "보호구역·버스 승하차·골목에서는 보행자·자전거가 갑자기 나타날 수 있다. 속도·시야·경적을 상황에 맞게 조절한다.",
    practiceTip:
      "골목 우회전·후진 출차 시 보행자 우선. 주차 시뮬에서도 ‘출차 전 좌우’를 루틴화.",
    severity: "critical",
    tags: ["보호", "골목"],
  },
  {
    id: "reverse-safety",
    category: "보행자·보호",
    title: "후진 — 저속·시야·경보",
    summary:
      "후진은 시야가 제한된다. 저속으로, 필요 시 하차 확인·경보음·카메라·미러를 병행한다. 보행자·이륜차·카트에 특히 주의.",
    practiceTip:
      "후진 시작 전 1초 정지 → 좌우 확인 → 아주 천천히. 속도가 느릴수록 조향 수정이 쉽다.",
    severity: "critical",
    tags: ["후진", "안전"],
  },
  {
    id: "highway-lane",
    category: "고속도로",
    title: "고속도로 지정차로·안전거리",
    summary:
      "지정차로제·버스전용 등을 확인하고, 추월 후 원래 차로로 복귀한다. 고속에서는 차간거리를 충분히 확보한다.",
    practiceTip:
      "합류(가속차로)에서는 본선 속도에 맞춰 가속한 뒤 빈 틈에 진입. 급진입 금지.",
    severity: "caution",
    tags: ["고속도로", "합류"],
  },
  {
    id: "highway-shoulder",
    category: "고속도로",
    title: "갓길 — 비상시에만",
    summary:
      "갓길은 고장·응급 등 비상용이다. 일반 주행·정체 시 갓길 운행은 위험하고 위법 소지가 크다.",
    practiceTip:
      "고장 시 갓길 정차 → 안전삼각대·비상등 → 가드레일 밖 대피 순서를 기억한다.",
    severity: "critical",
    tags: ["갓길", "비상"],
  },
];
