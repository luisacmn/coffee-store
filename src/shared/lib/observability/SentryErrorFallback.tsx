import type { FallbackRender } from '@sentry/react';

export const sentryErrorFallback: FallbackRender = ({ resetError }) => (
  <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-background p-8 text-center">
    <h1 className="font-display text-2xl font-semibold text-foreground">Something went wrong</h1>
    <p className="max-w-md text-muted-foreground">We&apos;ve logged this error. Try refreshing the page.</p>
    <button
      type="button"
      onClick={resetError}
      className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
    >
      Try again
    </button>
  </div>
);
