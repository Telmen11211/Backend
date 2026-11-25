import { Router } from 'express';
import { listBrands, getBrand, createBrand, updateBrand, deleteBrand } from '../controllers/brands.js';
import { listBrandProducts } from '../controllers/products.js';
import { validate, validateId } from '../middleware/validate.js';

export const brands = Router();
brands.route('/').get(listBrands).post(validate('brand'), createBrand);
brands.route('/:id')
  .get(validateId, getBrand)
  .patch(validateId, validate('brand'), updateBrand)
  .delete(validateId, deleteBrand);
brands.get('/:id/products', validateId, listBrandProducts);
