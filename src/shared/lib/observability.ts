// Observability abstraction layer
// Ready for future Grafana Faro integration

type EventPayload = Record<string, unknown>;

export function logEvent(name: string, payload?: EventPayload): void {
  if (import.meta.env.DEV) {
    console.log(`[Event] ${name}`, payload ?? '');
  }
  // TODO: Forward to Grafana Faro when integrated
}

export function logError(error: unknown, context?: string): void {
  if (import.meta.env.DEV) {
    console.error(`[Error]${context ? ` ${context}` : ''}`, error);
  }
  // TODO: Forward to Grafana Faro when integrated
}

export function logPageView(page: string): void {
  logEvent('page_view', { page, timestamp: Date.now() });
}
