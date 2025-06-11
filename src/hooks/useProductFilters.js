import { useState, useMemo, useCallback } from 'react';
import { searchProducts } from '../utils';

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
    
    let filtered = [...products]; // Create a copy to avoid mutations
    
    // Apply search filter first (most restrictive)
    if (filters.search && filters.search.trim() !== '') {
      filtered = searchProducts(filtered, filters.search.trim());
    }
    
    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category);
    }
    
    // Apply price filters
    if (filters.minPrice !== '' && filters.minPrice !== null) {
      const minPrice = parseFloat(filters.minPrice);
      if (!isNaN(minPrice)) {
        filtered = filtered.filter(product => product.price >= minPrice);
      }
    }
    
    if (filters.maxPrice !== '' && filters.maxPrice !== null) {
      const maxPrice = parseFloat(filters.maxPrice);
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter(product => product.price <= maxPrice);
      }
    }
    
    // Apply stock status filter
    if (filters.stockStatus && filters.stockStatus !== 'all') {
      filtered = filtered.filter(product => {
        const stock = product.stock;
        switch (filters.stockStatus) {
          case 'in_stock':
            return stock > 5;
          case 'low_stock':
            return stock > 0 && stock <= 5;
          case 'out_of_stock':
            return stock === 0;
          default:
            return true;
        }
      });
    }
    
    // Apply sorting last
    if (filters.sortBy) {
      filtered = filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'name_asc':
            return a.name.localeCompare(b.name);
          case 'name_desc':
            return b.name.localeCompare(a.name);
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'stock_asc':
            return a.stock - b.stock;
          case 'stock_desc':
            return b.stock - a.stock;
          case 'category': {
            const categoryCompare = a.category.localeCompare(b.category);
            return categoryCompare === 0 ? a.name.localeCompare(b.name) : categoryCompare;
          }
          default:
            return 0;
        }
      });
    }
    
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

  // Check if any filters are active (excluding default sort)
  const hasActiveFilters = useMemo(() => {
    return filters.search !== '' ||
           filters.category !== 'all' ||
           filters.minPrice !== '' ||
           filters.maxPrice !== '' ||
           filters.stockStatus !== 'all';
  }, [filters.search, filters.category, filters.minPrice, filters.maxPrice, filters.stockStatus]);

  // Get active filter count (excluding sort)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search && filters.search.trim() !== '') count++;
    if (filters.category !== 'all') count++;
    if (filters.minPrice !== '' || filters.maxPrice !== '') count++;
    if (filters.stockStatus !== 'all') count++;
    return count;
  }, [filters.search, filters.category, filters.minPrice, filters.maxPrice, filters.stockStatus]);

  // Get active filter descriptions
  const activeFilterDescriptions = useMemo(() => {
    const descriptions = [];
    
    if (filters.search && filters.search.trim() !== '') {
      descriptions.push(`Search: "${filters.search}"`);
    }
    
    if (filters.category !== 'all') {
      descriptions.push(`Category: ${filters.category}`);
    }
    
    if (filters.minPrice !== '' || filters.maxPrice !== '') {
      if (filters.minPrice !== '' && filters.maxPrice !== '') {
        descriptions.push(`Price: $${filters.minPrice} - $${filters.maxPrice}`);
      } else if (filters.minPrice !== '') {
        descriptions.push(`Price: $${filters.minPrice}+`);
      } else {
        descriptions.push(`Price: Up to $${filters.maxPrice}`);
      }
    }
    
    if (filters.stockStatus !== 'all') {
      const statusLabels = {
        'in_stock': 'In Stock',
        'low_stock': 'Low Stock',
        'out_of_stock': 'Out of Stock'
      };
      descriptions.push(`Stock: ${statusLabels[filters.stockStatus]}`);
    }
    
    return descriptions;
  }, [filters.search, filters.category, filters.minPrice, filters.maxPrice, filters.stockStatus]);

  // Reset specific filter
  const resetFilter = useCallback((key) => {
    const defaultValues = {
      search: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      stockStatus: 'all',
      sortBy: 'name_asc'
    };
    
    setFilters(prev => ({
      ...prev,
      [key]: defaultValues[key]
    }));
  }, []);

  // Get filter statistics
  const filterStats = useMemo(() => {
    const totalProducts = products?.length || 0;
    const filteredCount = filteredProducts.length;
    const filteredPercentage = totalProducts > 0 ? Math.round((filteredCount / totalProducts) * 100) : 0;
    
    return {
      total: totalProducts,
      filtered: filteredCount,
      hidden: totalProducts - filteredCount,
      percentage: filteredPercentage,
      showingAll: filteredCount === totalProducts
    };
  }, [products?.length, filteredProducts.length]);

  return {
    // Current filters
    filters,
    
    // Filtered data
    filteredProducts,
    
    // Filter actions
    updateFilter,
    updateFilters,
    clearFilters,
    resetFilter,
    
    // Filter state
    hasActiveFilters,
    activeFilterCount,
    activeFilterDescriptions,
    
    // Computed values
    totalCount: products?.length || 0,
    filteredCount: filteredProducts.length,
    isFiltered: filteredProducts.length !== (products?.length || 0),
    
    // Statistics
    filterStats
  };
};

export default useProductFilters;