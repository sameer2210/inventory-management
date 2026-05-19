import mysql from 'mysql2/promise';

let pool;

const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

const assertEnv = () => {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required env variables: ${missing.join(', ')}`);
  }
};

const createPool = () =>
  mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

export const getPool = () => {
  if (!pool) {
    throw new Error('Database pool has not been initialized.');
  }
  return pool;
};

const createTables = async () => {
  const db = getPool();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS item_types (
      id INT AUTO_INCREMENT PRIMARY KEY,
      type_name VARCHAR(100) NOT NULL UNIQUE
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      purchase_date DATE NOT NULL,
      stock_available BOOLEAN NOT NULL DEFAULT FALSE,
      item_type_id INT NOT NULL,
      FOREIGN KEY (item_type_id) REFERENCES item_types(id) ON DELETE RESTRICT ON UPDATE CASCADE
    )
  `);
};

const seedItemTypes = async () => {
  const defaults = ['Electronics', 'Furniture', 'Clothing', 'Kitchen', 'Stationery'];
  const db = getPool();

  for (const typeName of defaults) {
    await db.execute(
      'INSERT INTO item_types (type_name) VALUES (?) ON DUPLICATE KEY UPDATE type_name = VALUES(type_name)',
      [typeName],
    );
  }
};

export const initializeDatabase = async () => {
  assertEnv();
  pool = createPool();

  const conn = await pool.getConnection();
  conn.release();

  await createTables();
  await seedItemTypes();

  console.log('MySQL database connected and ready.');
};
