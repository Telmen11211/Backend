export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export function notFound(req, res) {
  res.status(404).json({ message: "Route not found", path: req.originalUrl });
}
export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.type === "entity.parse.failed") return res.status(400).json({ message: "Invalid JSON" });
  if (error.type === "entity.too.large") return res.status(413).json({ message: "Request body too large" });
  if (error.code === "P2025") return res.status(404).json({ message: "Resource not found" });
  if (error.code === "P2002") return res.status(409).json({ message: "Email already exists" });
  if (error.code === "P2003") return res.status(400).json({ message: "Author not found" });
  if (error instanceof HttpError) return res.status(error.status).json({ message: error.message });
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
}
