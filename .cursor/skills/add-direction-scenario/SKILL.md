---
name: add-direction-scenario
description: car-play 앱의 방향감각 퀴즈 시나리오를 추가하거나 수정한다. 사용자가 전진/후진 조향 문제, 방향감각 퀴즈, /direction 페이지 콘텐츠를 추가/수정하려 할 때 사용한다.
---

# 방향감각 시나리오 추가

## 절차

1. `src/data/direction-scenarios.ts`를 읽어 기존 시나리오 톤을 확인한다.
2. `directionScenarios` 배열에 추가한다. 난이도 순서(기초 → 응용 → 함정)로 배치한다.
3. `npm run build`로 타입을 검증한다.

## 스키마

```ts
{
  id: "rev-right-tail",
  level: "기초",                    // 기초 | 응용 | 함정
  title: "후진 — 차미를 오른쪽으로",
  situation: "상황 설명 (사용자가 어떤 시점에서 무엇을 하려는지)",
  gear: "reverse",                  // forward | reverse
  carAngleDeg: -90,                 // 탑다운 다이어그램 차량 각도. 0 = 오른쪽
  targetSide: "right",              // left | right | behind | none
  choices: [
    { id: "wheel-right", label: "핸들을 오른쪽으로" },
    { id: "wheel-left", label: "핸들을 왼쪽으로" },
  ],
  correctChoiceId: "wheel-right",
  explanation: "왜 그런지 한 문단. 후진이면 차미 기준으로 설명한다.",
}
```

보기는 2~4개. 숫자 키 1–4로 선택되므로 4개를 넘기지 않는다.

## 난이도 기준

| level | 내용 |
|-------|------|
| 기초 | 전진/후진 기본 조향 방향 |
| 응용 | 평행주차 진입각, 직각 주차 베이 선택, 차체 스윙 |
| 함정 | 사이드미러·후방카메라 시점 착각 |

## 해설 필수 조건

`.cursor/rules/driving-domain.mdc`의 규칙을 반드시 지킨다.

- 후진 시나리오의 `explanation`은 **"차미가 갈 쪽 = 핸들 방향"** 기준으로 쓴다.
- 헷갈리는 원인(앞범퍼가 반대로 스윙)을 언급해 감각을 교정한다.

## 검증

- [ ] 오답 선택 시 해설이 노출되는지
- [ ] 숫자 키 선택 / Enter로 다음 진행이 되는지
- [ ] `targetSide`에 맞게 다이어그램 점선 목표 영역이 그려지는지
