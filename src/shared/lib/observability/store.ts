import type { StructuredLogRecord } from './logger';

const STORAGE_KEY = 'obs_records';
const MAX_RECORDS = 1000;
const RECORD_EVENT = 'obs-record-appended';

export function getStoredRecords(): StructuredLogRecord[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as StructuredLogRecord[];
  } catch {
    return [];
  }
}

export function appendRecord(record: StructuredLogRecord): void {
  if (typeof window === 'undefined') return;

  const current = getStoredRecords();
  const next = [...current, record].slice(-MAX_RECORDS);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(RECORD_EVENT));
}

export function subscribeRecords(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = () => onChange();
  window.addEventListener(RECORD_EVENT, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(RECORD_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

export function clearStoredRecords(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(RECORD_EVENT));
}
