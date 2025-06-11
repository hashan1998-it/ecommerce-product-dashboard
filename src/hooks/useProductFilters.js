import { useState, useMemo, useCallback } from 'react';
import { filterProducts, sortProducts, searchProducts } from '../utils';

const useProductFilters = (products = []) => {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    stockStatus: 'all',
    sortBy: 'name_asc'
  });

  // Apply all filters and sorting
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    let filtered = products;
    
    // Apply search filter
    if (filters.search) {
      filtered = searchProducts(filtered, filters.search);
    }
    
    // Apply other filters
    filtered = filterProducts(filtered, {
      category: filters.category !== 'all' ? filters.category : undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      stockStatus: filters.stockStatus !== 'all' ? filters.stockStatus : undefined
    });
    
    // Apply sorting
    filtered = sortProducts(filtered, filters.sortBy);
    
    return filtered;
  }, [products, filters]);

  // Update individual filter
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Update multiple filters at once
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      stockStatus: 'all',
      sortBy: 'name_asc'
    });
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return filters.search !== '' ||
           filters.category !== 'all' ||
           filters.minPrice !== '' ||
           filters.maxPrice !== '' ||
           filters.stockStatus !== 'all' ||
           filters.sortBy !== 'name_asc';
  }, [filters]);

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category !== 'all') count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.stockStatus !== 'all') count++;
    return count;
  }, [filters]);

  return {
    // Current filters
    filters,
    
    // Filtered data
    filteredProducts,
    
    // Filter actions
    updateFilter,
    updateFilters,
    clearFilters,
    
    // Filter state
    hasActiveFilters,
    activeFilterCount,
    
    // Computed values
    totalCount: products.length,
    filteredCount: filteredProducts.length,
    isFiltered: filteredProducts.length !== products.length
  };
};

export default useProductFilters;