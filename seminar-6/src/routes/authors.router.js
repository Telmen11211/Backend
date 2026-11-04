import { Router } from "express";
import { authorsController } from "../controllers/authors.controller.js";
export function authorsRouter(db) {
  const router = Router(), c = authorsController(db);
  router.get("/", c.list);
  router.get("/:id/books", c.getBooks);
  router.post("/:id/books", c.createBook);
  router.get("/:id", c.getOne);
  router.post("/", c.create);
  router.delete("/:id", c.remove);
  return router;
}
