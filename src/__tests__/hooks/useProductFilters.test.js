/* eslint-disable no-undef */
import { renderHook, act } from '@testing-library/react';
import useProductFilters from '../../hooks/useProductFilters';

const mockProducts = [
  {
    id: '1',
    name: 'iPhone 14',
    category: 'Electronics',
    price: 999,
    stock: 10,
    description: 'Latest smartphone'
  },
  {
    id: '2',
    name: 'JavaScript Book',
    category: 'Books',
    price: 29.99,
    stock: 5,
    description: 'Learn programming'
  },
  {
    id: '3',
    name: 'Cotton Shirt',
    category: 'Clothing',
    price: 49.99,
    stock: 0,
    description: 'Comfortable clothing'
  }
];

describe('useProductFilters', () => {
  it('should initialize with default filters', () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));
    
    expect(result.current.filters.search).toBe('');
    expect(result.current.filters.category).toBe('all');
    expect(result.current.filters.sortBy).toBe('name_asc');
    expect(result.current.hasActiveFilters).toBe(false);
    expect(result.current.filteredProducts).toHaveLength(3);
  });

  it('should filter products by search term', () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));
    
    act(() => {
      result.current.updateFilter('search', 'iPhone');
    });
    
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe('iPhone 14');
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('should filter products by category', () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));
    
    act(() => {
      result.current.updateFilter('category', 'Books');
    });
    
    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].category).toBe('Books');
  });

  it('should sort products correctly', () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));
    
    act(() => {
      result.current.updateFilter('sortBy', 'price_asc');
    });
    
    const prices = result.current.filteredProducts.map(p => p.price);
    expect(prices).toEqual([29.99, 49.99, 999]);
  });

  it('should clear all filters', () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));
    
    // Set some filters
    act(() => {
      result.current.updateFilters({
        search: 'test',
        category: 'Electronics',
        sortBy: 'price_desc'
      });
    });
    
    expect(result.current.hasActiveFilters).toBe(true);
    
    // Clear filters
    act(() => {
      result.current.clearFilters();
    });
    
    expect(result.current.hasActiveFilters).toBe(false);
    expect(result.current.filters.search).toBe('');
    expect(result.current.filters.category).toBe('all');
    expect(result.current.filteredProducts).toHaveLength(3);
  });

  it('should count active filters correctly', () => {
    const { result } = renderHook(() => useProductFilters(mockProducts));
    
    act(() => {
      result.current.updateFilters({
        search: 'test',
        category: 'Electronics',
        minPrice: '10'
      });
    });
    
    expect(result.current.activeFilterCount).toBe(3);
  });
});