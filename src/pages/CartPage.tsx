import { Link } from 'react-router-dom';
import { Navbar } from '@/shared/components/Navbar';
import { EmptyState } from '@/shared/components/EmptyState';
import { useCartStore } from '@/features/cart/store/cartStore';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartPage = () => {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <h1 className="font-display text-2xl font-semibold">Your Cart</h1>

        {items.length === 0 ? (
          <EmptyState
            title="Your cart is empty"
            description="Browse our collection and find your perfect coffee."
            action={
              <Link
                to="/"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Shop now
              </Link>
            }
          />
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 py-6 first:pt-0 animate-fade-in">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-coffee-cream">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <span className="text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-md border border-border">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-muted"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="flex h-8 w-8 items-center justify-center text-xs font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-muted"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-border p-6">
              <h3 className="font-display text-lg font-medium">Order Summary</h3>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-muted-foreground">Calculated at checkout</span>
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Link
                to="/checkout"
                className="mt-6 flex w-full items-center justify-center rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
