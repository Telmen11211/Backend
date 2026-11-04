import { HttpError } from "../middlewares/error.js";

function resource(rows) {
  let nextId = Math.max(0, ...rows.map(row => row.id)) + 1;
  return {
    async findMany({ where = {} } = {}) {
      return rows.filter(row => !where.title || row.title.toLowerCase().includes(where.title.contains.toLowerCase()));
    },
    async findUnique({ where }) {
      return rows.find(row => row.id === where.id) ?? null;
    },
    async create({ data }) {
      if (data.email && rows.some(row => row.email === data.email)) throw new HttpError(409, "Email already exists");
      const row = { id: nextId++, isAvailable: true, ...data };
      rows.push(row);
      return row;
    },
    async update({ where, data }) {
      const row = rows.find(row => row.id === where.id);
      if (!row) throw new HttpError(404, "Record not found");
      if (data.email && rows.some(other => other.id !== row.id && other.email === data.email)) throw new HttpError(409, "Email already exists");
      Object.assign(row, data);
      return row;
    },
    async delete({ where }) {
      const index = rows.findIndex(row => row.id === where.id);
      if (index < 0) throw new HttpError(404, "Record not found");
      return rows.splice(index, 1)[0];
    }
  };
}

export const store = {
  book: resource([
    { id: 1, title: "Node", price: 45000, isAvailable: true },
    { id: 2, title: "Express", price: 52000, isAvailable: true },
    { id: 3, title: "Prisma", price: 61000, isAvailable: false }
  ]),
  user: resource([{ id: 1, name: "Bat", email: "bat@example.com", role: "USER" }])
};
