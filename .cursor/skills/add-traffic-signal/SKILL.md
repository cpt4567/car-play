---
name: add-traffic-signal
description: car-play 앱의 차량·보행자 신호등 항목을 추가하거나 수정한다. 사용자가 신호등·좌회전 화살표·점멸·우회전 신호, /signals 페이지 콘텐츠를 추가/수정하려 할 때 사용한다.
---

# 신호등 항목 추가

## 절차

1. `src/data/traffic-signals.ts`를 읽어 기존 톤을 확인한다.
2. `trafficSignals` 배열에 항목을 추가한다. UI는 수정할 필요 없다.
3. 새 카테고리가 필요하면 `SignalCategory`와 `SIGNAL_CATEGORIES`에 함께 추가한다.
4. 이미지는 `public/signals/`에 로컬로 저장한다.
5. `npm run build`로 타입을 검증한다.

## 스키마

```ts
{
  id: "green-go",
  category: "기본 색등",   // 기본 색등 | 좌회전 화살표 | 점멸 | 신호등 형태 | 보행자
  name: "녹색등 — 진행",
  meaning: "신호가 의미하는 바 (1~2문장)",
  action: "운전 중 바로 할 행동 (1~2문장)",
  image: "/signals/state-green.png",
  sourceFile: "Korea Trafficlight(RYAG) 3.gif",
  tags: ["녹색", "직진"],
}
```

## 이미지 원칙

- CSS·이모지로 신호등을 그리지 않는다.
- Wikimedia Commons의 대한민국 신호등 도안을 `public/signals/`에 저장한다.
- 사이클 GIF에서 **한 상태만** 보이는 PNG 프레임을 추출해 설명용으로 쓴다.
- 점멸은 GIF 애니메이션을 유지하고 `<img>`로 렌더링한다.
- `sourceFile`은 Commons 정확한 파일명으로 기록한다.

## 검증

- [ ] 카테고리·검색으로 노출되는지
- [ ] GIF가 움직이거나 PNG/SVG가 깨지지 않는지
- [ ] 이미지 출처 링크가 올바른지
- [ ] 해설이 적·황·녹 / 화살표 / 점멸 규칙과 모순되지 않는지
