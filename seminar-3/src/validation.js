import { HttpError } from "./middlewares/error.js";
export function id(value) {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value) || Number(value) > 2147483647) throw new HttpError(400, "id must be a positive integer");
  return Number(value);
}
export function input(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new HttpError(400, "JSON object is required");
  return body;
}
export function text(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new HttpError(400, `${field} is required`);
  return value.trim();
}
export function integer(value, field, min = 0) {
  if (!Number.isInteger(value) || value < min || value > 2147483647) throw new HttpError(400, `${field} must be an integer >= ${min}`);
  return value;
}
export function email(value) {
  const result = text(value, "email").toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) throw new HttpError(400, "Invalid email");
  return result;
}
export function bookData(body, partial = false) {
  const b = input(body), data = {};
  if (!partial || "title" in b) data.title = text(b.title, "title");
  if (!partial || "price" in b) data.price = integer(b.price ?? 0, "price");
  if ("isAvailable" in b) {
    if (typeof b.isAvailable !== "boolean") throw new HttpError(400, "isAvailable must be a boolean");
    data.isAvailable = b.isAvailable;
  }
  if (!Object.keys(data).length) throw new HttpError(400, "No supported fields to update");
  return data;
}
export function userData(body, partial = false) {
  const b = input(body), data = {};
  if (!partial || "name" in b) data.name = text(b.name, "name");
  if (!partial || "email" in b) data.email = email(b.email);
  if ("role" in b) {
    if (!["USER", "ADMIN"].includes(b.role)) throw new HttpError(400, "role must be USER or ADMIN");
    data.role = b.role;
  }
  if (!Object.keys(data).length) throw new HttpError(400, "No supported fields to update");
  return data;
}
