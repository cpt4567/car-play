---
name: add-vehicle-control
description: car-play 앱의 와이퍼·상향등·깜빡이 등 칼럼 레버 조작 설명을 추가하거나 수정한다. 사용자가 차량 조작·레버·라이트·워셔, /controls 페이지 콘텐츠를 추가/수정하려 할 때 사용한다.
---

# 차량 조작(칼럼 레버) 항목 추가

## 절차

1. `src/data/vehicle-controls.ts`를 읽어 기존 톤·번호 체계를 확인한다.
2. `vehicleControls` 배열에 항목을 추가한다. UI는 수정할 필요 없다.
3. 새 카테고리가 필요하면 `ControlCategory`와 `CONTROL_CATEGORIES`에 함께 추가한다.
4. 도해 이미지가 바뀌면 `public/controls/`에 넣고 `ControlsExplorer`의 `src`를 맞춘다.
5. `npm run build`로 타입을 검증한다.

## 스키마

```ts
{
  id: "high-beam",
  number: 10,                         // 도해 번호와 대응
  category: "조명·방향지시",           // 조명·방향지시 | 와이퍼·워셔
  name: "상향등 · 하향등 · 패싱",
  how: "레버를 어떻게 움직이는지 (1~2문장)",
  meaning: "이 조작이 무엇을 위한지 (1~2문장)",
  practiceTip: "실전에서 바로 쓰는 한 문장",
  tags: ["상향등", "패싱"],
}
```

## 작성 톤

- `how`: 손 동작 중심. “밀다 / 당기다 / 올리다 / 돌리다”.
- `meaning`: 왜 쓰는지. 법령 조문 인용보다 즉시 판단용.
- `practiceTip`: 습관·안전 한 줄. 훈수 톤 금지.
- 차종마다 좌우 레버가 바뀔 수 있음을 항목이나 페이지 면책에서 언급한다.
- UI 텍스트는 한국어.

## 검증

- [ ] 도해 번호와 `number`가 일치하는지
- [ ] 카테고리 칩·검색으로 필터되는지
- [ ] `/controls` 페이지 하단에 차종 차이 면책이 남아 있는지
