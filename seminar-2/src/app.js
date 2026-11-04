import express from "express";
import { getBooksFromDb, searchByTitle, getBookOrThrow } from "./books.js";
import { users, findUserById, withoutPassword } from "./users.js";

const app = express();
const PORT = Number(process.env.PORT || 3000);

// Семинарын үндсэн 4 endpoint.
app.get("/", (req, res) => {
  res.json({
    message: "Library API",
    version: "1.0.0"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime()
  });
});

app.get("/profile", (req, res) => {
  res.json({
    name: "Bat",
    role: "USER",
    email: "bat@example.com"
  });
});

app.get("/books", async (req, res) => {
  const allBooks = await getBooksFromDb();
  const q = req.query.q;
  if (q !== undefined && typeof q !== "string") {
    return res.status(400).json({ message: "q must be a string" });
  }
  res.json(q ? searchByTitle(q) : allBooks);
});

app.get("/books/:id", (req, res) => {
  try {
    const book = getBookOrThrow(Number(req.params.id));
    res.json(book);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.get("/users", (req, res) => {
  res.json(users.map(withoutPassword));
});

app.get("/users/:id", (req, res) => {
  const user = findUserById(Number(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(withoutPassword(user));
});

// Гэрийн даалгавар: 3 GET endpoint.
app.get("/about", (req, res) => {
  res.status(200).json({
    name: "library-api-js",
    version: "1.0.0",
    author: "Student"
  });
});

app.get("/students", (req, res) => {
  res.status(200).json([
    { id: 1, name: "Bat" },
    { id: 2, name: "Sarnai" },
    { id: 3, name: "Dorj" }
  ]);
});

app.get("/courses", (req, res) => {
  res.status(200).json([
    { id: 1, code: "BED411", name: "Backend Development" },
    { id: 2, code: "JS101", name: "JavaScript Basics" }
  ]);
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
