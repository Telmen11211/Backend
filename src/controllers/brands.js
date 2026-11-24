import { prisma } from '../db.js';
import { readPage } from '../middleware/query.js';
import { findPage, readSnapshot, requireRecord } from './records.js';

export async function listBrands(req, res) {
  const query = readPage(req.query);
  res.json(await readSnapshot(tx => findPage(tx.brand, query)));
}

export async function getBrand(req, res) {
  const brand = await prisma.brand.findUnique({
    where: { id: req.recordId },
    include: { _count: { select: { products: true } } },
  });
  res.json(requireRecord(brand, 'Brand'));
}

export async function createBrand(req, res) {
  const brand = await prisma.brand.create({ data: req.data });
  res.status(201).json(brand);
}

export async function updateBrand(req, res) {
  const brand = await prisma.brand.update({ where: { id: req.recordId }, data: req.data });
  res.json(brand);
}

export async function deleteBrand(req, res) {
  await prisma.brand.delete({ where: { id: req.recordId } });
  res.status(204).end();
}
