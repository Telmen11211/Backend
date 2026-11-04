import express from "express";
import { booksRouter } from "./routes/books.router.js";
import { usersRouter } from "./routes/users.router.js";
import { authorsRouter } from "./routes/authors.router.js";
import { infoRouter } from "./routes/info.router.js";
import { logger } from "./middlewares/logger.js";
import { notFound, errorHandler } from "./middlewares/error.js";

export function createApp(db) {
  const app = express();
  app.use(logger);
  app.use(express.json());
  app.use(infoRouter);
  app.use("/books", booksRouter(db));
  app.use("/users", usersRouter(db));
  app.use("/authors", authorsRouter(db));
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
