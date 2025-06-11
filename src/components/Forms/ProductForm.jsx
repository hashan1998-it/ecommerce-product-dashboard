import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Button from '../UI/Button';
import Card from '../UI/Card';
import { 
  PRODUCT_CATEGORIES, 
  VALIDATION_RULES, 
  PLACEHOLDER_IMAGE
} from '../../utils';
import './ProductForm.css';

// Simple validation function
const validateProductData = (data) => {
  const errors = {};

  // Name validation
  if (!data.name || data.name.trim().length < 3) {
    errors.name = 'Product name must be at least 3 characters';
  }
  if (data.name && data.name.length > 50) {
    errors.name = 'Product name must not exceed 50 characters';
  }

  // Price validation
  const price = parseFloat(data.price);
  if (!data.price || isNaN(price) || price <= 0) {
    errors.price = 'Price must be a positive number';
  }

  // Category validation
  if (!data.category) {
    errors.category = 'Category is required';
  }

  // Stock validation
  const stock = parseInt(data.stock);
  if (data.stock === '' || isNaN(stock) || stock < 0) {
    errors.stock = 'Stock must be a non-negative number';
  }

  // Description validation (optional)
  if (data.description && data.description.length > 200) {
    errors.description = 'Description must not exceed 200 characters';
  }

  // Image URL validation (optional)
  if (data.imageUrl && data.imageUrl.trim() !== '') {
    try {
      new URL(data.imageUrl);
    } catch {
      errors.imageUrl = 'Please enter a valid URL';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const ProductForm = ({ 
  product = null, 
  onSubmit, 
  onCancel, 
  loading = false,
  submitText = null,
  title = null 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine if we're in edit mode
  const isEditMode = !!product;
  
  // Dynamic titles and button text based on mode
  const formTitle = title || (isEditMode ? 'Edit Product' : 'Add New Product');
  const buttonText = submitText || (isEditMode ? 'Update Product' : 'Add Product');

  // Initialize form data when product prop changes (for edit mode)
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category || '',
        stock: product.stock?.toString() || '',
        imageUrl: product.imageUrl || ''
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        imageUrl: ''
      });
    }
    // Clear errors and touched when product changes
    setErrors({});
    setTouched({});
  }, [product]);

  // Handle input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate all fields
    const validation = validateProductData(formData);
    setErrors(validation.errors);

    // Don't submit if there are validation errors
    if (!validation.isValid) {
      console.log('Form validation failed:', validation.errors);
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Convert strings to appropriate types
      const submissionData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        imageUrl: formData.imageUrl.trim() || PLACEHOLDER_IMAGE
      };

      console.log('Submitting product data:', submissionData);
      
      await onSubmit(submissionData);
      
      // Reset form on successful submission (only for add mode)
      if (!isEditMode) {
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          stock: '',
          imageUrl: ''
        });
        setErrors({});
        setTouched({});
      }
    } catch (error) {
      console.error('Form submission error:', error);
      // Error is handled by parent component
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit, isEditMode]);

  // Reset form
  const handleReset = useCallback(() => {
    if (isEditMode && product) {
      // Reset to original product data
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category || '',
        stock: product.stock?.toString() || '',
        imageUrl: product.imageUrl || ''
      });
    } else {
      // Clear form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        imageUrl: ''
      });
    }
    setErrors({});
    setTouched({});
  }, [isEditMode, product]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  // Check if form is valid and has content
  const isFormValid = () => {
    const hasRequiredFields = 
      formData.name.trim().length >= 3 && 
      formData.price && 
      !isNaN(parseFloat(formData.price)) && 
      parseFloat(formData.price) > 0 &&
      formData.category && 
      formData.stock !== '' && 
      !isNaN(parseInt(formData.stock)) && 
      parseInt(formData.stock) >= 0;

    const hasErrors = Object.keys(errors).length > 0;
    
    return hasRequiredFields && !hasErrors;
  };

  return (
    <Card className="product-form-card">
      <Card.Header>
        <h3 className="form-title">{formTitle}</h3>
      </Card.Header>
      
      <form onSubmit={handleSubmit} className="product-form">
        <Card.Body>
          <div className="form-grid">
            {/* Product Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label required">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name && touched.name ? 'error' : ''}`}
                placeholder="Enter product name"
                maxLength="50"
                required
                disabled={loading || isSubmitting}
              />
              {errors.name && touched.name && (
                <span className="error-text">{errors.name}</span>
              )}
              <div className="input-help">
                {formData.name.length}/50 characters
              </div>
            </div>

            {/* Price */}
            <div className="form-group">
              <label htmlFor="price" className="form-label required">
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={`form-input ${errors.price && touched.price ? 'error' : ''}`}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
                disabled={loading || isSubmitting}
              />
              {errors.price && touched.price && (
                <span className="error-text">{errors.price}</span>
              )}
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category" className="form-label required">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`form-input ${errors.category && touched.category ? 'error' : ''}`}
                required
                disabled={loading || isSubmitting}
              >
                <option value="">Select a category</option>
                {PRODUCT_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && touched.category && (
                <span className="error-text">{errors.category}</span>
              )}
            </div>

            {/* Stock */}
            <div className="form-group">
              <label htmlFor="stock" className="form-label required">
                Stock Quantity
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className={`form-input ${errors.stock && touched.stock ? 'error' : ''}`}
                placeholder="0"
                min="0"
                step="1"
                required
                disabled={loading || isSubmitting}
              />
              {errors.stock && touched.stock && (
                <span className="error-text">{errors.stock}</span>
              )}
            </div>
          </div>

          {/* Description - Full Width */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description <span className="optional-text">(Optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`form-textarea ${errors.description && touched.description ? 'error' : ''}`}
              placeholder="Enter product description"
              rows="4"
              maxLength="200"
              disabled={loading || isSubmitting}
            />
            {errors.description && touched.description && (
              <span className="error-text">{errors.description}</span>
            )}
            <div className="character-counter">
              {formData.description.length}/200 characters
            </div>
          </div>

          {/* Image URL - Full Width */}
          <div className="form-group">
            <label htmlFor="imageUrl" className="form-label">
              Image URL <span className="optional-text">(Optional)</span>
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className={`form-input ${errors.imageUrl && touched.imageUrl ? 'error' : ''}`}
              placeholder="https://example.com/image.jpg"
              disabled={loading || isSubmitting}
            />
            {errors.imageUrl && touched.imageUrl && (
              <span className="error-text">{errors.imageUrl}</span>
            )}
            <div className="input-help">
              Leave empty to use default placeholder image
            </div>
          </div>

          {/* Image Preview */}
          {formData.imageUrl && (
            <div className="image-preview">
              <label className="form-label">Image Preview</label>
              <div className="preview-container">
                <img
                  src={formData.imageUrl}
                  alt="Product preview"
                  className="preview-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                  onLoad={(e) => {
                    e.target.style.display = 'block';
                  }}
                />
              </div>
            </div>
          )}
        </Card.Body>

        <Card.Footer className="form-actions">
          <div className="form-buttons">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading || isSubmitting}
            >
              Cancel
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              disabled={loading || isSubmitting}
            >
              {isEditMode ? 'Reset Changes' : 'Clear Form'}
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              loading={loading || isSubmitting}
              disabled={!isFormValid() || loading || isSubmitting}
            >
              {loading || isSubmitting ? 'Saving...' : buttonText}
            </Button>
          </div>
        </Card.Footer>
      </form>
    </Card>
  );
};

ProductForm.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    category: PropTypes.string,
    stock: PropTypes.number,
    imageUrl: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool,
  submitText: PropTypes.string,
  title: PropTypes.string
};

export default ProductForm;