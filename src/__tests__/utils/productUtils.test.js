/* eslint-disable no-undef */
import {
  createProduct,
  updateProduct,
  getStockStatus,
  filterProducts,
  sortProducts,
  getProductStats,
  validateProductData,
  searchProducts
} from '../../utils/productUtils';
import { STOCK_STATUS } from '../../utils/constants';

// Mock the generateId function
vi.mock('../../utils/helpers', () => ({
  ...vi.importActual('../../utils/helpers'),
  generateId: vi.fn(() => 'mock-id-123'),
}));

describe('productUtils', () => {
  const mockProductData = {
    name: 'Test Product',
    description: 'Test description',
    price: 99.99,
    category: 'Electronics',
    stock: 10,
    imageUrl: 'https://example.com/image.jpg'
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createProduct', () => {
    it('should create a product with all required fields', () => {
      const product = createProduct(mockProductData);
      
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('createdAt');
      expect(product).toHaveProperty('updatedAt');
      expect(product.name).toBe(mockProductData.name);
      expect(product.price).toBe(mockProductData.price);
      expect(product.category).toBe(mockProductData.category);
      expect(product.stock).toBe(mockProductData.stock);
    });

    it('should handle missing optional fields', () => {
      const minimalData = {
        name: 'Minimal Product',
        price: 50,
        category: 'Books',
        stock: 5
      };
      
      const product = createProduct(minimalData);
      expect(product.description).toBe('');
      expect(product.imageUrl).toBeDefined();
    });

    it('should trim whitespace from string fields', () => {
      const dataWithWhitespace = {
        ...mockProductData,
        name: '  Test Product  ',
        description: '  Test description  '
      };
      
      const product = createProduct(dataWithWhitespace);
      expect(product.name).toBe('Test Product');
      expect(product.description).toBe('Test description');
    });
  });

  describe('updateProduct', () => {
    it('should update existing product with new data', () => {
      // Create initial product
      const existingProduct = createProduct(mockProductData);
      
      // Mock Date to return a different timestamp for the update
      const mockDate = new Date('2023-01-02T00:00:00.000Z');
      vi.spyOn(global, 'Date').mockImplementation(() => mockDate);
      vi.spyOn(mockDate, 'toISOString').mockReturnValue('2023-01-02T00:00:00.000Z');
      
      const updates = {
        name: 'Updated Product',
        price: 149.99
      };
      
      const updatedProduct = updateProduct(existingProduct, updates);
      
      expect(updatedProduct.name).toBe(updates.name);
      expect(updatedProduct.price).toBe(updates.price);
      expect(updatedProduct.category).toBe(existingProduct.category);
      expect(updatedProduct.id).toBe(existingProduct.id);
      expect(updatedProduct.updatedAt).not.toBe(existingProduct.updatedAt);
      expect(updatedProduct.updatedAt).toBe('2023-01-02T00:00:00.000Z');
    });

    it('should preserve existing values when updates are undefined', () => {
      const existingProduct = createProduct(mockProductData);
      const updates = {
        name: 'Updated Product'
        // price intentionally omitted
      };
      
      const updatedProduct = updateProduct(existingProduct, updates);
      expect(updatedProduct.price).toBe(existingProduct.price);
    });
  });

  describe('getStockStatus', () => {
    it('should return OUT_OF_STOCK for zero stock', () => {
      expect(getStockStatus(0)).toBe(STOCK_STATUS.OUT_OF_STOCK);
    });

    it('should return LOW_STOCK for stock <= 5', () => {
      expect(getStockStatus(3)).toBe(STOCK_STATUS.LOW_STOCK);
      expect(getStockStatus(5)).toBe(STOCK_STATUS.LOW_STOCK);
    });

    it('should return IN_STOCK for stock > 5', () => {
      expect(getStockStatus(10)).toBe(STOCK_STATUS.IN_STOCK);
      expect(getStockStatus(100)).toBe(STOCK_STATUS.IN_STOCK);
    });
  });

  describe('filterProducts', () => {
    const products = [
      createProduct({ ...mockProductData, name: 'iPhone 14', category: 'Electronics', price: 999 }),
      createProduct({ ...mockProductData, name: 'JavaScript Book', category: 'Books', price: 20 }),
      createProduct({ ...mockProductData, name: 'Cotton Shirt', category: 'Clothing', price: 50 })
    ];

    it('should return empty array for invalid input', () => {
      expect(filterProducts(null, {})).toEqual([]);
      expect(filterProducts(undefined, {})).toEqual([]);
      expect(filterProducts('not-array', {})).toEqual([]);
    });

    it('should filter by search term', () => {
      const filtered = filterProducts(products, { search: 'iPhone' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('iPhone 14');
    });

    it('should filter by category', () => {
      const filtered = filterProducts(products, { category: 'Books' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].category).toBe('Books');
    });

    it('should combine multiple filters', () => {
      const filtered = filterProducts(products, { 
        category: 'Electronics', 
        minPrice: 500 
      });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('iPhone 14');
    });
  });

  describe('sortProducts', () => {
    const products = [
      createProduct({ ...mockProductData, name: 'Zebra Product', price: 100, stock: 5 }),
      createProduct({ ...mockProductData, name: 'Alpha Product', price: 50, stock: 15 }),
      createProduct({ ...mockProductData, name: 'Beta Product', price: 200, stock: 2 })
    ];

    it('should return empty array for invalid input', () => {
      expect(sortProducts(null, 'name_asc')).toEqual([]);
      expect(sortProducts(undefined, 'name_asc')).toEqual([]);
    });

    it('should sort by name ascending', () => {
      const sorted = sortProducts(products, 'name_asc');
      expect(sorted[0].name).toBe('Alpha Product');
      expect(sorted[2].name).toBe('Zebra Product');
    });

    it('should sort by price ascending', () => {
      const sorted = sortProducts(products, 'price_asc');
      expect(sorted[0].price).toBe(50);
      expect(sorted[2].price).toBe(200);
    });
  });

  describe('getProductStats', () => {
    it('should return default stats for invalid input', () => {
      const stats = getProductStats(null);
      expect(stats.total).toBe(0);
      expect(stats.inStock).toBe(0);
      expect(stats.outOfStock).toBe(0);
      expect(stats.lowStock).toBe(0);
      expect(stats.totalValue).toBe(0);
    });

    it('should calculate correct statistics', () => {
      const products = [
        createProduct({ ...mockProductData, stock: 10, price: 100 }), // in stock
        createProduct({ ...mockProductData, stock: 3, price: 50 }),   // low stock
        createProduct({ ...mockProductData, stock: 0, price: 75 }),   // out of stock
      ];
      
      const stats = getProductStats(products);
      expect(stats.total).toBe(3);
      expect(stats.inStock).toBe(1);
      expect(stats.lowStock).toBe(1);
      expect(stats.outOfStock).toBe(1);
      expect(stats.totalValue).toBe(1150); // (10*100) + (3*50) + (0*75)
    });
  });

  describe('validateProductData', () => {
    it('should validate correct product data', () => {
      const result = validateProductData(mockProductData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('should return errors for invalid data', () => {
      const invalidData = {
        name: '',
        price: -10,
        category: '',
        stock: -5
      };
      
      const result = validateProductData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
      expect(result.errors.price).toBeDefined();
      expect(result.errors.category).toBeDefined();
      expect(result.errors.stock).toBeDefined();
    });
  });

  describe('searchProducts', () => {
    const products = [
      createProduct({ ...mockProductData, name: 'iPhone 14', description: 'Latest smartphone' }),
      createProduct({ ...mockProductData, name: 'iPad Pro', description: 'Tablet device' }),
      createProduct({ ...mockProductData, name: 'MacBook', description: 'Laptop computer' })
    ];

    it('should return all products for empty search', () => {
      expect(searchProducts(products, '')).toEqual(products);
      expect(searchProducts(products, null)).toEqual(products);
      expect(searchProducts(products, undefined)).toEqual(products);
    });

    it('should search by product name', () => {
      const results = searchProducts(products, 'iPhone');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('iPhone 14');
    });

    it('should be case insensitive', () => {
      const results = searchProducts(products, 'IPHONE');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('iPhone 14');
    });
  });
});