---
name: add-parking-course
description: car-play 주차 시뮬레이터의 코스를 추가하거나 물리 파라미터를 조정한다. 사용자가 주차 코스, 후진 코스, 장애물 배치, 성공 판정, 조향/가속 감도를 추가/수정하려 할 때 사용한다.
---

# 주차 코스 추가 · 물리 조정

## 코스 추가

1. `src/data/parking-courses.ts`를 읽는다.
2. `parkingCourses` 배열에 추가한다. 컴포넌트 수정 없이 코스 선택 칩이 자동 생성된다.
3. `npm run build` 후 브라우저에서 실제로 주차가 **가능한지** 확인한다.

```ts
{
  id: "perp-right",
  name: "직각 주차 (우측)",
  description: "한 줄 안내. 어떤 조향 감각을 연습하는 코스인지 밝힌다.",
  width: 800,
  height: 520,
  carStart: { x: 180, y: 260, heading: 0 },   // heading 라디안, 0 = 오른쪽
  obstacles: [
    { id: "c1", x: 520, y: 80, w: 90, h: 150, kind: "car", label: "주차차량" },
  ],
  target: { x: 520, y: 240, w: 100, h: 70, heading: 0 },
  success: { maxCenterDist: 30, maxHeadingDeg: 15 },
}
```

`kind`는 `"wall" | "car" | "curb"`로, 캔버스 색이 달라진다.

## 코스 설계 기준

- 캔버스는 `800 × 520` 유지 (반응형 스케일이 이 비율에 맞춰져 있다).
- 차체는 `length 56 × width 28`, `wheelbase 34`. 슬롯은 차보다 최소 1.5배 여유.
- `carStart`는 목표 슬롯 옆·앞에 두고, **후진으로 들어가야 하는** 배치로 만든다.
- 경계에서 10px 안쪽은 충돌 판정이므로 여유를 둔다.
- 허용오차는 난이도에 맞춘다: 쉬움 `maxCenterDist: 32 / maxHeadingDeg: 18`, 어려움 `26 / 12`.

## 물리 조정

`src/lib/parking-physics.ts`에서 **상수만** 조정한다. 부호 규약과 자전거 모델 식은 바꾸지 않는다.

| 상수 | 역할 |
|------|------|
| `MAX_SPEED` | 최고 속도 (후진은 65%) |
| `ACCEL` / `BRAKE` / `DRAG` | 가속·제동·감쇠 |
| `MAX_STEER` | 최대 조향각(rad) — 회전 반경 |
| `STEER_RATE` | 조향 속도 |

## 검증

- [ ] **후진 + 우조향 시 차미가 우측으로** 도는지 (핵심)
- [ ] 장애물·경계 충돌 시 정지하고 R 리셋 안내가 뜨는지
- [ ] 목표 슬롯 정렬 시 성공 판정이 뜨는지 (거리 + 각도 + 저속 3조건)
- [ ] HUD의 기어·조향 힌트가 실제 상태와 맞는지
