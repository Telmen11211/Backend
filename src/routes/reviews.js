import { Router } from 'express';
import { updateReview, deleteReview } from '../controllers/reviews.js';
import { validate, validateId } from '../middleware/validate.js';

export const reviews = Router();
reviews.route('/:id')
  .patch(validateId, validate('review'), updateReview)
  .delete(validateId, deleteReview);
