import React from 'react';
import Card from '../UI/Card';
import './ProductCardSkeleton.css';

const ProductCardSkeleton = () => {
  return (
    <Card className="product-card-skeleton">
      <div className="skeleton-image">
        <div className="skeleton-badges">
          <div className="skeleton-badge skeleton-category"></div>
          <div className="skeleton-badge skeleton-stock"></div>
        </div>
      </div>
      
      <Card.Body className="skeleton-content">
        <div className="skeleton-header">
          <div className="skeleton-line skeleton-title"></div>
          <div className="skeleton-line skeleton-price"></div>
        </div>
        
        <div className="skeleton-description-area">
          <div className="skeleton-line skeleton-description"></div>
          <div className="skeleton-line skeleton-description"></div>
          <div className="skeleton-line skeleton-description short"></div>
        </div>
        
        <div className="skeleton-meta">
          <div className="skeleton-line skeleton-stock-info"></div>
        </div>
      </Card.Body>
      
      <Card.Footer className="skeleton-actions">
        <div className="skeleton-button"></div>
        <div className="skeleton-button"></div>
        <div className="skeleton-button"></div>
      </Card.Footer>
    </Card>
  );
};

export default ProductCardSkeleton;