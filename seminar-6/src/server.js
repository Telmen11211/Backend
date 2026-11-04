import "dotenv/config";
import { createApp } from "./app.js";
import { prisma } from "./db.js";
const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PORT");
try {
  await prisma.$connect();
  const server = createApp(prisma).listen(port, () => console.log(`http://localhost:${port}`));
  server.on("error", async (error) => { console.error(error.message); await prisma.$disconnect(); process.exit(1); });
  for (const signal of ["SIGINT", "SIGTERM"]) process.once(signal, () => {
    server.close(async () => { await prisma.$disconnect(); process.exit(0); });
  });
} catch (error) {
  console.error("Database connection failed. Check DATABASE_URL and PostgreSQL.");
  await prisma.$disconnect();
  process.exitCode = 1;
}
