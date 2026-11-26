import type { KeyboardEvent } from "react";

export function useVariationGroup(enabled: string[], selected: string | undefined, onSelect: (name: string) => void) {
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    if (enabled.length === 0) return;
    event.preventDefault();
    const current = Math.max(0, enabled.indexOf(selected ?? ""));
    let next = current;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % enabled.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + enabled.length) % enabled.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = enabled.length - 1;
    const name = enabled[next];
    if (!name || name === selected) return;
    onSelect(name);
    event.currentTarget.querySelector<HTMLButtonElement>(`[data-option="${CSS.escape(name)}"]`)?.focus();
  }

  function tabIndex(name: string, available: boolean) {
    if (!available) return -1;
    if (selected) return name === selected ? 0 : -1;
    return name === enabled[0] ? 0 : -1;
  }

  return { onKeyDown, tabIndex };
}
