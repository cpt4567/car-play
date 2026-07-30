/** `e.key`는 방향키에서 "ArrowUp"처럼 대문자로 오므로 소문자로 통일한다. */
export function normalizeKey(e: KeyboardEvent): string {
  return e.key === " " ? "space" : e.key.toLowerCase();
}

/** 검색창 등에 입력 중일 때는 연습용 단축키를 가로채지 않는다. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return ["input", "textarea", "select"].includes(target.tagName.toLowerCase());
}
