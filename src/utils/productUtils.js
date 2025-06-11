import { generateId } from './helpers';
import { STOCK_STATUS, CONFIG, PLACEHOLDER_IMAGE } from './constants';

/**
 * Create a new product object with default values
 * @param {Object} productData - Product data from form
 * @returns {Object} Complete product object
 */
export const createProduct = (productData) => {
  const now = new Date().toISOString();
  
  return {
    id: generateId(),
    name: productData.name?.trim() || '',
    description: productData.description?.trim() || '',
    price: parseFloat(productData.price) || 0,
    category: productData.category || '',
    stock: parseInt(productData.stock) || 0,
    imageUrl: productData.imageUrl?.trim() || PLACEHOLDER_IMAGE,
    createdAt: now,
    updatedAt: now
  };
};

/**
 * Update an existing product
 * @param {Object} existingProduct - Current product data
 * @param {Object} updates - Updated product data
 * @returns {Object} Updated product object
 */
export const updateProduct = (existingProduct, updates) => {
  return {
    ...existingProduct,
    name: updates.name?.trim() || existingProduct.name,
    description: updates.description?.trim() || existingProduct.description,
    price: updates.price !== undefined ? parseFloat(updates.price) : existingProduct.price,
    category: updates.category || existingProduct.category,
    stock: updates.stock !== undefined ? parseInt(updates.stock) : existingProduct.stock,
    imageUrl: updates.imageUrl?.trim() || existingProduct.imageUrl,
    updatedAt: new Date().toISOString()
  };
};

/**
 * Get stock status based on stock quantity
 * @param {number} stock - Stock quantity
 * @returns {string} Stock status
 */
export const getStockStatus = (stock) => {
  if (stock === 0) {
    return STOCK_STATUS.OUT_OF_STOCK;
  } else if (stock <= CONFIG.LOW_STOCK_THRESHOLD) {
    return STOCK_STATUS.LOW_STOCK;
  } else {
    return STOCK_STATUS.IN_STOCK;
  }
};

/**
 * Filter products based on search criteria
 * @param {Array} products - Array of products
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered products
 */
export const filterProducts = (products, filters) => {
  if (!products || !Array.isArray(products)) {
    return [];
  }

  return products.filter(product => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(searchTerm);
      const descriptionMatch = product.description?.toLowerCase().includes(searchTerm) || false;
      if (!nameMatch && !descriptionMatch) {
        return false;
      }
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      if (product.category !== filters.category) {
        return false;
      }
    }

    // Price range filter
    if (filters.minPrice !== undefined && filters.minPrice !== '') {
      const minPrice = parseFloat(filters.minPrice);
      if (!isNaN(minPrice) && product.price < minPrice) {
        return false;
      }
    }

    if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
      const maxPrice = parseFloat(filters.maxPrice);
      if (!isNaN(maxPrice) && product.price > maxPrice) {
        return false;
      }
    }

    // Stock status filter
    if (filters.stockStatus && filters.stockStatus !== 'all') {
      const productStockStatus = getStockStatus(product.stock);
      if (productStockStatus !== filters.stockStatus) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Sort products based on sort criteria
 * @param {Array} products - Array of products
 * @param {string} sortBy - Sort criteria
 * @returns {Array} Sorted products
 */
export const sortProducts = (products, sortBy) => {
  if (!products || !Array.isArray(products)) {
    return [];
  }

  const sortedProducts = [...products];

  switch (sortBy) {
    case 'name_asc':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    
    case 'name_desc':
      return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    
    case 'price_asc':
      return sortedProducts.sort((a, b) => a.price - b.price);
    
    case 'price_desc':
      return sortedProducts.sort((a, b) => b.price - a.price);
    
    case 'stock_asc':
      return sortedProducts.sort((a, b) => a.stock - b.stock);
    
    case 'stock_desc':
      return sortedProducts.sort((a, b) => b.stock - a.stock);
    
    case 'category':
      return sortedProducts.sort((a, b) => {
        const categoryCompare = a.category.localeCompare(b.category);
        if (categoryCompare === 0) {
          return a.name.localeCompare(b.name);
        }
        return categoryCompare;
      });
    
    default:
      return sortedProducts;
  }
};

/**
 * Get product statistics
 * @param {Array} products - Array of products
 * @returns {Object} Product statistics
 */
export const getProductStats = (products) => {
  if (!products || !Array.isArray(products)) {
    return {
      total: 0,
      inStock: 0,
      outOfStock: 0,
      lowStock: 0,
      totalValue: 0,
      categories: {}
    };
  }

  const stats = {
    total: products.length,
    inStock: 0,
    outOfStock: 0,
    lowStock: 0,
    totalValue: 0,
    categories: {}
  };

  products.forEach(product => {
    // Stock status counts
    const stockStatus = getStockStatus(product.stock);
    switch (stockStatus) {
      case STOCK_STATUS.IN_STOCK:
        stats.inStock++;
        break;
      case STOCK_STATUS.OUT_OF_STOCK:
        stats.outOfStock++;
        break;
      case STOCK_STATUS.LOW_STOCK:
        stats.lowStock++;
        break;
    }

    // Total value calculation
    stats.totalValue += product.price * product.stock;

    // Category counts
    if (stats.categories[product.category]) {
      stats.categories[product.category]++;
    } else {
      stats.categories[product.category] = 1;
    }
  });

  // Round total value to 2 decimal places
  stats.totalValue = Math.round(stats.totalValue * 100) / 100;

  return stats;
};

/**
 * Validate product data before creation/update
 * @param {Object} productData - Product data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validateProductData = (productData) => {
  const errors = {};

  // Name validation
  if (!productData.name || productData.name.trim().length === 0) {
    errors.name = 'Product name is required';
  } else if (productData.name.trim().length < 3) {
    errors.name = 'Product name must be at least 3 characters';
  } else if (productData.name.trim().length > 50) {
    errors.name = 'Product name must not exceed 50 characters';
  }

  // Price validation
  const price = parseFloat(productData.price);
  if (isNaN(price) || price <= 0) {
    errors.price = 'Price must be a positive number';
  } else if (price > 999999.99) {
    errors.price = 'Price cannot exceed $999,999.99';
  }

  // Category validation
  if (!productData.category) {
    errors.category = 'Category is required';
  }

  // Stock validation
  const stock = parseInt(productData.stock);
  if (isNaN(stock) || stock < 0) {
    errors.stock = 'Stock must be a non-negative number';
  } else if (stock > 999999) {
    errors.stock = 'Stock cannot exceed 999,999';
  }

  // Description validation
  if (productData.description && productData.description.length > 200) {
    errors.description = 'Description must not exceed 200 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Search products by term
 * @param {Array} products - Array of products
 * @param {string} searchTerm - Search term
 * @returns {Array} Matching products
 */
export const searchProducts = (products, searchTerm) => {
  if (!searchTerm || searchTerm.trim().length === 0) {
    return products;
  }

  const term = searchTerm.toLowerCase().trim();
  
  return products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(term);
    const descriptionMatch = product.description?.toLowerCase().includes(term) || false;
    const categoryMatch = product.category.toLowerCase().includes(term);
    
    return nameMatch || descriptionMatch || categoryMatch;
  });
};

/**
 * Get products by category
 * @param {Array} products - Array of products
 * @param {string} category - Category to filter by
 * @returns {Array} Products in the specified category
 */
export const getProductsByCategory = (products, category) => {
  if (!category || category === 'all') {
    return products;
  }
  
  return products.filter(product => product.category === category);
};

/**
 * Get low stock products
 * @param {Array} products - Array of products
 * @returns {Array} Products with low stock
 */
export const getLowStockProducts = (products) => {
  return products.filter(product => 
    getStockStatus(product.stock) === STOCK_STATUS.LOW_STOCK
  );
};

/**
 * Get out of stock products
 * @param {Array} products - Array of products
 * @returns {Array} Products that are out of stock
 */
export const getOutOfStockProducts = (products) => {
  return products.filter(product => 
    getStockStatus(product.stock) === STOCK_STATUS.OUT_OF_STOCK
  );
};