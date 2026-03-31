import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/features/cart/store/cartStore';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight">
          Ember & Roast
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Shop
          </Link>
          <Link to="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Dashboard
          </Link>
          <Link to="/support" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Support
          </Link>
          <Link to="/cart" className="relative flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-2.5 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="animate-fade-in border-t border-border bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium">
              Shop
            </Link>
            <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium">
              Dashboard
            </Link>
            <Link to="/support" onClick={() => setMobileOpen(false)} className="text-sm font-medium">
              Support
            </Link>
            <Link to="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-medium">
              <ShoppingBag className="h-4 w-4" />
              Cart {itemCount > 0 && `(${itemCount})`}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
