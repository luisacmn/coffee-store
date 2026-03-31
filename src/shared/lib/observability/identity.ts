const OBS_SESSION_ID_KEY = 'obs_session_id';
const USER_ID_STORAGE_KEYS = ['user_id', 'auth_user_id', 'userId'];

function createSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    return 'server';
  }

  const existing = window.localStorage.getItem(OBS_SESSION_ID_KEY);
  if (existing) return existing;

  const generated = createSessionId();
  window.localStorage.setItem(OBS_SESSION_ID_KEY, generated);
  return generated;
}

export function getCurrentUserId(): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  for (const key of USER_ID_STORAGE_KEYS) {
    const value = window.localStorage.getItem(key);
    if (value && value.trim().length > 0) {
      return value;
    }
  }

  return undefined;
}
