import { prisma } from '../db.js';
import { readPage } from '../middleware/query.js';
import { findPage, readSnapshot, requireRecord } from './records.js';

export async function listCategories(req, res) {
  const query = readPage(req.query);
  res.json(await readSnapshot(tx => findPage(tx.category, query)));
}

export async function getCategory(req, res) {
  const category = await prisma.category.findUnique({
    where: { id: req.recordId },
    include: { _count: { select: { products: true } } },
  });
  res.json(requireRecord(category, 'Category'));
}

export async function createCategory(req, res) {
  const category = await prisma.category.create({ data: req.data });
  res.status(201).json(category);
}

export async function updateCategory(req, res) {
  const category = await prisma.category.update({ where: { id: req.recordId }, data: req.data });
  res.json(category);
}

export async function deleteCategory(req, res) {
  await prisma.category.delete({ where: { id: req.recordId } });
  res.status(204).end();
}
