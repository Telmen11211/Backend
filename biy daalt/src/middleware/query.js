import { invalid, MAX_INT, MAX_YEAR, MIN_YEAR, queryInteger, text } from './validate.js';

const paginationRules = {
  page: value => queryInteger(value, 'page'),
  limit: value => queryInteger(value, 'limit', 1, 50),
};
const productQueryRules = {
  ...paginationRules,
  q: value => text(value, 'q'),
  categoryId: value => queryInteger(value, 'categoryId'),
  brandId: value => queryInteger(value, 'brandId'),
  hasBrand: value => queryBoolean(value, 'hasBrand'),
  minYear: value => queryInteger(value, 'minYear', MIN_YEAR, MAX_YEAR),
  maxYear: value => queryInteger(value, 'maxYear', MIN_YEAR, MAX_YEAR),
  inStock: value => queryBoolean(value, 'inStock'),
  sort: value => choice(value, 'sort', ['name', 'releaseYear', 'price', 'createdAt']),
  order: value => choice(value, 'order', ['asc', 'desc']),
  minRating: value => {
    if (typeof value !== 'string' || !/^\d+(?:\.\d+)?$/.test(value) || Number(value) < 1 || Number(value) > 5) {
      throw invalid('minRating', 'minRating must be a number between 1 and 5');
    }
    return Number(value);
  },
};
const reviewQueryRules = {
  ...paginationRules,
  sort: value => choice(value, 'sort', ['rating', 'createdAt']),
  order: productQueryRules.order,
};

function choice(value, field, choices) {
  if (!choices.includes(value)) throw invalid(field, `${field} must be one of: ${choices.join(', ')}`);
  return value;
}

function queryBoolean(value, field) {
  return choice(value, field, ['true', 'false']) === 'true';
}

function parse(query, rules) {
  const values = { page: 1, limit: 10, sort: 'createdAt', order: 'desc' };
  for (const [field, value] of Object.entries(query)) {
    if (!Object.hasOwn(rules, field)) throw invalid(field, `Unknown query parameter: ${field}`);
    values[field] = rules[field](value);
  }
  return values;
}

export function readPage(query) {
  return parse(query, paginationRules);
}

export function readReviewQuery(query) {
  return parse(query, reviewQueryRules);
}

export function readProductQuery(query) {
  const values = parse(query, productQueryRules);
  if (values.minYear > values.maxYear) {
    throw invalid('minYear', 'minYear must be less than or equal to maxYear');
  }
  return values;
}

export function pageArguments({ page, limit, sort, order }) {
  const skip = (page - 1) * limit;
  return {
    skip: Math.min(skip, MAX_INT),
    take: skip > MAX_INT ? 0 : limit,
    orderBy: [{ [sort]: order }, { id: order }],
  };
}

export function pageResponse(data, total, { page, limit }) {
  return { data, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}
