# CAR PLAY

회사·집에서 **방향감각 · 후진 · 주차**를 연습하고, 실전용 **안내판·도로교통법**을 확인하는 Next.js 웹앱입니다.

Thrustmaster T300 + [BeamNG.drive](https://namu.wiki/w/BeamNG.drive)로 익히던 후진 주차 감각이 안 잡힐 때, 키보드만으로 같은 규칙을 반복 학습하는 용도입니다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)

## 모듈

| 경로 | 내용 |
|------|------|
| `/signs` | 도로 안내판·교통표지 (주의·규제·지시·노면·안내) |
| `/signals` | 차량·보행자 신호등 (색등·화살표·점멸) |
| `/direction` | 전진/후진 조향 방향 퀴즈 |
| `/parking` | 탑다운 후진·평행·직각 주차 시뮬 |
| `/laws` | 도로교통법 핵심 요약·검색 |

## 핵심 감각

**후진 시: 차미가 갈 쪽 = 핸들 방향**

전진과 “앞범퍼가 반대로 스윙”해서 헷갈리지만, 주차 기준은 항상 차미입니다.

## AI 에이전트 설정

Cursor가 자동 인식하는 위치에 프로젝트 컨텍스트를 넣어 두었습니다.

```
AGENTS.md                  # 항상 적용 — 개요와 진입점
.cursor/rules/             # 규칙 (항상 / 파일 패턴별 자동 적용)
  car-play-project.mdc
  driving-domain.mdc
  ui-tone.mdc
.cursor/skills/            # 작업 절차 (해당 작업 요청 시 적용)
  add-road-sign/
  add-traffic-signal/
  add-traffic-law/
  add-direction-scenario/
  add-parking-course/
```

콘텐츠를 추가할 때는 그냥 요청하면 됩니다 — 예: “직각 주차 코스 하나 더 추가해줘”.
명시적으로 부르려면 `/add-parking-course` 처럼 스킬명을 쓰면 됩니다.

## 스택

Next.js (App Router) · TypeScript · Tailwind CSS · Canvas 2D
