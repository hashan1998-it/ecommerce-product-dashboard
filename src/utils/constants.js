// Product Categories
export const PRODUCT_CATEGORIES = [
    'Electronics',
    'Clothing',
    'Books',
    'Home',
    'Sports',
    'Other'
  ];
  
  // Stock Status Types
  export const STOCK_STATUS = {
    IN_STOCK: 'in_stock',
    OUT_OF_STOCK: 'out_of_stock',
    LOW_STOCK: 'low_stock'
  };
  
  // Filter Types
  export const FILTER_TYPES = {
    SEARCH: 'search',
    CATEGORY: 'category',
    PRICE_RANGE: 'price_range',
    STOCK_STATUS: 'stock_status'
  };
  
  // Form Validation Constants
  export const VALIDATION_RULES = {
    PRODUCT_NAME: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 50
    },
    DESCRIPTION: {
      MAX_LENGTH: 200
    },
    PRICE: {
      MIN_VALUE: 0.01,
      DECIMAL_PLACES: 2
    },
    STOCK: {
      MIN_VALUE: 0
    }
  };
  
  // Application Configuration
  export const CONFIG = {
    SEARCH_DEBOUNCE_DELAY: 300,
    LOW_STOCK_THRESHOLD: 5,
    LOCALSTORAGE_KEY: 'ecommerce_products',
    LOCALSTORAGE_VERSION: '1.0'
  };
  
  // Placeholder Image URL
  export const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x200/e9ecef/6c757d?text=Product+Image';