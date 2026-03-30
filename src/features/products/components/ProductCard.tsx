import { Link } from 'react-router-dom';
import type { Product } from '@/features/products/types';
import { IntensityDots } from '@/shared/components/IntensityDots';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group animate-fade-in"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-coffee-cream">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={640}
          height={640}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-medium leading-tight">{product.name}</h3>
          <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs capitalize text-muted-foreground">{product.category} · {product.weight}</span>
          <IntensityDots intensity={product.intensity} />
        </div>
      </div>
    </Link>
  );
}
