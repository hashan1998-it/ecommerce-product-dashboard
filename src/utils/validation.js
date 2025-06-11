import { VALIDATION_RULES } from './constants';

/**
 * Validate product name
 * @param {string} name - Product name to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateProductName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'Product name is required';
  }
  
  if (name.trim().length < VALIDATION_RULES.PRODUCT_NAME.MIN_LENGTH) {
    return `Product name must be at least ${VALIDATION_RULES.PRODUCT_NAME.MIN_LENGTH} characters`;
  }
  
  if (name.trim().length > VALIDATION_RULES.PRODUCT_NAME.MAX_LENGTH) {
    return `Product name must not exceed ${VALIDATION_RULES.PRODUCT_NAME.MAX_LENGTH} characters`;
  }
  
  return null;
};

/**
 * Validate product price
 * @param {number|string} price - Price to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePrice = (price) => {
  const numPrice = parseFloat(price);
  
  if (isNaN(numPrice)) {
    return 'Price must be a valid number';
  }
  
  if (numPrice < VALIDATION_RULES.PRICE.MIN_VALUE) {
    return 'Price must be greater than 0';
  }
  
  // Check decimal places
  const decimalPlaces = (price.toString().split('.')[1] || '').length;
  if (decimalPlaces > VALIDATION_RULES.PRICE.DECIMAL_PLACES) {
    return `Price can have maximum ${VALIDATION_RULES.PRICE.DECIMAL_PLACES} decimal places`;
  }
  
  return null;
};

/**
 * Validate stock quantity
 * @param {number|string} stock - Stock to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateStock = (stock) => {
  const numStock = parseInt(stock);
  
  if (isNaN(numStock)) {
    return 'Stock must be a valid number';
  }
  
  if (numStock < VALIDATION_RULES.STOCK.MIN_VALUE) {
    return 'Stock cannot be negative';
  }
  
  if (!Number.isInteger(numStock)) {
    return 'Stock must be a whole number';
  }
  
  return null;
};

/**
 * Validate description
 * @param {string} description - Description to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateDescription = (description) => {
  if (description && description.length > VALIDATION_RULES.DESCRIPTION.MAX_LENGTH) {
    return `Description must not exceed ${VALIDATION_RULES.DESCRIPTION.MAX_LENGTH} characters`;
  }
  
  return null;
};

/**
 * Validate entire product object
 * @param {Object} product - Product object to validate
 * @returns {Object} Object with field errors
 */
export const validateProduct = (product) => {
  const errors = {};
  
  const nameError = validateProductName(product.name);
  if (nameError) errors.name = nameError;
  
  const priceError = validatePrice(product.price);
  if (priceError) errors.price = priceError;
  
  const stockError = validateStock(product.stock);
  if (stockError) errors.stock = stockError;
  
  const descriptionError = validateDescription(product.description);
  if (descriptionError) errors.description = descriptionError;
  
  if (!product.category) {
    errors.category = 'Category is required';
  }
  
  return errors;
};