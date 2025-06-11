import { useReducer, useEffect, useCallback } from 'react';
import { productReducer, initialProductState, productActions } from '../utils/productReducer';
import { sampleProducts, createProduct, updateProduct as updateProductUtil, validateProductData } from '../utils';

const useProducts = (options = {}) => {
  const {
    autoLoad = true,
    initialData = [],
    persistToLocalStorage = true,
    localStorageKey = 'ecommerce_products'
  } = options;

  const [state, dispatch] = useReducer(productReducer, {
    ...initialProductState,
    products: initialData
  });

  // Load products from localStorage or use sample data
  const loadProducts = useCallback(async () => {
    try {
      dispatch(productActions.setLoading(true));
      dispatch(productActions.clearError());
      
      let products = [];
      
      if (persistToLocalStorage) {
        const stored = localStorage.getItem(localStorageKey);
        if (stored) {
          try {
            products = JSON.parse(stored);
          } catch (error) {
            console.warn('Failed to parse stored products:', error);
            products = sampleProducts;
          }
        } else {
          products = sampleProducts;
        }
      } else {
        products = initialData.length > 0 ? initialData : sampleProducts;
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      dispatch(productActions.setProducts(products));
      
    } catch (error) {
      dispatch(productActions.setError('Failed to load products: ' + error.message));
    } finally {
      dispatch(productActions.setLoading(false));
    }
  }, [initialData, persistToLocalStorage, localStorageKey]);

  // Save products to localStorage
  const saveToLocalStorage = useCallback((products) => {
    if (persistToLocalStorage) {
      try {
        localStorage.setItem(localStorageKey, JSON.stringify(products));
      } catch (error) {
        console.warn('Failed to save products to localStorage:', error);
      }
    }
  }, [persistToLocalStorage, localStorageKey]);

  // Add new product
  const addProduct = useCallback(async (productData) => {
    try {
      dispatch(productActions.setLoading(true));
      dispatch(productActions.clearError());
      
      // Validate product data
      const validation = validateProductData(productData);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0]);
      }
      
      // Create new product
      const newProduct = createProduct(productData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch(productActions.addProduct(newProduct));
      
      // Save to localStorage
      const updatedProducts = [...state.products, newProduct];
      saveToLocalStorage(updatedProducts);
      
      return newProduct;
      
    } catch (error) {
      dispatch(productActions.setError('Failed to add product: ' + error.message));
      throw error;
    } finally {
      dispatch(productActions.setLoading(false));
    }
  }, [state.products, saveToLocalStorage]);

  // Update existing product
  const updateProduct = useCallback(async (productId, updates) => {
    try {
      dispatch(productActions.setLoading(true));
      dispatch(productActions.clearError());
      
      const existingProduct = state.products.find(p => p.id === productId);
      if (!existingProduct) {
        throw new Error('Product not found');
      }
      
      // Validate updated data
      const updatedData = { ...existingProduct, ...updates };
      const validation = validateProductData(updatedData);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0]);
      }
      
      // Update product
      const updatedProduct = updateProductUtil(existingProduct, updates);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch(productActions.updateProduct(updatedProduct));
      
      // Save to localStorage
      const updatedProducts = state.products.map(p => 
        p.id === productId ? updatedProduct : p
      );
      saveToLocalStorage(updatedProducts);
      
      return updatedProduct;
      
    } catch (error) {
      dispatch(productActions.setError('Failed to update product: ' + error.message));
      throw error;
    } finally {
      dispatch(productActions.setLoading(false));
    }
  }, [state.products, saveToLocalStorage]);

  // Delete product
  const deleteProduct = useCallback(async (productId) => {
    try {
      dispatch(productActions.setLoading(true));
      dispatch(productActions.clearError());
      
      const productExists = state.products.some(p => p.id === productId);
      if (!productExists) {
        throw new Error('Product not found');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch(productActions.deleteProduct(productId));
      
      // Save to localStorage
      const updatedProducts = state.products.filter(p => p.id !== productId);
      saveToLocalStorage(updatedProducts);
      
    } catch (error) {
      dispatch(productActions.setError('Failed to delete product: ' + error.message));
      throw error;
    } finally {
      dispatch(productActions.setLoading(false));
    }
  }, [state.products, saveToLocalStorage]);

  // Bulk delete products
  const deleteMultipleProducts = useCallback(async (productIds) => {
    try {
      dispatch(productActions.setLoading(true));
      dispatch(productActions.clearError());
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Delete multiple products
      productIds.forEach(id => {
        dispatch(productActions.deleteProduct(id));
      });
      
      // Save to localStorage
      const updatedProducts = state.products.filter(p => !productIds.includes(p.id));
      saveToLocalStorage(updatedProducts);
      
    } catch (error) {
      dispatch(productActions.setError('Failed to delete products: ' + error.message));
      throw error;
    } finally {
      dispatch(productActions.setLoading(false));
    }
  }, [state.products, saveToLocalStorage]);

  // Clear all products
  const clearProducts = useCallback(async () => {
    try {
      dispatch(productActions.setLoading(true));
      dispatch(productActions.clearError());
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      dispatch(productActions.setProducts([]));
      saveToLocalStorage([]);
      
    } catch (error) {
      dispatch(productActions.setError('Failed to clear products: ' + error.message));
    } finally {
      dispatch(productActions.setLoading(false));
    }
  }, [saveToLocalStorage]);

  // Refresh products (reload from source)
  const refreshProducts = useCallback(async () => {
    await loadProducts();
  }, [loadProducts]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch(productActions.clearError());
  }, []);

  // Load products on mount if autoLoad is enabled
  useEffect(() => {
    if (autoLoad && state.products.length === 0 && !state.loading) {
      loadProducts();
    }
  }, [autoLoad, loadProducts, state.products.length, state.loading]);

  // Save to localStorage whenever products change
  useEffect(() => {
    if (state.products.length > 0 && !state.loading) {
      saveToLocalStorage(state.products);
    }
  }, [state.products, state.loading, saveToLocalStorage]);

  return {
    // State
    products: state.products,
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    
    // Actions
    addProduct,
    updateProduct,
    deleteProduct,
    deleteMultipleProducts,
    clearProducts,
    loadProducts,
    refreshProducts,
    clearError,
    
    // Computed values
    isEmpty: state.products.length === 0,
    count: state.products.length,
    
    // Utilities
    getProductById: useCallback((id) => state.products.find(p => p.id === id), [state.products]),
    hasProduct: useCallback((id) => state.products.some(p => p.id === id), [state.products])
  };
};

export default useProducts;