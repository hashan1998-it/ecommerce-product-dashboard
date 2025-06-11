import React from 'react';
import PropTypes from 'prop-types';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { 
  formatPrice, 
  truncateText, 
  getStockStatus, 
  STOCK_STATUS_LABELS, 
  STOCK_STATUS_COLORS,
  FALLBACK_IMAGE 
} from '../../utils';
import './ProductCard.css';

const ProductCard = ({ 
  product, 
  onEdit, 
  onDelete, 
  onView,
  showActions = true 
}) => {
  const stockStatus = getStockStatus(product.stock);
  const stockColor = STOCK_STATUS_COLORS[stockStatus];
  const stockLabel = STOCK_STATUS_LABELS[stockStatus];

  const handleImageError = (e) => {
    e.target.src = FALLBACK_IMAGE;
  };

  return (
    <Card className="product-card" hover>
      <div className="product-image-container">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="product-category-badge">
          {product.category}
        </div>
        <div 
          className={`product-stock-badge stock-${stockStatus}`}
          style={{ backgroundColor: stockColor }}
        >
          {stockLabel}
        </div>
      </div>

      <Card.Body className="product-content">
        <div className="product-header">
          <h3 className="product-name" title={product.name}>
            {truncateText(product.name, 30)}
          </h3>
          <div className="product-price">
            {formatPrice(product.price)}
          </div>
        </div>

        <div className="product-details">
          <p className="product-description" title={product.description}>
            {product.description 
              ? truncateText(product.description, 80) 
              : 'No description available'
            }
          </p>
          
          <div className="product-meta">
            <div className="product-stock">
              <span className="stock-label">Stock:</span>
              <span className={`stock-value stock-${stockStatus}`}>
                {product.stock} units
              </span>
            </div>
          </div>
        </div>
      </Card.Body>

      {showActions && (
        <Card.Footer className="product-actions">
          <Button 
            variant="ghost" 
            size="small"
            onClick={() => onView?.(product)}
            aria-label={`View ${product.name}`}
          >
            View
          </Button>
          <Button 
            variant="outline" 
            size="small"
            onClick={() => onEdit?.(product)}
            aria-label={`Edit ${product.name}`}
          >
            Edit
          </Button>
          <Button 
            variant="danger" 
            size="small"
            onClick={() => onDelete?.(product)}
            aria-label={`Delete ${product.name}`}
          >
            Delete
          </Button>
        </Card.Footer>
      )}
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    stock: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  showActions: PropTypes.bool
};

export default ProductCard;