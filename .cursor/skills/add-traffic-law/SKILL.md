---
name: add-traffic-law
description: car-play 앱의 도로교통법 항목을 추가하거나 수정한다. 사용자가 법규·표지·신호·속도·주차 규정 항목을 추가/수정하거나 /laws 페이지 콘텐츠를 손보려 할 때 사용한다.
---

# 도로교통법 항목 추가

## 절차

1. `src/data/traffic-laws.ts`를 읽어 기존 항목의 톤을 확인한다.
2. `trafficLaws` 배열에 항목을 추가한다. UI 컴포넌트는 수정할 필요가 없다.
3. 새 카테고리가 필요하면 `LawCategory` 유니온과 `LAW_CATEGORIES` 배열에 함께 추가한다.
4. `npm run build`로 타입을 검증한다.

## 스키마

```ts
{
  id: "kebab-case-고유값",
  category: "신호·표지",              // LawCategory 유니온 값
  title: "적색 신호 — 정지선 앞 완전 정지",
  summary: "운전 중 즉시 판단 가능한 2~3문장 요약",
  practiceTip: "실전에서 몸으로 적용하는 한 문장",
  severity: "critical",              // info | caution | critical
  tags: ["신호", "교차로"],
}
```

## 작성 톤

- `summary`: 법령 조문 인용이 아니라 **"운전 중 즉시 판단용"** 요약. 2~3문장.
- `practiceTip`: 판단 기준이나 루틴을 주는 실전 조언. 훈수 아님.
- `severity`: 사고·단속 위험이 큰 것은 `critical`, 습관 교정은 `caution`, 감각 설명은 `info`.
- 벌점·과태료 금액처럼 자주 바뀌는 수치는 단정하지 않는다.
- 후진·주차 관련 항목이면 `.cursor/rules/driving-domain.mdc`의 조향 규칙과 일치시킨다.

## 검증

- [ ] 검색어(`title`/`summary`/`practiceTip`/`tags`)로 필터링되는지
- [ ] 카테고리 칩 전환 시 노출되는지
- [ ] 면책 문구가 페이지 하단에 남아 있는지
