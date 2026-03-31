import type { NextFunction, Request, Response } from 'express';
import { parseProductsQuery } from '../schemas/productSchemas';
import { getProductById, listProducts } from '../repositories/productRepository';

export async function getProductsController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { filters, page, pageSize } = parseProductsQuery(req.query);
    const result = await listProducts(filters, page, pageSize);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getProductByIdController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const productId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await getProductById(productId);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
}
