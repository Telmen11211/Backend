import { Router } from "express";
import { booksController } from "../controllers/books.controller.js";
export function booksRouter(db) {
  const router = Router(), c = booksController(db);
  router.get("/", c.list);
  router.get("/search", c.list);
  router.get("/:id", c.getOne);
  router.post("/", c.create);
  router.patch("/:id", c.update);
  router.delete("/:id", c.remove);
  return router;
}
