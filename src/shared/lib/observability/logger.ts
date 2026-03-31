import * as Sentry from '@sentry/react';
import type { Metric } from 'web-vitals';
import { getCurrentUserId, getOrCreateSessionId } from './identity';
import { appendRecord } from './store';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type ObservabilityRecordType =
  | 'log'
  | 'event'
  | 'page_view'
  | 'web_vital'
  | 'exception';

/** JSON-serializable line (prod console / future drains) */
export interface StructuredLogRecord {
  ts: string;
  level: LogLevel;
  service: string;
  env: string;
  type: ObservabilityRecordType;
  message: string;
  context?: Record<string, unknown>;
}

const service = import.meta.env.VITE_APP_NAME ?? 'ember-roast';
const env = import.meta.env.MODE;

function baseRecord(
  level: LogLevel,
  type: ObservabilityRecordType,
  message: string,
  context?: Record<string, unknown>
): StructuredLogRecord {
  const enrichedContext = {
    session_id: getOrCreateSessionId(),
    user_id: getCurrentUserId(),
    ...(context ?? {}),
  };

  return {
    ts: new Date().toISOString(),
    level,
    service,
    env,
    type,
    message,
    ...(Object.keys(enrichedContext).length > 0 ? { context: enrichedContext } : {}),
  };
}

function write(record: StructuredLogRecord): void {
  appendRecord(record);

  if (import.meta.env.DEV) {
    const { level, type, message, context } = record;
    const style =
      level === 'error'
        ? 'color:#ef4444'
        : level === 'warn'
          ? 'color:#f59e0b'
          : 'color:#64748b';
    console.log(`%c[obs] ${level}`, style, type, message, context ?? '');
  } else {
    console.log(JSON.stringify(record));
  }
}

/** Low-level structured log (JSON line in prod). */
export function logStructured(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
  type: ObservabilityRecordType = 'log'
): void {
  write(baseRecord(level, type, message, context));
}

export type EventPayload = Record<string, unknown>;

export function logEvent(name: string, payload?: EventPayload): void {
  write(
    baseRecord('info', 'event', `event:${name}`, {
      event: name,
      ...(payload ?? {}),
    })
  );
}

export function logPageView(page: string): void {
  write(
    baseRecord('info', 'page_view', `page_view:${page}`, {
      page,
      path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    })
  );
}

export function logWebVitalMetric(metric: Metric): void {
  const route =
    typeof window !== 'undefined' ? window.location.pathname : undefined;
  write(
    baseRecord('info', 'web_vital', `web_vital:${metric.name}`, {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      route,
    })
  );
}

function toError(value: unknown): Error {
  if (value instanceof Error) return value;
  if (typeof value === 'string') return new Error(value);
  try {
    return new Error(JSON.stringify(value));
  } catch {
    return new Error(String(value));
  }
}

export function captureException(error: unknown, context?: Record<string, unknown>): void {
  const err = toError(error);

  if (Sentry.getClient()) {
    Sentry.captureException(err, context ? { extra: context } : undefined);
  }

  const withCause = err as Error & { cause?: unknown };
  const causeMsg =
    withCause.cause instanceof Error ? withCause.cause.message : undefined;

  write(
    baseRecord('error', 'exception', err.message, {
      ...context,
      name: err.name,
      stack: err.stack,
      ...(causeMsg !== undefined ? { cause: causeMsg } : {}),
    })
  );
}

/** @param context — short label (legacy) or structured fields */
export function logError(error: unknown, context?: string | Record<string, unknown>): void {
  const ctx =
    typeof context === 'string'
      ? { note: context }
      : context;
  captureException(error, ctx);
}
