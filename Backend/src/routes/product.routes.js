import { Router } from 'express';
import {
  createItems,
  deleteItem,
  getItems,
  listItemTypes,
  updateItem,
} from '../controllers/product.controller.js';
import { validateCreateItems, validateUpdateItem } from '../middlewares/product.middlewares.js';

const router = Router();

router.get('/item-types', listItemTypes);
router.get('/items', getItems);
router.post('/items', validateCreateItems, createItems);
router.put('/items/:id', validateUpdateItem, updateItem);
router.delete('/items/:id', deleteItem);

export default router;
