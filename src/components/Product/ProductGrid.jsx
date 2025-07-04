import React from 'react';
import PropTypes from 'prop-types';
import ProductCard from './ProductCard';
import { ProductListPropTypes } from '../../utils';
import './ProductGrid.css';

const ProductGrid = React.memo(({ 
  products, 
  loading = false, 
  onEdit, 
  onDelete, 
  onView,
  emptyMessage = "No products found",
  emptyDescription = "Try adjusting your search or filters to find what you're looking for."
}) => {
  // Memoize handlers to prevent unnecessary re-renders of ProductCard
  const handleEdit = React.useCallback((product) => {
    onEdit?.(product);
  }, [onEdit]);

  const handleDelete = React.useCallback((product) => {
    onDelete?.(product);
  }, [onDelete]);

  const handleView = React.useCallback((product) => {
    onView?.(product);
  }, [onView]);

  if (loading) {
    return (
      <div className="product-grid-container">
        <div className="product-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="product-card-skeleton">
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-line skeleton-title"></div>
                <div className="skeleton-line skeleton-price"></div>
                <div className="skeleton-line skeleton-description"></div>
                <div className="skeleton-line skeleton-description short"></div>
                <div className="skeleton-actions">
                  <div className="skeleton-button"></div>
                  <div className="skeleton-button"></div>
                  <div className="skeleton-button"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="product-grid-container">
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3 className="empty-state-title">{emptyMessage}</h3>
          <p className="empty-state-description">{emptyDescription}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      <div className="product-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        ))}
      </div>
    </div>
  );
});

// Add display name for better debugging
ProductGrid.displayName = 'ProductGrid';

ProductGrid.propTypes = {
  products: ProductListPropTypes,
  loading: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  emptyMessage: PropTypes.string,
  emptyDescription: PropTypes.string
};

export default ProductGrid;