import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import ProductGrid from './ProductGrid';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { ProductListPropTypes, getProductStats, formatPrice } from '../../utils';
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
  showAddButton = true
}) => {
  const [sortBy, setSortBy] = useState('name_asc');
  
  const stats = useMemo(() => {
    return showStats ? getProductStats(products) : null;
  }, [products, showStats]);

  const sortedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    const sorted = [...products];
    
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
  }, [products, sortBy]);

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
                    {products?.length || 0} {products?.length === 1 ? 'product' : 'products'}
                  </span>
                )}
              </div>
            </div>
            
            <div className="product-list-actions">
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
  showAddButton: PropTypes.bool
};

export default ProductList;