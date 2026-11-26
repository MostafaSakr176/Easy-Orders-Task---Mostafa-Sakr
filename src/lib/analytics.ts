export interface AnalyticsRecord {
  event: string;
  payload: Record<string, unknown>;
  at: string;
}

const log: AnalyticsRecord[] = [];
const MAX_RECORDS = 50;

interface DataLayerWindow extends Window {
  dataLayer?: Array<Record<string, unknown>>;
}

export function track(event: string, payload: Record<string, unknown> = {}): void {
  const record: AnalyticsRecord = { event, payload, at: new Date().toISOString() };
  log.push(record);
  if (log.length > MAX_RECORDS) log.shift();
  try {
    sessionStorage.setItem("easy-orders-analytics", JSON.stringify(log));
  } catch {
    // Storage can be unavailable in private mode.
  }
  const target = window as DataLayerWindow;
  target.dataLayer = target.dataLayer ?? [];
  target.dataLayer.push({ event, ...payload });
  if (import.meta.env.DEV) {
    console.info("[analytics]", event, payload);
  }
  window.dispatchEvent(new CustomEvent("eo-analytics", { detail: record }));
}

export function getAnalyticsLog(): AnalyticsRecord[] {
  return [...log];
}

export function clearAnalytics(): void {
  log.length = 0;
  try {
    sessionStorage.removeItem("easy-orders-analytics");
  } catch {
    // Ignore storage failures.
  }
}
