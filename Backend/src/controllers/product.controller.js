import {
  createItem,
  createItemsBulk,
  deleteItemById,
  getAllItemsWithType,
  getItemTypes,
  updateItemById,
} from '../models/product.model.js';

export const createItems = async (req, res, next) => {
  try {
    const items = req.validatedItems;

    if (items.length === 1) {
      await createItem(items[0]);
    } else {
      await createItemsBulk(items);
    }

    return res.status(201).json({
      message: items.length === 1 ? 'Item created successfully.' : `${items.length} items created successfully.`,
    });
  } catch (error) {
    return next(error);
  }
};

export const getItems = async (_req, res, next) => {
  try {
    const items = await getAllItemsWithType();
    return res.status(200).json({ items });
  } catch (error) {
    return next(error);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid item id.' });
    }

    const updated = await updateItemById(id, req.validatedUpdate);
    if (!updated) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    return res.status(200).json({ message: 'Item updated successfully.' });
  } catch (error) {
    return next(error);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'Invalid item id.' });
    }

    const deleted = await deleteItemById(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    return res.status(200).json({ message: 'Item deleted successfully.' });
  } catch (error) {
    return next(error);
  }
};

export const listItemTypes = async (_req, res, next) => {
  try {
    const itemTypes = await getItemTypes();
    return res.status(200).json({ itemTypes });
  } catch (error) {
    return next(error);
  }
};
