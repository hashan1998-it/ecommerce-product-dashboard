/* eslint-disable no-undef */
import { renderHook, act } from '@testing-library/react';
import useProducts from '../../hooks/useProducts';
// import { sampleProducts } from '../../utils';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock sample products
vi.mock('../../utils', async () => {
  const actual = await vi.importActual('../../utils');
  return {
    ...actual,
    sampleProducts: [
      {
        id: '1',
        name: 'Test Product 1',
        price: 99.99,
        category: 'Electronics',
        stock: 10
      }
    ]
  };
});

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should initialize with empty products and loading state', () => {
    const { result } = renderHook(() => useProducts({ autoLoad: false }));
    
    expect(result.current.products).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.isEmpty).toBe(true);
    expect(result.current.count).toBe(0);
  });

  it('should load products automatically when autoLoad is true', async () => {
    const { result } = renderHook(() => useProducts({ autoLoad: true }));
    
    expect(result.current.loading).toBe(true);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.products.length).toBeGreaterThan(0);
  });

  it('should add product successfully', async () => {
    const { result } = renderHook(() => useProducts({ autoLoad: false }));
    
    const newProductData = {
      name: 'New Product',
      price: 49.99,
      category: 'Books',
      stock: 5
    };
    
    await act(async () => {
      await result.current.addProduct(newProductData);
    });
    
    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].name).toBe(newProductData.name);
  });

  it('should handle errors when adding invalid product', async () => {
    const { result } = renderHook(() => useProducts({ autoLoad: false }));
    
    const invalidProductData = {
      name: '', // Invalid: too short
      price: -10, // Invalid: negative
      category: '',
      stock: -1
    };
    
    await act(async () => {
      try {
        await result.current.addProduct(invalidProductData);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        // Expected to throw
      }
    });
    
    expect(result.current.error).toBeTruthy();
    expect(result.current.products).toHaveLength(0);
  });

  it('should delete product successfully', async () => {
    const { result } = renderHook(() => useProducts({ autoLoad: false }));
    
    // First add a product
    const productData = {
      name: 'Product to Delete',
      price: 99.99,
      category: 'Electronics',
      stock: 1
    };
    
    let productId;
    await act(async () => {
      const product = await result.current.addProduct(productData);
      productId = product.id;
    });
    
    expect(result.current.products).toHaveLength(1);
    
    // Then delete it
    await act(async () => {
      await result.current.deleteProduct(productId);
    });
    
    expect(result.current.products).toHaveLength(0);
  });

  it('should clear error when clearError is called', async () => {
    const { result } = renderHook(() => useProducts({ autoLoad: false }));
    
    // Trigger an error by trying to delete non-existent product
    await act(async () => {
      try {
        await result.current.deleteProduct('non-existent-id');
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        // Expected to throw
      }
    });
    
    expect(result.current.error).toBeTruthy();
    
    // Clear the error
    act(() => {
      result.current.clearError();
    });
    
    expect(result.current.error).toBe(null);
  });
});