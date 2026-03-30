import type { CheckoutData } from '../types';
import { logEvent } from '@/shared/lib/observability';

function delay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function submitCheckout(
  data: CheckoutData,
  items: { productId: string; quantity: number }[]
): Promise<{ orderId: string }> {
  await delay(1500);
  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
  logEvent('checkout_complete', { orderId, email: data.email, itemCount: items.length });
  return { orderId };
}
