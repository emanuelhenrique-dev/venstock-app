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
      min_stock INTEGER NOT NULL DEFAULT 0,
      barcode TEXT,
      identifier TEXT,
      color TEXT NOT NULL,            
      image_url TEXT,
      category_id INTEGER NOT NULL,

      created_at TEXT DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK(type IN ('sale', 'withdrawal')),
      category TEXT NOT NULL CHECK(category IN ('money', 'pix', 'avaria', 'vencimento', 'consumo')),
      description TEXT,
      fee_value REAL NOT NULL DEFAULT 0.0,
      total_value REAL NOT NULL,
      user_name TEXT NOT NULL,

      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS transaction_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,

      FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
    );

  `);

  const productColumns = await database.getAllAsync<{ name: string }>(
    `PRAGMA table_info(products)`
  );

  if (!productColumns.some((column) => column.name === 'identifier')) {
    await database.execAsync(`ALTER TABLE products ADD COLUMN identifier TEXT`);
  }
}
