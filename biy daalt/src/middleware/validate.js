import { HttpError } from './errors.js';

export const MAX_INT = 2_147_483_647;
export const MIN_YEAR = 1900;
export const MAX_YEAR = new Date().getFullYear() + 1;

export function invalid(field, message) {
  return new HttpError(400, message, field);
}

export function integer(value, field, min = 1, max = MAX_INT) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw invalid(field, `${field} must be an integer between ${min} and ${max}`);
  }
  return value;
}

export function text(value, field, max = 200) {
  if (typeof value !== 'string' || !value.trim() || value.includes(String.fromCharCode(0))) {
    throw invalid(field, `${field} must be non-empty text without null characters`);
  }
  if (value.trim().length > max) {
    throw invalid(field, `${field} must have at most ${max} characters`);
  }
  return value.trim();
}

const year = (value, field) => integer(value, field, MIN_YEAR, MAX_YEAR);
const longText = (value, field) => text(value, field, 2000);
const rating = (value, field) => integer(value, field, 1, 5);
const nullable = validator => (value, field) => value === null ? null : validator(value, field);

function boolean(value, field) {
  if (typeof value !== 'boolean') throw invalid(field, `${field} must be true or false`);
  return value;
}

const fields = {
  category: { name: text },
  brand: { name: text, foundedYear: nullable(year) },
  product: {
    name: text, releaseYear: year, price: integer, description: nullable(longText),
    inStock: boolean, categoryId: integer, brandId: nullable(integer),
  },
  review: { rating, comment: nullable(longText), authorName: text },
};

const required = {
  category: ['name'],
  brand: ['name'],
  product: ['name', 'releaseYear', 'price', 'categoryId'],
  review: ['rating', 'authorName'],
};

export function validate(model) {
  return (req, res, next) => {
    const { body } = req;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new HttpError(400, 'Request body must be a JSON object');
    }

    const keys = Object.keys(body);
    if (req.method === 'PATCH' && keys.length === 0) {
      throw new HttpError(400, 'Supply at least one editable field');
    }

    const data = {};
    for (const key of keys) {
      if (!Object.hasOwn(fields[model], key) || (model === 'review' && req.method === 'PATCH' && key === 'authorName')) {
        throw invalid(key, `Unexpected field: ${key}`);
      }
      data[key] = fields[model][key](body[key], key);
    }

    if (req.method === 'POST') {
      for (const key of required[model]) {
        if (!Object.hasOwn(data, key)) throw invalid(key, `${key} is required`);
      }
    }

    req.data = data;
    next();
  };
}

export function queryInteger(value, field, min, max) {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    throw invalid(field, `${field} must be an integer`);
  }
  return integer(Number(value), field, min, max);
}

export function validateId(req, res, next) {
  req.recordId = queryInteger(req.params.id, 'id');
  next();
}
