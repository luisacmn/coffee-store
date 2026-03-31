export type ProductCategory = 'beans' | 'ground' | 'capsules';

export type ProductRegion = 'brazil';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  intensity: number;
  origin: string;
  weight: string;
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
