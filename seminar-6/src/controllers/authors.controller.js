import { id, input, text, email, bookData } from "../validation.js";
import { HttpError } from "../middlewares/error.js";
export function authorsController(db) {
  return {
    async list(req, res) {
      res.json(await db.author.findMany({ include: { _count: { select: { books: true } } }, orderBy: { id: "asc" } }));
    },
    async getOne(req, res) {
      const author = await db.author.findUnique({ where: { id: id(req.params.id) }, include: { books: true } });
      if (!author) throw new HttpError(404, "Author not found");
      res.json(author);
    },
    async create(req, res) {
      const b = input(req.body);
      res.status(201).json(await db.author.create({ data: { name: text(b.name, "name"), email: email(b.email) } }));
    },
    async getBooks(req, res) {
      const author = await db.author.findUnique({ where: { id: id(req.params.id) }, include: { books: true } });
      if (!author) throw new HttpError(404, "Author not found");
      res.json(author.books);
    },
    async createBook(req, res) {
      const authorId = id(req.params.id);
      if (!await db.author.findUnique({ where: { id: authorId } })) throw new HttpError(404, "Author not found");
      const data = bookData({ ...input(req.body), authorId });
      res.status(201).json(await db.book.create({ data, include: { author: true } }));
    },
    async remove(req, res) {
      try {
        await db.author.delete({ where: { id: id(req.params.id) } });
      } catch (error) {
        if (error.code === "P2003") throw new HttpError(409, "Author has books");
        throw error;
      }
      res.status(204).end();
    }
  };
}
