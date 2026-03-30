/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string;
  /** Sentry project DSN — errors & performance when set */
  readonly VITE_SENTRY_DSN?: string;
  /** Optional release label (e.g. git SHA) in Sentry */
  readonly VITE_APP_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
