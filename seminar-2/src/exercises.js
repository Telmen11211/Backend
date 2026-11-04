import { books, countAvailable } from "./books.js";

export function sum(a, b) { return a + b; }
export function isExpensive(book) { return book.price > 50000; }
export function getTitles(list) { return list.map((book) => book.title); }
export const formatPrice = (price) => `${price}₮`;

const book = { id: 1, title: "Node.js Basics", author: "Bat", price: 45000, isAvailable: true };
console.log(book.title, book["title"], book.isbn);
book.price = 50000;
console.log("Updated price:", book.price);
console.log("Titles:", getTitles(books));
console.log("Labels:", books.map((b) => `${b.title} — ${b.price}`));
console.log("Count:", books.length);
console.log("Cheap:", books.filter((b) => b.price < 50000));
console.log("Available:", books.filter((b) => b.isAvailable));
console.log("Book 3:", books.find((b) => b.id === 3) ?? "not found");
console.log("sum:", sum(2, 3));
console.log("isExpensive:", isExpensive(books[1]));
console.log("countAvailable:", countAvailable(books));
console.log("formatPrice:", formatPrice(45000));
