import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import ProductGrid from './ProductGrid';
import SearchInput from '../UI/SearchInput';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { ProductListPropTypes, getProductStats, formatPrice, PRODUCT_CATEGORIES } from '../../utils';
import './ProductList.css';

const ProductList = ({ 
  products, 
  loading = false, 
  onEdit, 
  onDelete, 
  onView,
  onAddNew,
  title = "Products",
  showStats = true,
  showAddButton = true,
  showSearch = true
}) => {
  // Local filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name_asc');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  // Apply all filters and sorting
  const filteredAndSortedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    let filtered = [...products];

    // Apply search filter
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(term);
        const descriptionMatch = product.description?.toLowerCase().includes(term) || false;
        const categoryMatch = product.category.toLowerCase().includes(term);
        return nameMatch || descriptionMatch || categoryMatch;
      });
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Apply price range filter
    if (priceRange.min !== '') {
      const minPrice = parseFloat(priceRange.min);
      if (!isNaN(minPrice)) {
        filtered = filtered.filter(product => product.price >= minPrice);
      }
    }
    
    if (priceRange.max !== '') {
      const maxPrice = parseFloat(priceRange.max);
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter(product => product.price <= maxPrice);
      }
    }

    // Apply stock status filter
    if (stockFilter !== 'all') {
      filtered = filtered.filter(product => {
        const stock = product.stock;
        switch (stockFilter) {
          case 'in_stock': {
            return stock > 5;
          }
          case 'low_stock': {
            return stock > 0 && stock <= 5;
          }
          case 'out_of_stock': {
            return stock === 0;
          }
          default: {
            return true;
          }
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
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

    return filtered;
  }, [products, searchTerm, categoryFilter, priceRange, stockFilter, sortBy]);

  const stats = useMemo(() => {
    return showStats ? getProductStats(products) : null;
  }, [products, showStats]);

  // Event handlers
  const handleSearchChange = useCallback((searchValue) => {
    setSearchTerm(searchValue);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchTerm('');
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setSearchTerm('');
    setPriceRange({ min: '', max: '' });
    setCategoryFilter('all');
    setStockFilter('all');
  }, []);

  const handlePriceRangeChange = useCallback((type, value) => {
    setPriceRange(prev => ({ ...prev, [type]: value }));
  }, []);

  const handleCategoryChange = useCallback((value) => {
    setCategoryFilter(value);
  }, []);

  const handleStockFilterChange = useCallback((value) => {
    setStockFilter(value);
  }, []);

  const handleSortChange = useCallback((value) => {
    setSortBy(value);
  }, []);

  // Check for active filters
  const hasActiveFilters = useMemo(() => {
    return searchTerm !== '' ||
           categoryFilter !== 'all' ||
           priceRange.min !== '' ||
           priceRange.max !== '' ||
           stockFilter !== 'all';
  }, [searchTerm, categoryFilter, priceRange.min, priceRange.max, stockFilter]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm.trim() !== '') count++;
    if (categoryFilter !== 'all') count++;
    if (priceRange.min !== '' || priceRange.max !== '') count++;
    if (stockFilter !== 'all') count++;
    return count;
  }, [searchTerm, categoryFilter, priceRange.min, priceRange.max, stockFilter]);

  return (
    <div className="product-list">
      {/* Header Section */}
      <Card className="product-list-header">
        <Card.Body>
          <div className="product-list-header-content">
            <div className="product-list-title-section">
              <h2 className="product-list-title">{title}</h2>
              <div className="product-count">
                {loading ? (
                  <span className="loading-text">Loading...</span>
                ) : (
                  <span>
                    {hasActiveFilters ? (
                      <>
                        Showing {filteredAndSortedProducts.length} of {products?.length || 0} products
                        {searchTerm && (
                          <span className="search-term"> for "{searchTerm}"</span>
                        )}
                      </>
                    ) : (
                      <>
                        {products?.length || 0} {products?.length === 1 ? 'product' : 'products'}
                      </>
                    )}
                  </span>
                )}
              </div>
            </div>
            
            <div className="product-list-actions">
              {showAddButton && (
                <Button 
                  variant="primary" 
                  onClick={onAddNew}
                  disabled={loading}
                >
                  Add Product
                </Button>
              )}
            </div>
          </div>

          {/* Search and Filter Section */}
          {showSearch && (
            <div className="search-filter-section">
              <div className="search-controls">
                <SearchInput
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onClear={handleSearchClear}
                  placeholder="Search products by name, description, or category..."
                  disabled={loading}
                  showResultsCount={true}
                  resultsCount={filteredAndSortedProducts.length}
                  totalCount={products?.length || 0}
                  className="product-search"
                />
                
                {/* Filter Controls */}
                <div className="filter-controls">
                  {/* Category Filter */}
                  <div className="filter-group">
                    <label htmlFor="category-filter" className="filter-label">Category:</label>
                    <select
                      id="category-filter"
                      value={categoryFilter}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="filter-select"
                      disabled={loading}
                    >
                      <option value="all">All Categories</option>
                      {PRODUCT_CATEGORIES.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div className="filter-group">
                    <label className="filter-label">Price Range:</label>
                    <div className="price-range-inputs">
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                        placeholder="Min $"
                        className="price-input"
                        min="0"
                        step="0.01"
                        disabled={loading}
                      />
                      <span className="price-separator">-</span>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                        placeholder="Max $"
                        className="price-input"
                        min="0"
                        step="0.01"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Stock Status Filter */}
                  <div className="filter-group">
                    <label className="filter-label">Stock Status:</label>
                    <div className="stock-filter-options">
                      <label className="stock-option">
                        <input
                          type="radio"
                          name="stock-filter"
                          value="all"
                          checked={stockFilter === 'all'}
                          onChange={(e) => handleStockFilterChange(e.target.value)}
                          disabled={loading}
                        />
                        All
                      </label>
                      <label className="stock-option">
                        <input
                          type="radio"
                          name="stock-filter"
                          value="in_stock"
                          checked={stockFilter === 'in_stock'}
                          onChange={(e) => handleStockFilterChange(e.target.value)}
                          disabled={loading}
                        />
                        In Stock
                      </label>
                      <label className="stock-option">
                        <input
                          type="radio"
                          name="stock-filter"
                          value="low_stock"
                          checked={stockFilter === 'low_stock'}
                          onChange={(e) => handleStockFilterChange(e.target.value)}
                          disabled={loading}
                        />
                        Low Stock
                      </label>
                      <label className="stock-option">
                        <input
                          type="radio"
                          name="stock-filter"
                          value="out_of_stock"
                          checked={stockFilter === 'out_of_stock'}
                          onChange={(e) => handleStockFilterChange(e.target.value)}
                          disabled={loading}
                        />
                        Out of Stock
                      </label>
                    </div>
                  </div>
                </div>
                
                {hasActiveFilters && (
                  <div className="active-filters">
                    <span className="active-filters-label">
                      {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
                    </span>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={handleClearAllFilters}
                      disabled={loading}
                    >
                      Clear all filters
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="sort-controls">
                <label htmlFor="sort-select" className="sort-label">
                  Sort by:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="sort-select"
                  disabled={loading}
                >
                  <option value="name_asc">Name (A-Z)</option>
                  <option value="name_desc">Name (Z-A)</option>
                  <option value="price_asc">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                  <option value="stock_asc">Stock (Low to High)</option>
                  <option value="stock_desc">Stock (High to Low)</option>
                  <option value="category">Category</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Statistics Section */}
          {showStats && stats && (
            <div className="product-stats">
              <div className="stat-item">
                <span className="stat-value">{stats.inStock}</span>
                <span className="stat-label">In Stock</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.lowStock}</span>
                <span className="stat-label">Low Stock</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.outOfStock}</span>
                <span className="stat-label">Out of Stock</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{formatPrice(stats.totalValue)}</span>
                <span className="stat-label">Total Value</span>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Product Grid */}
      <ProductGrid
        products={filteredAndSortedProducts}
        loading={loading}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
        emptyMessage={
          hasActiveFilters ? "No products match your filters" : "No products found"
        }
        emptyDescription={
          hasActiveFilters 
            ? "Try adjusting your search terms or clearing filters." 
            : "Start by adding your first product to the catalog."
        }
      />
    </div>
  );
};

ProductList.propTypes = {
  products: ProductListPropTypes,
  loading: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  onAddNew: PropTypes.func,
  title: PropTypes.string,
  showStats: PropTypes.bool,
  showAddButton: PropTypes.bool,
  showSearch: PropTypes.bool
};

export default ProductList;