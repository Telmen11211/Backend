import { Router } from "express";
export const infoRouter = Router();
infoRouter.get("/", (req, res) => res.json({ message: "Library API", version: "1.0.0" }));
infoRouter.get("/health", (req, res) => res.json({ status: "ok", uptime: process.uptime() }));
infoRouter.get("/profile", (req, res) => res.json({ name: "Bat", role: "USER", email: "bat@example.com" }));
infoRouter.get("/about", (req, res) => res.json({ name: "Library API", version: "1.0.0", author: "Student" }));
infoRouter.get("/students", (req, res) => res.json([{ id: 1, name: "Bat" }, { id: 2, name: "Sarnai" }, { id: 3, name: "Dorj" }]));
infoRouter.get("/courses", (req, res) => res.json([{ id: 1, code: "BED411", name: "Backend Development" }, { id: 2, code: "JS101", name: "JavaScript Basics" }]));
