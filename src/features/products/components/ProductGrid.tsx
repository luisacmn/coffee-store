import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import type { ProductFilters } from '../types';
import { ProductCard } from './ProductCard';
import { FilterSidebar } from './FilterSidebar';
import { LoadingSkeleton } from '@/shared/components/LoadingSkeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ProductGrid() {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const { data, isLoading, isError, refetch } = useProducts(filters, page, pageSize);

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <FilterSidebar filters={filters} onChange={handleFilterChange} />

      <div>
        {isLoading && <LoadingSkeleton count={pageSize} />}

        {isError && <ErrorState onRetry={() => refetch()} />}

        {data && data.products.length === 0 && (
          <EmptyState
            title="No coffees found"
            description="Try adjusting your filters or search term."
          />
        )}

        {data && data.products.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                      page === i + 1
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border hover:bg-muted'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
