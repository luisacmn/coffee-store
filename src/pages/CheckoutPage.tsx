import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/shared/components/Navbar';
import { EmptyState } from '@/shared/components/EmptyState';
import { useCartStore } from '@/features/cart/store/cartStore';
import { submitCheckout } from '@/features/cart/services/cartService';
import { logError, logEvent } from '@/shared/lib/observability';
import { CheckCircle2, Loader2 } from 'lucide-react';

const CheckoutPage = () => {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const clearCart = useCartStore((s) => s.clearCart);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  if (orderId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container flex flex-col items-center py-20 text-center">
          <CheckCircle2 className="mb-4 h-16 w-16 text-accent" />
          <h1 className="font-display text-2xl font-semibold">Order Confirmed!</h1>
          <p className="mt-2 text-muted-foreground">
            Your order <span className="font-medium text-foreground">{orderId}</span> has been placed.
          </p>
          <Link
            to="/"
            className="mt-6 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Continue Shopping
          </Link>
        </main>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-10">
          <EmptyState
            title="Nothing to checkout"
            description="Add some items to your cart first."
            action={
              <Link
                to="/"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Shop now
              </Link>
            }
          />
        </main>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    logEvent('checkout_submit_clicked', {
      itemsCount: items.length,
      total,
      hasName: Boolean(name.trim()),
      hasEmail: Boolean(email.trim()),
    });
    setSubmitting(true);
    try {
      const result = await submitCheckout(
        { name, email },
        items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
      );
      logEvent('checkout_submit_succeeded', {
        itemsCount: items.length,
        total,
        orderId: result.orderId,
      });
      setOrderId(result.orderId);
      clearCart();
    } catch (error) {
      logEvent('checkout_submit_failed', {
        itemsCount: items.length,
        total,
      });
      logError(error, { flow: 'checkout_submit' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <h1 className="font-display text-2xl font-semibold">Checkout</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="john@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Place Order · $${total.toFixed(2)}`
              )}
            </button>
          </form>

          <div className="rounded-lg border border-border p-6">
            <h3 className="font-display text-lg font-medium">Order Summary</h3>
            <div className="mt-4 divide-y divide-border">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between py-3 text-sm">
                  <span>
                    {item.name} <span className="text-muted-foreground">×{item.quantity}</span>
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
