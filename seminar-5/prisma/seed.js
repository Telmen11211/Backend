import { prisma } from "../src/db.js";
try {
  await prisma.book.upsert({ where: { id: 1 }, update: {}, create: { title: "Node.js Basics", price: 45000 } });
} finally { await prisma.$disconnect(); }
