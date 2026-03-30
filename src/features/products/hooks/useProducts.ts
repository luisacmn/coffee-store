import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductById } from '../services/productService';
import type { ProductFilters } from '../types';

export function useProducts(filters?: ProductFilters, page = 1, pageSize = 6) {
  return useQuery({
    queryKey: ['products', filters, page, pageSize],
    queryFn: () => fetchProducts(filters, page, pageSize),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
}
