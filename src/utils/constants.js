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

// Placeholder Image URL - Using data URI instead of external service
export const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTllY2VmIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTZweCIgZmlsbD0iIzZjNzU3ZCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Qcm9kdWN0IEltYWdlPC90ZXh0Pgo8L3N2Zz4K';

// Fallback image for error cases
export const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZjlmYSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjEwcHgiIGZpbGw9IiM2Yzc1N2QiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=';

// Product Action Types (for useReducer)
export const PRODUCT_ACTIONS = {
  SET_PRODUCTS: 'SET_PRODUCTS',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Stock Status Labels
export const STOCK_STATUS_LABELS = {
  [STOCK_STATUS.IN_STOCK]: 'In Stock',
  [STOCK_STATUS.OUT_OF_STOCK]: 'Out of Stock',
  [STOCK_STATUS.LOW_STOCK]: 'Low Stock'
};

// Stock Status Colors
export const STOCK_STATUS_COLORS = {
  [STOCK_STATUS.IN_STOCK]: '#28a745',
  [STOCK_STATUS.OUT_OF_STOCK]: '#dc3545',
  [STOCK_STATUS.LOW_STOCK]: '#ffc107'
};

// Sort Options
export const SORT_OPTIONS = {
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  STOCK_ASC: 'stock_asc',
  STOCK_DESC: 'stock_desc',
  CATEGORY: 'category'
};

// Sort Option Labels
export const SORT_OPTION_LABELS = {
  [SORT_OPTIONS.NAME_ASC]: 'Name (A-Z)',
  [SORT_OPTIONS.NAME_DESC]: 'Name (Z-A)',
  [SORT_OPTIONS.PRICE_ASC]: 'Price (Low to High)',
  [SORT_OPTIONS.PRICE_DESC]: 'Price (High to Low)',
  [SORT_OPTIONS.STOCK_ASC]: 'Stock (Low to High)',
  [SORT_OPTIONS.STOCK_DESC]: 'Stock (High to Low)',
  [SORT_OPTIONS.CATEGORY]: 'Category'
};

// Category-specific placeholder images using data URIs
export const CATEGORY_PLACEHOLDER_IMAGES = {
  Electronics: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtc2l6ZT0iMjBweCIgZmlsbD0iI2ZmZmZmZiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5OXPC90ZXh0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNjUlIiBmb250LXNpemU9IjE0cHgiIGZpbGw9IiNmZmZmZmYiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RWxlY3Ryb25pY3M8L3RleHQ+Cjwvc3ZnPgo=',
  Clothing: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDI4NWY0Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtc2l6ZT0iMjBweCIgZmlsbD0iI2ZmZmZmZiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn45CPC90ZXh0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNjUlIiBmb250LXNpemU9IjE0cHgiIGZpbGw9IiNmZmZmZmYiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q2xvdGhpbmc8L3RleHQ+Cjwvc3ZnPgo=',
  Books: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOGU0NGFkIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtc2l6ZT0iMjBweCIgZmlsbD0iI2ZmZmZmZiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5OaPC90ZXh0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNjUlIiBmb250LXNpemU9IjE0cHgiIGZpbGw9IiNmZmZmZmYiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Qm9va3M8L3RleHQ+Cjwvc3ZnPgo=',
  Home: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTc0YzNjIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtc2l6ZT0iMjBweCIgZmlsbD0iI2ZmZmZmZiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn4+gPC90ZXh0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNjUlIiBmb250LXNpemU9IjE0cHgiIGZpbGw9IiNmZmZmZmYiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SG9tZTwvdGV4dD4KPC9zdmc+Cg==',
  Sports: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY2YjM1Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtc2l6ZT0iMjBweCIgZmlsbD0iI2ZmZmZmZiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7imL08L3RleHQ+CiAgPHRleHQgeD0iNTAlIiB5PSI2NSUiIGZvbnQtc2l6ZT0iMTRweCIgZmlsbD0iI2ZmZmZmZiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TcG9ydHM8L3RleHQ+Cjwvc3ZnPgo=',
  Other: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOTVhNWE2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtc2l6ZT0iMjBweCIgZmlsbD0iI2ZmZmZmZiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7inJM8L3RleHQ+CiAgPHRleHQgeD0iNTAlIiB5PSI2NSUiIGZvbnQtc2l6ZT0iMTRweCIgZmlsbD0iI2ZmZmZmZiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5PdGhlcjwvdGV4dD4KPC9zdmc+Cg=='
};