export type ProductCategory = 'beans' | 'ground' | 'capsules';

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  beans: 'Whole Beans',
  ground: 'Ground',
  capsules: 'Capsules',
};

/** Origin / sourcing region for filters (e.g. Brazilian coffee). */
export type ProductRegion = 'brazil';

export const PRODUCT_REGION_LABELS: Record<ProductRegion, string> = {
  brazil: 'Brazilian coffee',
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  intensity: number; // 1-5
  origin: string;
  weight: string;
  /** When set, product appears under the matching Region filter. */
  region?: ProductRegion;
}

export interface ProductFilters {
  category?: ProductCategory;
  region?: ProductRegion;
  intensity?: number;
  priceMin?: number;
  priceMax?: number;
  search?: string;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}
