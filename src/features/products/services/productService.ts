import type { Product, ProductFilters, PaginatedProducts } from '../types';
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
  const response = await fetch(buildProductsUrl(filters, page, pageSize));
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return (await response.json()) as PaginatedProducts;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return (await response.json()) as Product;
}
