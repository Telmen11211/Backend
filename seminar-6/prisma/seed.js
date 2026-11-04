import { prisma } from "../src/db.js";
try {
  await prisma.$transaction(async (db) => {
    const bat = await db.author.upsert({ where: { email: "bat@mail.mn" }, update: {}, create: { name: "Бат", email: "bat@mail.mn" } });
    const saraa = await db.author.upsert({ where: { email: "saraa@mail.mn" }, update: {}, create: { name: "Сараа", email: "saraa@mail.mn" } });
    for (const data of [
      { title: "Node.js Basics", price: 45000, authorId: bat.id },
      { title: "Express in Action", price: 52000, authorId: bat.id },
      { title: "SQL for Kids", price: 30000, authorId: saraa.id }
    ]) {
      if (!await db.book.findFirst({ where: { title: data.title, authorId: data.authorId } })) await db.book.create({ data });
    }
    for (const [name, email, role] of [["Bat", "bat@example.com", "ADMIN"], ["Sarnai", "sarnai@example.com", "USER"], ["Dorj", "dorj@example.com", "USER"], ["Tuya", "tuya@example.com", "ADMIN"]]) {
      await db.user.upsert({ where: { email }, update: {}, create: { name, email, role } });
    }
  });
  console.log("Seed ready: 2 authors, 3 sample books, 4 users (existing data kept).");
} finally { await prisma.$disconnect(); }
