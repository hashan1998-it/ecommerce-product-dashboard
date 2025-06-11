import React, { useState } from 'react';
import Layout from './components/UI/Layout';
import { ProductList } from './components/Product';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorMessage from './components/UI/ErrorMessage';
import Button from './components/UI/Button';
import Card from './components/UI/Card';
import { useProducts } from './hooks';
import { PRODUCT_CATEGORIES } from './utils';
import './App.css';

function App() {
  const {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    clearError,
    refreshProducts,
    count
  } = useProducts({
    autoLoad: true,
    persistToLocalStorage: true
  });

  const [notification, setNotification] = useState(null);
  const [showDemo, setShowDemo] = useState(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Demo function to add a sample product
  const handleDemoAddProduct = async () => {
    try {
      const sampleProduct = {
        name: `Demo Product ${Date.now()}`,
        description: 'This is a demo product created to test the addProduct functionality',
        price: Math.round((Math.random() * 500 + 50) * 100) / 100,
        category: PRODUCT_CATEGORIES[Math.floor(Math.random() * PRODUCT_CATEGORIES.length)],
        stock: Math.floor(Math.random() * 50 + 1),
        imageUrl: 'https://via.placeholder.com/300x200/667eea/ffffff?text=Demo+Product'
      };

      const newProduct = await addProduct(sampleProduct);
      showNotification(`Successfully added "${newProduct.name}"!`, 'success');
    } catch (error) {
      showNotification(`Failed to add product: ${error.message}`, 'error');
    }
  };

  // Demo function to update the first product
  const handleDemoUpdateProduct = async () => {
    try {
      if (products.length === 0) {
        showNotification('No products to update. Add a product first!', 'warning');
        return;
      }

      const firstProduct = products[0];
      const updates = {
        name: `${firstProduct.name} (Updated)`,
        price: Math.round((firstProduct.price * 1.1) * 100) / 100, // 10% price increase
        stock: Math.max(0, firstProduct.stock - 1)
      };

      await updateProduct(firstProduct.id, updates);
      showNotification(`Successfully updated "${firstProduct.name}"!`, 'success');
    } catch (error) {
      showNotification(`Failed to update product: ${error.message}`, 'error');
    }
  };

  // Demo function to add multiple products
  const handleDemoAddMultiple = async () => {
    const demoProducts = [
      {
        name: 'Demo Laptop',
        description: 'High-performance laptop for testing',
        price: 1299.99,
        category: 'Electronics',
        stock: 5,
        imageUrl: 'https://via.placeholder.com/300x200/1565c0/ffffff?text=Demo+Laptop'
      },
      {
        name: 'Demo Book',
        description: 'Educational book for testing',
        price: 29.99,
        category: 'Books',
        stock: 15,
        imageUrl: 'https://via.placeholder.com/300x200/8e44ad/ffffff?text=Demo+Book'
      },
      {
        name: 'Demo Shoes',
        description: 'Comfortable running shoes for testing',
        price: 89.99,
        category: 'Sports',
        stock: 8,
        imageUrl: 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=Demo+Shoes'
      }
    ];

    try {
      showNotification('Adding multiple products...', 'info');
      
      for (const productData of demoProducts) {
        await addProduct(productData);
      }
      
      showNotification(`Successfully added ${demoProducts.length} demo products!`, 'success');
    } catch (error) {
      showNotification(`Failed to add products: ${error.message}`, 'error');
    }
  };

  const handleEditProduct = async (product) => {
    try {
      // Demo edit: Just update the name and price
      const updates = {
        name: `${product.name} (Edited)`,
        price: Math.round((product.price * 0.9) * 100) / 100 // 10% discount
      };
      
      await updateProduct(product.id, updates);
      showNotification(`"${product.name}" has been updated successfully`, 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleDeleteProduct = async (product) => {
    try {
      if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
        await deleteProduct(product.id);
        showNotification(`"${product.name}" has been deleted successfully`, 'success');
      }
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleViewProduct = (product) => {
    showNotification(`Viewing "${product.name}" - Price: $${product.price}`, 'info');
  };

  const handleAddNewProduct = () => {
    showNotification('Click "Demo Add Product" button to test the addProduct function!', 'info');
  };

  const handleRetryLoad = () => {
    clearError();
    refreshProducts();
  };

  return (
    <Layout productCount={count}>
      <div className="app-content">
        {/* Global Error Display */}
        {error && (
          <ErrorMessage
            error={error}
            onRetry={handleRetryLoad}
            onDismiss={clearError}
            title="Failed to load products"
          />
        )}

        {/* Notification */}
        {notification && (
          <div className={`notification notification-${notification.type}`}>
            {notification.message}
          </div>
        )}

        {/* Demo Controls */}
        <Card className="demo-controls">
          <Card.Header>
            <h3>🚀 State Management Demo</h3>
          </Card.Header>
          <Card.Body>
            <p>
              Test the <strong>useProducts</strong> hook with real CRUD operations! 
              These buttons demonstrate the <code>addProduct</code> and <code>updateProduct</code> functions in action.
            </p>
            <div className="demo-buttons">
              <Button 
                variant="primary" 
                onClick={handleDemoAddProduct}
                disabled={loading}
              >
                🆕 Demo Add Product
              </Button>
              
              <Button 
                variant="success" 
                onClick={handleDemoUpdateProduct}
                disabled={loading || products.length === 0}
              >
                ✏️ Demo Update First Product
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={handleDemoAddMultiple}
                disabled={loading}
              >
                📦 Add Multiple Demo Products
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setShowDemo(!showDemo)}
              >
                {showDemo ? 'Hide' : 'Show'} Implementation Details
              </Button>
            </div>
            
            {showDemo && (
              <div className="demo-info">
                <h4>🔧 What's happening:</h4>
                <ul>
                  <li><strong>Add Product:</strong> Uses <code>addProduct()</code> with validation and localStorage persistence</li>
                  <li><strong>Update Product:</strong> Uses <code>updateProduct()</code> with optimistic updates</li>
                  <li><strong>Delete Product:</strong> Uses <code>deleteProduct()</code> with confirmation</li>
                  <li><strong>State Management:</strong> All operations go through useReducer with proper loading/error states</li>
                  <li><strong>Persistence:</strong> Changes are automatically saved to localStorage</li>
                </ul>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Main Content */}
        {loading && products.length === 0 ? (
          <div className="loading-container">
            <LoadingSpinner 
              size="large" 
              text="Loading products..." 
            />
          </div>
        ) : (
          <ProductList
            products={products}
            loading={loading}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onView={handleViewProduct}
            onAddNew={handleAddNewProduct}
            title="Product Catalog"
            showStats={true}
            showAddButton={true}
          />
        )}
      </div>
    </Layout>
  );
}

export default App;