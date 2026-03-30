export type ProductCategory = 'beans' | 'ground' | 'capsules';

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
}

export interface ProductFilters {
  category?: ProductCategory;
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
