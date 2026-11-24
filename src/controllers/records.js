import { prisma } from '../db.js';
import { HttpError } from '../middleware/errors.js';
import { pageArguments, pageResponse } from '../middleware/query.js';

export function requireRecord(record, label) {
  if (!record) throw new HttpError(404, `${label} not found`);
  return record;
}

export function readSnapshot(work) {
  return prisma.$transaction(work, { isolationLevel: 'RepeatableRead' });
}

export async function findPage(model, query, { where, include } = {}) {
  const [data, total] = await Promise.all([
    model.findMany({ ...pageArguments(query), where, include }),
    model.count({ where }),
  ]);
  return pageResponse(data, total, query);
}
