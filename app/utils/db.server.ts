import { PrismaClient } from "@prisma/client";

const db: PrismaClient = (() => {
  if (process.env.NODE_ENV === "production") {
    return new PrismaClient();
  } else {
    if (!globalThis.__db) {
      globalThis.__db = new PrismaClient();
    }
    return globalThis.__db;
  }
})();

declare global {
  var __db: PrismaClient | undefined;
}

export { db };
