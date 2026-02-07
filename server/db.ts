import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "@shared/schema";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'database.sqlite');

let db: ReturnType<typeof drizzle> | null = null;

try {
  const sqlite = new Database(dbPath);
  sqlite.pragma('foreign_keys = ON');
  db = drizzle(sqlite, { schema });
  console.log('SQLite database connected at', dbPath);
} catch (error) {
  console.log('SQLite database not initialized (using in-memory storage)');
}

export { db };
