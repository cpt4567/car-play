export type DirectionChoice = {
  id: string;
  label: string;
};

export type DirectionScenario = {
  id: string;
  level: "기초" | "응용" | "함정";
  title: string;
  situation: string;
  gear: "forward" | "reverse";
  /** 탑다운 힌트: 차가 향하는 각도(도), 0=오른쪽 */
  carAngleDeg: number;
  /** 목표 공간 상대 위치 설명용 */
  targetSide: "left" | "right" | "behind" | "none";
  choices: DirectionChoice[];
  correctChoiceId: string;
  explanation: string;
};

export const directionScenarios: DirectionScenario[] = [
  {
    id: "fwd-right",
    level: "기초",
    title: "전진 — 우측으로 돌고 싶을 때",
    situation:
      "차는 화면 위쪽(전방)을 보고 전진 중입니다. 차의 앞부분을 오른쪽으로 돌리려면 핸들을 어느 쪽으로?",
    gear: "forward",
    carAngleDeg: -90,
    targetSide: "right",
    choices: [
      { id: "wheel-right", label: "핸들을 오른쪽(시계 방향)으로" },
      { id: "wheel-left", label: "핸들을 왼쪽(반시계 방향)으로" },
    ],
    correctChoiceId: "wheel-right",
    explanation:
      "전진에서는 핸들 방향 = 차 앞이 가는 방향입니다. 오른쪽 핸들 → 앞이 우측으로 돕니다.",
  },
  {
    id: "rev-right-tail",
    level: "기초",
    title: "후진 — 차미를 오른쪽으로",
    situation:
      "후진 중입니다. 주차 공간에 차의 뒤(차미)를 오른쪽으로 넣고 싶습니다. 핸들은?",
    gear: "reverse",
    carAngleDeg: -90,
    targetSide: "right",
    choices: [
      { id: "wheel-right", label: "핸들을 오른쪽으로 (차미가 우측으로)" },
      { id: "wheel-left", label: "핸들을 왼쪽으로 (직관과 반대로 생각해서)" },
    ],
    correctChoiceId: "wheel-right",
    explanation:
      "후진에서도 ‘넣고 싶은 쪽(차미)’으로 핸들을 꺾습니다. 오른쪽 핸들 → 차미가 우측으로 먼저 움직입니다. 헷갈리는 이유는 차 앞이 반대로 스윙하기 때문입니다.",
  },
  {
    id: "rev-left-tail",
    level: "기초",
    title: "후진 — 차미를 왼쪽으로",
    situation: "후진으로 왼쪽 공간에 차미를 넣고 싶습니다. 핸들은?",
    gear: "reverse",
    carAngleDeg: -90,
    targetSide: "left",
    choices: [
      { id: "wheel-left", label: "핸들을 왼쪽" },
      { id: "wheel-right", label: "핸들을 오른쪽" },
    ],
    correctChoiceId: "wheel-left",
    explanation:
      "차미가 갈 쪽 = 핸들 방향. 왼쪽 공간이면 왼쪽 핸들. BeamNG·실차·이 앱 모두 같은 규칙입니다.",
  },
  {
    id: "parallel-entry",
    level: "응용",
    title: "평행주차 진입 — 우측 공간",
    situation:
      "도로 오른쪽 연석 쪽에 평행주차 공간이 있습니다. 차를 공간 앞쪽에 세운 뒤 후진으로 들어갈 때, 첫 조향은?",
    gear: "reverse",
    carAngleDeg: -90,
    targetSide: "right",
    choices: [
      {
        id: "first-right",
        label: "후진하며 핸들을 오른쪽으로 — 차미를 공간 쪽으로",
      },
      {
        id: "first-left",
        label: "후진하며 핸들을 왼쪽으로 — 앞범퍼를 공간 쪽으로",
      },
      {
        id: "straight",
        label: "핸들 중립으로 Straight 후진만",
      },
    ],
    correctChoiceId: "first-right",
    explanation:
      "우측 평행주차의 첫 감각은 ‘후진 + 우측 조향으로 차미를 공간에 들이기’입니다. 어느 정도 들어갔으면 핸들을 반대(왼쪽)로 풀어 차체를 공간과 나란히 맞춥니다.",
  },
  {
    id: "perp-bay-left",
    level: "응용",
    title: "직각 주차 — 왼쪽 베이",
    situation:
      "진행 방향 기준 왼쪽 칸에 후진으로 직각 주차하려고 합니다. 차미를 칸 안으로 넣으려면?",
    gear: "reverse",
    carAngleDeg: -90,
    targetSide: "left",
    choices: [
      { id: "wheel-left", label: "후진 + 핸들 왼쪽" },
      { id: "wheel-right", label: "후진 + 핸들 오른쪽" },
    ],
    correctChoiceId: "wheel-left",
    explanation:
      "왼쪽 칸 = 차미를 왼쪽. 후진 + 좌조향. 칸에 충분히 정렬되면 핸들을 풀어 직진에 가깝게 밀어 넣습니다.",
  },
  {
    id: "mirror-trap",
    level: "함정",
    title: "사이드미러만 보면…",
    situation:
      "후진 중 오른쪽 미러에 ‘공간이 더 넓어 보여’ 급하게 핸들을 왼쪽으로 꺾었습니다. 차미는 실제로 어디로 갈까요?",
    gear: "reverse",
    carAngleDeg: -90,
    targetSide: "none",
    choices: [
      { id: "tail-left", label: "차미는 왼쪽(핸들 왼쪽)" },
      { id: "tail-right", label: "차미는 오른쪽" },
      { id: "no-move", label: "미러만 바뀌고 차체는 안 돈다" },
    ],
    correctChoiceId: "tail-left",
    explanation:
      "미러 이미지에 속아도 물리 규칙은 그대로입니다. 후진+좌핸들 → 차미 왼쪽. 미러는 보조, 기준은 ‘차미가 가고 싶은 쪽’입니다.",
  },
  {
    id: "camera-trap",
    level: "함정",
    title: "후방카메라 화면 기준의 착각",
    situation:
      "후방카메라(차 뒤가 화면 아래)만 보고 ‘화면 오른쪽 빈칸’으로 넣고 싶어 핸들을 화면 기준으로 오른쪽으로 돌렸습니다. 실차 차미는?",
    gear: "reverse",
    carAngleDeg: 90,
    targetSide: "right",
    choices: [
      {
        id: "ok-right",
        label: "차미가 차량 기준 오른쪽으로 — 의도와 맞을 수 있음",
      },
      {
        id: "opposite",
        label: "카메라는 항상 반대이므로 무조건 반대로 꺾어야 함",
      },
    ],
    correctChoiceId: "ok-right",
    explanation:
      "대부분의 후방카메라는 좌우가 거울처럼 맞춰져 ‘화면에서 보이는 쪽’과 핸들 방향이 일치하도록 설계됩니다. 그래도 헷갈리면 카메라보다 ‘차미 + 실물 좌우’를 기준으로 되돌리세요.",
  },
  {
    id: "correct-swing",
    level: "응용",
    title: "후진 중 앞범퍼가 반대로 스윙",
    situation:
      "후진하며 차미를 오른쪽으로 넣자 앞범퍼가 왼쪽으로 크게 나갑니다. 정상인가요?",
    gear: "reverse",
    carAngleDeg: -90,
    targetSide: "right",
    choices: [
      {
        id: "normal",
        label: "정상 — 후축 기준으로 앞이 반대쪽으로 스윙함",
      },
      {
        id: "wrong-steer",
        label: "조향이 잘못된 것 — 즉시 반대 핸들",
      },
    ],
    correctChoiceId: "normal",
    explanation:
      "정상입니다. 차는 후축 근처를 중심으로 회전하는 느낌이 강해서, 차미를 한쪽으로 넣으면 앞은 반대쪽으로 크게 나갑니다. 앞 장애물 여유를 항상 확인하세요.",
  },
];
