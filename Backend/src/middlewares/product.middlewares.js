const isValidDate = (value) => {
  if (!value) return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
};

const parseBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off', ''].includes(normalized)) return false;
  }
  return Boolean(value);
};

const normalizeItemPayload = (raw) => ({
  name: raw.name?.trim(),
  itemType: raw.itemType?.trim(),
  purchaseDate: raw.purchaseDate,
  stockAvailable: parseBoolean(raw.stockAvailable),
});

const validateSingleItem = (item) => {
  const errors = [];

  if (!item.name) errors.push('Item name is required.');
  if (!item.itemType) errors.push('Item type is required.');
  if (!item.purchaseDate) errors.push('Purchase date is required.');
  if (item.purchaseDate && !isValidDate(item.purchaseDate)) errors.push('Purchase date must be a valid date.');

  return errors;
};

export const validateCreateItems = (req, res, next) => {
  const hasBulkPayload = Array.isArray(req.body.items);
  const rawItems = hasBulkPayload ? req.body.items : [req.body];

  if (rawItems.length === 0) {
    return res.status(400).json({ message: 'At least one item is required.' });
  }

  const normalizedItems = rawItems.map(normalizeItemPayload);

  const errors = normalizedItems.flatMap((item, index) =>
    validateSingleItem(item).map((error) => `Item ${index + 1}: ${error}`),
  );

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed.', errors });
  }

  req.validatedItems = normalizedItems;
  return next();
};

export const validateUpdateItem = (req, res, next) => {
  const payload = req.body || {};
  const normalized = {};

  if (payload.name !== undefined) normalized.name = payload.name?.trim();
  if (payload.itemType !== undefined) normalized.itemType = payload.itemType?.trim();
  if (payload.purchaseDate !== undefined) normalized.purchaseDate = payload.purchaseDate;
  if (payload.stockAvailable !== undefined) normalized.stockAvailable = parseBoolean(payload.stockAvailable);

  if (Object.keys(normalized).length === 0) {
    return res.status(400).json({ message: 'At least one field must be provided for update.' });
  }

  const errors = [];
  if (normalized.name !== undefined && !normalized.name) errors.push('Item name cannot be empty.');
  if (normalized.itemType !== undefined && !normalized.itemType) errors.push('Item type cannot be empty.');
  if (normalized.purchaseDate !== undefined && !isValidDate(normalized.purchaseDate)) {
    errors.push('Purchase date must be a valid date.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed.', errors });
  }

  req.validatedUpdate = normalized;
  return next();
};
