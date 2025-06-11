import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Button from '../UI/Button';
import Card from '../UI/Card';
import { 
  PRODUCT_CATEGORIES, 
  VALIDATION_RULES, 
  PLACEHOLDER_IMAGE,
  validateProductData,
  isValidUrl
} from '../../utils';
import './ProductForm.css';

const ProductForm = ({ 
  product = null, 
  onSubmit, 
  onCancel, 
  loading = false,
  submitText = 'Add Product',
  title = 'Add New Product' 
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
    }
  }, [product]);

  // Real-time validation
  const validateField = useCallback((name, value) => {
    const tempData = { ...formData, [name]: value };
    const validation = validateProductData(tempData);
    
    return validation.errors[name] || null;
  }, [formData]);

  // Handle input changes with real-time validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate field in real-time
    const fieldError = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
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
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Convert strings to appropriate types
      const submissionData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        imageUrl: formData.imageUrl.trim() || PLACEHOLDER_IMAGE
      };

      await onSubmit(submissionData);
      
      // Reset form on successful submission (only for add mode)
      if (!product) {
        handleReset();
      }
    } catch (error) {
      // Error handling is done by parent component
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
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
  };

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      handleReset();
    }
  };

  // Check if form has changes (for edit mode)
  const hasChanges = product ? 
    JSON.stringify(formData) !== JSON.stringify({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      category: product.category || '',
      stock: product.stock?.toString() || '',
      imageUrl: product.imageUrl || ''
    }) : 
    Object.values(formData).some(value => value.trim() !== '');

  // Calculate character count for description
  const descriptionLength = formData.description.length;
  const maxDescriptionLength = VALIDATION_RULES.DESCRIPTION.MAX_LENGTH;

  // FIXED: Check if form is valid - more lenient validation for button state
  const isFormValid = () => {
    // Check required fields have values
    const hasRequiredFields = 
      formData.name.trim().length >= 3 && 
      formData.price && 
      !isNaN(parseFloat(formData.price)) && 
      parseFloat(formData.price) > 0 &&
      formData.category && 
      formData.stock !== '' && 
      !isNaN(parseInt(formData.stock)) && 
      parseInt(formData.stock) >= 0;

    // Check if there are any current validation errors for touched fields
    const hasErrors = Object.keys(errors).some(key => 
      touched[key] && errors[key]
    );

    return hasRequiredFields && !hasErrors;
  };

  return (
    <Card className="product-form-card">
      <Card.Header>
        <h3 className="form-title">{title}</h3>
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
                maxLength={VALIDATION_RULES.PRODUCT_NAME.MAX_LENGTH}
                required
                disabled={loading || isSubmitting}
              />
              {errors.name && touched.name && (
                <span className="error-text">{errors.name}</span>
              )}
              <div className="input-help">
                {formData.name.length}/{VALIDATION_RULES.PRODUCT_NAME.MAX_LENGTH} characters
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
              Description
              <span className="optional-text">(Optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`form-textarea ${errors.description && touched.description ? 'error' : ''}`}
              placeholder="Enter product description"
              rows="4"
              maxLength={maxDescriptionLength}
              disabled={loading || isSubmitting}
            />
            {errors.description && touched.description && (
              <span className="error-text">{errors.description}</span>
            )}
            <div className={`character-counter ${descriptionLength > maxDescriptionLength * 0.9 ? 'warning' : ''}`}>
              {descriptionLength}/{maxDescriptionLength} characters
            </div>
          </div>

          {/* Image URL - Full Width */}
          <div className="form-group">
            <label htmlFor="imageUrl" className="form-label">
              Image URL
              <span className="optional-text">(Optional)</span>
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
          {formData.imageUrl && isValidUrl(formData.imageUrl) && (
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

          {/* Debug Info - Remove this in production */}
          {import.meta.env.MODE === 'development' && (
            <div style={{ 
              padding: '1rem', 
              background: '#f0f0f0', 
              borderRadius: '4px', 
              fontSize: '12px',
              marginTop: '1rem'
            }}>
              <strong>Debug Info:</strong><br/>
              Form Valid: {isFormValid() ? 'Yes' : 'No'}<br/>
              Name: {formData.name} (length: {formData.name.length})<br/>
              Price: {formData.price} (valid: {!isNaN(parseFloat(formData.price)) && parseFloat(formData.price) > 0 ? 'Yes' : 'No'})<br/>
              Category: {formData.category}<br/>
              Stock: {formData.stock} (valid: {!isNaN(parseInt(formData.stock)) && parseInt(formData.stock) >= 0 ? 'Yes' : 'No'})<br/>
              Errors: {JSON.stringify(errors)}<br/>
              Touched: {JSON.stringify(touched)}
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
            
            {!product && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                disabled={loading || isSubmitting || !hasChanges}
              >
                Reset
              </Button>
            )}
            
            <Button
              type="submit"
              variant="primary"
              loading={loading || isSubmitting}
              disabled={!isFormValid() || loading || isSubmitting}
            >
              {loading || isSubmitting ? 'Saving...' : submitText}
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