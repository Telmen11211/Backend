import { prisma } from '../db.js';
import { readReviewQuery } from '../middleware/query.js';
import { findPage, readSnapshot, requireRecord } from './records.js';

async function requireProduct(tx, id) {
  return requireRecord(await tx.product.findUnique({ where: { id }, select: { id: true } }), 'Product');
}

export async function listReviews(req, res) {
  const query = readReviewQuery(req.query);
  const productId = req.recordId;
  const result = await readSnapshot(async tx => {
    await requireProduct(tx, productId);
    return findPage(tx.review, query, { where: { productId } });
  });
  res.json(result);
}

export async function createReview(req, res) {
  const review = await prisma.$transaction(async tx => {
    const productId = req.recordId;
    await requireProduct(tx, productId);
    return tx.review.create({ data: { ...req.data, productId } });
  });
  res.status(201).json(review);
}

export async function updateReview(req, res) {
  const review = await prisma.review.update({ where: { id: req.recordId }, data: req.data });
  res.json(review);
}

export async function deleteReview(req, res) {
  await prisma.review.delete({ where: { id: req.recordId } });
  res.status(204).end();
}
