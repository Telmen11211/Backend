import { Router } from "express";
import { usersController } from "../controllers/users.controller.js";
export function usersRouter(db) {
  const router = Router(), c = usersController(db);
  router.get("/", c.list);
  router.get("/:id", c.getOne);
  router.post("/", c.create);
  router.patch("/:id", c.update);
  router.delete("/:id", c.remove);
  return router;
}
