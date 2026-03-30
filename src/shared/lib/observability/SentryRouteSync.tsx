import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as Sentry from '@sentry/react';

/**
 * Keeps Sentry scope in sync with the current URL so errors and slow transactions
 * are tagged with `route` (pathname) — useful to see which page is slow or failing.
 */
export function SentryRouteSync() {
  const location = useLocation();

  useEffect(() => {
    if (!Sentry.getClient()) return;

    const pathname = location.pathname;
    Sentry.setTag('route', pathname);
    Sentry.setContext('page', {
      pathname,
      search: location.search || undefined,
      hash: location.hash || undefined,
    });
  }, [location.pathname, location.search, location.hash]);

  return null;
}
