// lib/init.ts
import { initDb } from "./db";

let dbInitialized = false;

export async function ensureDb() {
  if (!dbInitialized) {
    await initDb();
    dbInitialized = true;
    console.log("✅ Base de datos inicializada");
  }
}
