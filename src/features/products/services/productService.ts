import type { Product, ProductFilters, PaginatedProducts } from '../types';
import { logError, logEvent } from '@/shared/lib/observability';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3333/api';

function buildProductsUrl(filters?: ProductFilters, page = 1, pageSize = 6): string {
  const params = new URLSearchParams();

  if (filters?.category) params.set('category', filters.category);
  if (filters?.region) params.set('region', filters.region);
  if (filters?.intensity !== undefined) params.set('intensity', String(filters.intensity));
  if (filters?.priceMin !== undefined) params.set('priceMin', String(filters.priceMin));
  if (filters?.priceMax !== undefined) params.set('priceMax', String(filters.priceMax));
  if (filters?.search) params.set('search', filters.search);

  params.set('page', String(page));
  params.set('pageSize', String(pageSize));

  return `${API_BASE_URL}/products?${params.toString()}`;
}

export async function fetchProducts(
  filters?: ProductFilters,
  page = 1,
  pageSize = 6
): Promise<PaginatedProducts> {
  const url = buildProductsUrl(filters, page, pageSize);
  const startedAt = performance.now();

  try {
    const response = await fetch(url);
    const durationMs = Math.round(performance.now() - startedAt);

    if (!response.ok) {
      logEvent('api_products_failed', {
        endpoint: '/products',
        status: response.status,
        durationMs,
      });
      throw new Error('Failed to fetch products');
    }

    logEvent('api_products_ok', {
      endpoint: '/products',
      status: response.status,
      durationMs,
    });

    return (await response.json()) as PaginatedProducts;
  } catch (error) {
    logError(error, { endpoint: '/products', url });
    throw error;
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const url = `${API_BASE_URL}/products/${id}`;
  const startedAt = performance.now();

  try {
    const response = await fetch(url);
    const durationMs = Math.round(performance.now() - startedAt);

    if (response.status === 404) {
      logEvent('api_product_not_found', {
        endpoint: '/products/:id',
        status: response.status,
        durationMs,
      });
      return null;
    }

    if (!response.ok) {
      logEvent('api_product_failed', {
        endpoint: '/products/:id',
        status: response.status,
        durationMs,
      });
      throw new Error('Failed to fetch product');
    }

    logEvent('api_product_ok', {
      endpoint: '/products/:id',
      status: response.status,
      durationMs,
    });

    return (await response.json()) as Product;
  } catch (error) {
    logError(error, { endpoint: '/products/:id', url, productId: id });
    throw error;
  }
}
