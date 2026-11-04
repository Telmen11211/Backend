import { id, userData } from "../validation.js";
import { HttpError } from "../middlewares/error.js";
export function withoutPassword(user) {
  const { password, ...publicUser } = user;
  return publicUser;
}
export function usersController(db) {
  return {
    async list(req, res) { res.json((await db.user.findMany({ orderBy: { id: "asc" } })).map(withoutPassword)); },
    async getOne(req, res) {
      const user = await db.user.findUnique({ where: { id: id(req.params.id) } });
      if (!user) throw new HttpError(404, "User not found");
      res.json(withoutPassword(user));
    },
    async create(req, res) {
      res.status(201).json(withoutPassword(await db.user.create({ data: userData(req.body) })));
    },
    async update(req, res) {
      res.json(withoutPassword(await db.user.update({ where: { id: id(req.params.id) }, data: userData(req.body, true) })));
    },
    async remove(req, res) {
      await db.user.delete({ where: { id: id(req.params.id) } });
      res.status(204).end();
    }
  };
}
