<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# car-play

운전 감각(방향감각 · 후진 · 주차) 연습과 도로 안내판·도로교통법 확인용 웹앱.

프로젝트 컨텍스트와 작업 절차는 아래에 있다. Cursor에서는 자동 적용되며, 그 외 에이전트는 직접 읽는다.

## 규칙 (`.cursor/rules/`)

| 파일 | 적용 |
|------|------|
| `car-play-project.mdc` | 항상 — 목적, 디렉터리 구조, 범위 |
| `driving-domain.mdc` | `src/data/`, `src/lib/`, `src/components/` — 후진 조향 규칙, 기구학 규약 |
| `ui-tone.mdc` | `src/**/*.tsx`, `*.css` — 색·타이포·레이아웃 |

## 스킬 (`.cursor/skills/`)

| 스킬 | 용도 |
|------|------|
| `add-road-sign` | 도로 안내판·표지 추가·수정 |
| `add-traffic-signal` | 차량·보행자 신호등 추가·수정 |
| `add-traffic-law` | 도로교통법 항목 추가·수정 |
| `add-direction-scenario` | 방향감각 퀴즈 시나리오 추가·수정 |
| `add-parking-course` | 주차 코스 추가, 물리 파라미터 조정 |

## 절대 규칙

후진 시 **차미가 갈 쪽 = 핸들 방향**. 모든 해설·힌트·시뮬레이션이 이와 일치해야 한다.
