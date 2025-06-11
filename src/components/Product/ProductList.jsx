import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import ProductGrid from './ProductGrid';
import SearchInput from '../UI/SearchInput';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { ProductListPropTypes, getProductStats, formatPrice} from '../../utils';
import useProductFilters from '../../hooks/useProductFilters';
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
  const [sortBy, setSortBy] = useState('name_asc');
  
  // Use the product filters hook for search functionality
  const {
    filters,
    filteredProducts,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    activeFilterCount
  } = useProductFilters(products);

  const stats = useMemo(() => {
    return showStats ? getProductStats(products) : null;
  }, [products, showStats]);

  const sortedProducts = useMemo(() => {
    if (!filteredProducts || filteredProducts.length === 0) return [];
    
    const sorted = [...filteredProducts];
    
    switch (sortBy) {
      case 'name_asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'stock_asc':
        return sorted.sort((a, b) => a.stock - b.stock);
      case 'stock_desc':
        return sorted.sort((a, b) => b.stock - a.stock);
      case 'category':
        return sorted.sort((a, b) => {
          const categoryCompare = a.category.localeCompare(b.category);
          return categoryCompare === 0 ? a.name.localeCompare(b.name) : categoryCompare;
        });
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  const handleSearchChange = (searchValue) => {
    updateFilter('search', searchValue);
  };

  const handleSearchClear = () => {
    updateFilter('search', '');
  };

  const handleClearAllFilters = () => {
    clearFilters();
  };

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
                        Showing {sortedProducts.length} of {products?.length || 0} products
                        {filters.search && (
                          <span className="search-term"> for "{filters.search}"</span>
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
                  value={filters.search}
                  onChange={handleSearchChange}
                  onClear={handleSearchClear}
                  placeholder="Search products by name, description, or category..."
                  disabled={loading}
                  showResultsCount={true}
                  resultsCount={sortedProducts.length}
                  totalCount={products?.length || 0}
                  className="product-search"
                />
                
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
                      Clear all
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
                  onChange={(e) => setSortBy(e.target.value)}
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
        products={sortedProducts}
        loading={loading}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
        emptyMessage={
          hasActiveFilters ? "No products match your search" : "No products found"
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