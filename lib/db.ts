import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from 'fs';

const DB_PATH = "pedidos.db";

export async function initDb() {
  const exists = fs.existsSync(DB_PATH);

  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  if (!exists) {
    // Solo crear la tabla si la DB no existía
    await db.exec(`
      CREATE TABLE pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        cancion TEXT,
        dedicatoria TEXT,
        artista TEXT,
        fecha_hora TEXT
      )
    `);
  }


  return db;
}

export async function getDb() {
  return open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });
}
