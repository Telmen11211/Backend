import { id, bookData } from "../validation.js";
import { HttpError } from "../middlewares/error.js";
export function booksController(db) {
  return {
    async list(req, res) {
      const q = req.query.q;
      if (q !== undefined && typeof q !== "string") throw new HttpError(400, "q must be a string");
      const data = await db.book.findMany({
        where: q ? { title: { contains: q, mode: "insensitive" } } : {},
        include: { author: true }, orderBy: { id: "asc" }
      });
      res.json({ count: data.length, data });
    },
    async getOne(req, res) {
      const book = await db.book.findUnique({ where: { id: id(req.params.id) }, include: { author: true } });
      if (!book) throw new HttpError(404, "Book not found");
      res.json(book);
    },
    async create(req, res) {
      const book = await db.book.create({ data: bookData(req.body), include: { author: true } });
      res.status(201).json(book);
    },
    async update(req, res) {
      const book = await db.book.update({ where: { id: id(req.params.id) }, data: bookData(req.body, true), include: { author: true } });
      res.json(book);
    },
    async remove(req, res) {
      await db.book.delete({ where: { id: id(req.params.id) } });
      res.status(204).end();
    }
  };
}
