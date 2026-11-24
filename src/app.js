import express from 'express';
import { categories } from './routes/categories.js';
import { brands } from './routes/brands.js';
import { products } from './routes/products.js';
import { reviews } from './routes/reviews.js';
import { notFound, errorHandler } from './middleware/errors.js';
import { logger } from './middleware/logger.js';

export const app = express();
app.disable('x-powered-by');

app.use(logger);
app.use(express.json({ limit: '64kb' }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/categories', categories);
app.use('/brands', brands);
app.use('/products', products);
app.use('/reviews', reviews);

app.use(notFound);
app.use(errorHandler);
