import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '@/features/products/hooks/useProducts';
import { PRODUCT_CATEGORY_LABELS } from '@/features/products/types';
import { useCartStore } from '@/features/cart/store/cartStore';
import { Navbar } from '@/shared/components/Navbar';
import { IntensityDots } from '@/shared/components/IntensityDots';
import { LoadingSpinner } from '@/shared/components/LoadingSkeleton';
import { ErrorState } from '@/shared/components/ErrorState';
import { logEvent } from '@/shared/lib/observability';
import { ArrowLeft, Minus, Plus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError, refetch } = useProduct(id!);
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) return <div className="min-h-screen bg-background"><Navbar /><LoadingSpinner /></div>;
  if (isError) return <div className="min-h-screen bg-background"><Navbar /><div className="container py-10"><ErrorState onRetry={() => refetch()} /></div></div>;
  if (!product) return <div className="min-h-screen bg-background"><Navbar /><div className="container py-10"><ErrorState message="Product not found" /></div></div>;

  const handleAddToCart = () => {
    logEvent('add_to_cart_clicked', {
      productId: product.id,
      quantity,
      price: product.price,
    });
    addItem(
      { productId: product.id, name: product.name, price: product.price, image: product.image },
      quantity
    );
    toast.success(`${product.name} added to cart`);
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </Link>

        <div className="mt-4 grid gap-10 md:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-lg bg-coffee-cream">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
              width={640}
              height={640}
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {PRODUCT_CATEGORY_LABELS[product.category]} · {product.origin}
            </span>
            <h1 className="mt-2 font-display text-3xl font-semibold">{product.name}</h1>
            <p className="mt-1 text-2xl font-medium">${product.price.toFixed(2)}</p>

            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Intensity</span>
              <IntensityDots intensity={product.intensity} />
            </div>

            <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>
            <p className="mt-2 text-sm text-muted-foreground">Weight: {product.weight}</p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center rounded-md border border-border">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-muted"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-10 w-10 items-center justify-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-muted"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
