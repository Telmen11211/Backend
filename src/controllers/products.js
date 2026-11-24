import { prisma } from '../db.js';
import { readPage, readProductQuery } from '../middleware/query.js';
import { invalid } from '../middleware/validate.js';
import { findPage, readSnapshot, requireRecord } from './records.js';

const productRelations = { category: true, brand: true };

function productFilters(query) {
  const where = { categoryId: query.categoryId, inStock: query.inStock };
  if (query.brandId !== undefined) where.brandId = query.brandId;
  if (query.hasBrand !== undefined) {
    where.AND = { brandId: query.hasBrand ? { not: null } : null };
  }
  if (query.minYear !== undefined || query.maxYear !== undefined) {
    where.releaseYear = { gte: query.minYear, lte: query.maxYear };
  }
  if (query.q !== undefined) {
    const pattern = query.q.replace(/[\\%_]/g, character => '\\' + character);
    const match = { contains: pattern, mode: 'insensitive' };
    where.OR = [{ name: match }, { description: match }];
  }
  return where;
}

export async function listProducts(req, res) {
  const query = readProductQuery(req.query);
  const where = productFilters(query);
  const result = await readSnapshot(async tx => {
    if (query.minRating !== undefined) {
      const matches = await tx.review.groupBy({
        by: ['productId'],
        where: { product: where },
        having: { rating: { _avg: { gte: query.minRating } } },
      });
      where.id = { in: matches.map(match => match.productId) };
    }
    return findPage(tx.product, query, { where, include: productRelations });
  });
  res.json(result);
}

async function listRelatedProducts(req, res, parent) {
  const query = readPage(req.query);
  const id = req.recordId;
  const result = await readSnapshot(async tx => {
    requireRecord(await tx[parent].findUnique({ where: { id }, select: { id: true } }), parent);
    const where = { [`${parent}Id`]: id };
    return findPage(tx.product, query, { where, include: productRelations });
  });
  res.json(result);
}

export const listCategoryProducts = (req, res) => listRelatedProducts(req, res, 'category');
export const listBrandProducts = (req, res) => listRelatedProducts(req, res, 'brand');

export async function getProduct(req, res) {
  const id = req.recordId;
  const result = await readSnapshot(async tx => {
    const product = requireRecord(await tx.product.findUnique({
      where: { id },
      include: { ...productRelations, _count: { select: { reviews: true } } },
    }), 'Product');
    const { _avg } = await tx.review.aggregate({
      where: { productId: id },
      _avg: { rating: true },
    });
    return { ...product, averageRating: _avg.rating };
  });
  res.json(result);
}

async function validateReferences(tx, { categoryId, brandId }) {
  if (categoryId !== undefined && !await tx.category.findUnique({ where: { id: categoryId }, select: { id: true } })) {
    throw invalid('categoryId', 'Category does not exist');
  }
  if (brandId != null && !await tx.brand.findUnique({ where: { id: brandId }, select: { id: true } })) {
    throw invalid('brandId', 'Brand does not exist');
  }
}

export async function createProduct(req, res) {
  const product = await prisma.$transaction(async tx => {
    await validateReferences(tx, req.data);
    return tx.product.create({ data: req.data, include: productRelations });
  });
  res.status(201).json(product);
}

export async function updateProduct(req, res) {
  const where = { id: req.recordId };
  const product = await prisma.$transaction(async tx => {
    requireRecord(await tx.product.findUnique({ where, select: { id: true } }), 'Product');
    await validateReferences(tx, req.data);
    return tx.product.update({ where, data: req.data, include: productRelations });
  });
  res.json(product);
}

export async function deleteProduct(req, res) {
  await prisma.product.delete({ where: { id: req.recordId } });
  res.status(204).end();
}
