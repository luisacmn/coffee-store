import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';
import { logWebVitalMetric } from './logger';

/**
 * Core Web Vitals + paint / server timing — reported as structured `web_vital` events.
 */
export function initWebVitals(): void {
  if (typeof window === 'undefined') return;

  onCLS(logWebVitalMetric);
  onINP(logWebVitalMetric);
  onLCP(logWebVitalMetric);
  onFCP(logWebVitalMetric);
  onTTFB(logWebVitalMetric);
}
