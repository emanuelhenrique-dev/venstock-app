import { type SQLiteDatabase } from 'expo-sqlite';

export async function migrate(database: SQLiteDatabase) {
  await database.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      image_url TEXT,
      
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      color TEXT NOT NULL,            
      image_url TEXT,
      category_id INTEGER NOT NULL,

      created_at TEXT DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
    );



  `);
}
