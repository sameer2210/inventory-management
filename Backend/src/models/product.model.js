import { getPool } from '../db/db.js';

const normalizeStock = (stockAvailable) => (stockAvailable ? 1 : 0);

const fetchItemTypeByName = async (typeName) => {
  const db = getPool();
  const [rows] = await db.execute('SELECT id, type_name FROM item_types WHERE type_name = ?', [typeName]);
  return rows[0] || null;
};

const ensureItemType = async (typeName) => {
  const existingType = await fetchItemTypeByName(typeName);
  if (existingType) {
    return existingType.id;
  }

  const db = getPool();
  const [result] = await db.execute('INSERT INTO item_types (type_name) VALUES (?)', [typeName]);
  return result.insertId;
};

const mapJoinedRows = (rows) =>
  rows.map((row) => ({
    id: row.id,
    name: row.name,
    purchaseDate: row.purchase_date,
    stockAvailable: Boolean(row.stock_available),
    itemType: row.type_name,
    itemTypeId: row.item_type_id,
  }));

export const createItem = async ({ name, purchaseDate, stockAvailable, itemType }) => {
  const db = getPool();
  const itemTypeId = await ensureItemType(itemType);

  await db.execute(
    `INSERT INTO items (name, purchase_date, stock_available, item_type_id)
     VALUES (?, ?, ?, ?)`,
    [name, purchaseDate, normalizeStock(stockAvailable), itemTypeId],
  );
};

export const createItemsBulk = async (items) => {
  if (items.length === 0) return;

  const db = getPool();
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    for (const item of items) {
      let itemTypeId;
      const [typeRows] = await connection.execute('SELECT id FROM item_types WHERE type_name = ?', [
        item.itemType,
      ]);

      if (typeRows.length > 0) {
        itemTypeId = typeRows[0].id;
      } else {
        const [insertTypeResult] = await connection.execute(
          'INSERT INTO item_types (type_name) VALUES (?)',
          [item.itemType],
        );
        itemTypeId = insertTypeResult.insertId;
      }

      await connection.execute(
        `INSERT INTO items (name, purchase_date, stock_available, item_type_id)
         VALUES (?, ?, ?, ?)`,
        [item.name, item.purchaseDate, normalizeStock(item.stockAvailable), itemTypeId],
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getAllItemsWithType = async () => {
  const db = getPool();
  const [rows] = await db.execute(`
    SELECT i.id, i.name, i.purchase_date, i.stock_available, i.item_type_id, it.type_name
    FROM items i
    INNER JOIN item_types it ON i.item_type_id = it.id
    ORDER BY i.id DESC
  `);

  return mapJoinedRows(rows);
};

export const updateItemById = async (id, payload) => {
  const db = getPool();
  const fields = [];
  const values = [];

  if (payload.name !== undefined) {
    fields.push('name = ?');
    values.push(payload.name);
  }

  if (payload.purchaseDate !== undefined) {
    fields.push('purchase_date = ?');
    values.push(payload.purchaseDate);
  }

  if (payload.stockAvailable !== undefined) {
    fields.push('stock_available = ?');
    values.push(normalizeStock(payload.stockAvailable));
  }

  if (payload.itemType !== undefined) {
    const itemTypeId = await ensureItemType(payload.itemType);
    fields.push('item_type_id = ?');
    values.push(itemTypeId);
  }

  if (fields.length === 0) {
    return false;
  }

  values.push(id);

  const [result] = await db.execute(`UPDATE items SET ${fields.join(', ')} WHERE id = ?`, values);
  return result.affectedRows > 0;
};

export const deleteItemById = async (id) => {
  const db = getPool();
  const [result] = await db.execute('DELETE FROM items WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

export const getItemTypes = async () => {
  const db = getPool();
  const [rows] = await db.execute('SELECT id, type_name AS typeName FROM item_types ORDER BY type_name ASC');
  return rows;
};
