// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // Evita que en desarrollo se creen múltiples instancias de PrismaClient
  // y te lance warning sobre demasiadas conexiones
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
