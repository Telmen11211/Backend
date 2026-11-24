export class HttpError extends Error {
  constructor(status, message, field) {
    super(message);
    this.status = status;
    this.field = field;
  }
}

export function notFound(req, res, next) {
  next(new HttpError(404, 'Route not found'));
}

function foreignKeyError(error, req) {
  if (req.method === 'DELETE') return new HttpError(409, 'Category still contains products');
  const constraint = String(error.meta?.constraint ?? error.meta?.field_name ?? '');
  if (constraint.includes('productId')) return new HttpError(404, 'Product not found');
  const field = ['categoryId', 'brandId'].find(key => constraint.includes(key));
  return new HttpError(400, 'Referenced record does not exist', field);
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  let response = error;
  if (error.code === 'P2002') {
    const isReview = error.meta?.modelName === 'Review';
    response = new HttpError(409, isReview ? 'This author has already reviewed this product' : 'Category name already exists',
      isReview ? 'authorName' : 'name');
  } else if (error.code === 'P2003') {
    response = foreignKeyError(error, req);
  } else if (error.code === 'P2025') {
    response = new HttpError(404, 'Record not found');
  } else if (!(error instanceof HttpError)) {
    const messages = {
      400: 'Invalid request',
      413: 'Request body is too large',
      415: 'Unsupported request body encoding or charset',
    };
    const status = Object.hasOwn(messages, error.status) ? error.status : 500;
    if (status === 500) console.error(error);
    response = new HttpError(status, messages[status] ?? 'Internal server error');
  }

  const { status, message, field } = response;
  return res.status(status).json(field === undefined ? { message } : { message, field });
}
