import { prisma } from '../db/prisma.js';
import { PRODUCTS } from '../data/products.js';
import type { PaginatedProducts, Product, ProductFilters } from '../types.js';

export async function seedProductsIfEmpty(): Promise<void> {
  const count = await prisma.product.count();
  if (count > 0) {
    return;
  }

  await prisma.product.createMany({
    data: PRODUCTS.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      intensity: product.intensity,
      origin: product.origin,
      weight: product.weight,
      region: product.region ?? null,
    })),
  });
}

export async function listProducts(filters: ProductFilters, page: number, pageSize: number): Promise<PaginatedProducts> {
  const where = {
    category: filters.category,
    region: filters.region,
    intensity: filters.intensity,
    price: {
      gte: filters.priceMin,
      lte: filters.priceMax,
    },
    OR: filters.search
      ? [
          { name: { contains: filters.search } },
          { description: { contains: filters.search } },
          { origin: { contains: filters.search } },
        ]
      : undefined,
  };

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { name: 'asc' },
    }),
  ]);

  return {
    products: products as Product[],
    total,
    page,
    pageSize,
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  return (await prisma.product.findUnique({ where: { id } })) as Product | null;
}
