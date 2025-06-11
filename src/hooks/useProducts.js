import { useState, useEffect } from 'react';
import { sampleProducts } from '../utils';

const useProducts = (initialProducts = []) => {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulate loading products from an API
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProducts(sampleProducts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add product
  const addProduct = async (productData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newProduct = {
        ...productData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update product
  const updateProduct = async (productId, updates) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProducts(prev => 
        prev.map(product => 
          product.id === productId 
            ? { ...product, ...updates, updatedAt: new Date().toISOString() }
            : product
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProducts(prev => prev.filter(product => product.id !== productId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load products on mount
  useEffect(() => {
    if (products.length === 0) {
      loadProducts();
    }
  }, []);

  return {
    products,
    loading,
    error,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setProducts
  };
};

export default useProducts;