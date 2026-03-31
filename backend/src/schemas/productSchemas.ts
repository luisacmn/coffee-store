import { z } from 'zod';
import type { ProductFilters } from '../types.js';

const productCategorySchema = z.enum(['beans', 'ground', 'capsules']);
const productRegionSchema = z.enum(['brazil']);

const productsQuerySchema = z.object({
  category: productCategorySchema.optional(),
  region: productRegionSchema.optional(),
  intensity: z.coerce.number().int().min(1).max(5).optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(6),
});

export interface ProductsQueryParams {
  filters: ProductFilters;
  page: number;
  pageSize: number;
}

export function parseProductsQuery(query: unknown): ProductsQueryParams {
  const parsed = productsQuerySchema.parse(query);

  const filters: ProductFilters = {
    category: parsed.category,
    region: parsed.region,
    intensity: parsed.intensity,
    priceMin: parsed.priceMin,
    priceMax: parsed.priceMax,
    search: parsed.search,
  };

  return {
    filters,
    page: parsed.page,
    pageSize: parsed.pageSize,
  };
}
