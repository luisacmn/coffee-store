import { Router } from 'express';
import { getProductByIdController, getProductsController } from '../controllers/productController';

export const productRoutes = Router();

productRoutes.get('/products', getProductsController);
productRoutes.get('/products/:id', getProductByIdController);
