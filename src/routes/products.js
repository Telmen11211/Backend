import { Router } from 'express';
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/products.js';
import { listReviews, createReview } from '../controllers/reviews.js';
import { validate, validateId } from '../middleware/validate.js';

export const products = Router();
products.route('/').get(listProducts).post(validate('product'), createProduct);
products.route('/:id')
  .get(validateId, getProduct)
  .patch(validateId, validate('product'), updateProduct)
  .delete(validateId, deleteProduct);
products.route('/:id/reviews')
  .get(validateId, listReviews)
  .post(validateId, validate('review'), createReview);
