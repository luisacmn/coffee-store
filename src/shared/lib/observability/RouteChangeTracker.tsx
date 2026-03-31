import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { logEvent, logPageView } from './logger';

function routeName(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/product/')) return 'product_detail';
  if (pathname === '/cart') return 'cart';
  if (pathname === '/checkout') return 'checkout';
  return pathname.replace(/\//g, '_').replace(/^_+/, '') || 'unknown';
}

export function RouteChangeTracker() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    const page = routeName(location.pathname);

    logPageView(page);
    logEvent('route_change', {
      route: location.pathname,
      search: location.search,
      navigationType,
    });
  }, [location.pathname, location.search, navigationType]);

  return null;
}
