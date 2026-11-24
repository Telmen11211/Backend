import { Router } from 'express';
import { listCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/categories.js';
import { listCategoryProducts } from '../controllers/products.js';
import { validate, validateId } from '../middleware/validate.js';

export const categories = Router();
categories.route('/').get(listCategories).post(validate('category'), createCategory);
categories.route('/:id')
  .get(validateId, getCategory)
  .patch(validateId, validate('category'), updateCategory)
  .delete(validateId, deleteCategory);
categories.get('/:id/products', validateId, listCategoryProducts);
