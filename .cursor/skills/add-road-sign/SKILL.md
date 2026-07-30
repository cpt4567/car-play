---
name: add-road-sign
description: car-play 앱의 도로 안내판·교통표지 항목을 추가하거나 수정한다. 사용자가 표지·안내판·노면표시·규제/주의/지시표지, /signs 페이지 콘텐츠를 추가/수정하려 할 때 사용한다.
---

# 도로 안내판·표지 추가

## 절차

1. `src/data/road-signs.ts`를 읽어 기존 톤·shape를 확인한다.
2. `roadSigns` 배열에 항목을 추가한다. UI는 수정할 필요 없다.
3. 새 카테고리가 필요하면 `SignCategory`와 `SIGN_CATEGORIES`에 함께 추가한다.
4. `npm run build`로 타입을 검증한다.

## 스키마

```ts
{
  id: "reg-speed-50",
  category: "규제표지",          // 주의표지 | 규제표지 | 지시표지 | 보조표지 | 노면표시 | 안내표지
  name: "최고속도 50",
  meaning: "표지가 의미하는 바 (1~2문장)",
  action: "운전 중 바로 할 행동 (1~2문장)",
  image: "/signs/reg-speed-50.png",
  sourceFile: "Korean Traffic sign (Maximum Speed Limit 50kph).svg",
  tags: ["제한속도"],
}
```

## 이미지 원칙

- CSS·텍스트·이모지로 표지를 그리지 않는다.
- 도로교통공단 표준 도안 또는 Wikimedia Commons의 대한민국 교통표지 이미지를 사용한다.
- 파일은 `public/signs/`에 로컬 정적 자산으로 저장한다. 외부 URL을 직접 렌더링하지 않는다.
- SVG 원본을 우선하고, 다운로드 제한이 있으면 공식 SVG의 PNG 썸네일을 쓴다.
- `sourceFile`은 Wikimedia Commons의 정확한 파일명으로 기록해 출처 링크를 생성한다.
- 안내표지는 공식 도안이 없을 때 대한민국 도로에서 촬영한 실제 사진을 사용한다.

## 작성 톤

- `meaning`: 표지가 **무엇인지**
- `action`: 앞에서 **무엇을 할지** (감속, 정지, 차로 이동 등)
- `/laws`의 법규 항목과 중복돼도 된다 — 표지는 시각 인식, 법은 판단 근거.

## 검증

- [ ] 카테고리 칩·검색으로 노출되는지
- [ ] `SignBadge`가 실제 이미지와 대체 텍스트를 표시하는지
- [ ] `public/signs/`에 해당 이미지가 존재하는지
- [ ] 이미지 출처 링크가 올바른 Commons 파일 페이지를 여는지
- [ ] 상단 색 범례(노란=주의, 빨간=규제, 파란·초록=지시·안내)와 모순되지 않는지
