import React, { useState } from 'react';
import Layout from './components/UI/Layout';
import Modal from './components/UI/Modal';
import { ProductList } from './components/Product';
import { ProductForm } from './components/Forms';
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDemo, setShowDemo] = useState(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle add product form submission
  const handleAddProduct = async (productData) => {
    try {
      const newProduct = await addProduct(productData);
      showNotification(`Successfully added "${newProduct.name}"!`, 'success');
      setShowAddModal(false);
    } catch (error) {
      showNotification(`Failed to add product: ${error.message}`, 'error');
      throw error; // Re-throw to let form handle the error state
    }
  };

  // Handle edit product form submission
  const handleEditProduct = async (productData) => {
    try {
      await updateProduct(editingProduct.id, productData);
      showNotification(`Successfully updated "${productData.name}"!`, 'success');
      setEditingProduct(null);
    } catch (error) {
      showNotification(`Failed to update product: ${error.message}`, 'error');
      throw error; // Re-throw to let form handle the error state
    }
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
        imageUrl: ''
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
        price: Math.round((firstProduct.price * 1.1) * 100) / 100,
        stock: Math.max(0, firstProduct.stock - 1)
      };

      await updateProduct(firstProduct.id, updates);
      showNotification(`Successfully updated "${firstProduct.name}"!`, 'success');
    } catch (error) {
      showNotification(`Failed to update product: ${error.message}`, 'error');
    }
  };

  // Handle product actions
  const handleEditProductClick = (product) => {
    setEditingProduct(product);
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
    showNotification(`Viewing "${product.name}" - Price: ${product.price}`, 'info');
  };

  const handleAddNewProduct = () => {
    setShowAddModal(true);
  };

  const handleRetryLoad = () => {
    clearError();
    refreshProducts();
  };

  // Close modals
  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleCloseEditModal = () => {
    setEditingProduct(null);
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
            <h3>🚀 Product Form Demo</h3>
          </Card.Header>
          <Card.Body>
            <p>
              Test the new <strong>ProductForm</strong> component with real-time validation! 
              Use the "Add Product" button for the full form experience.
            </p>
            <div className="demo-buttons">
              <Button 
                variant="primary" 
                onClick={handleAddNewProduct}
                disabled={loading}
              >
                ➕ Add Product (Form)
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
                onClick={handleDemoAddProduct}
                disabled={loading}
              >
                🎲 Quick Add Demo Product
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setShowDemo(!showDemo)}
              >
                {showDemo ? 'Hide' : 'Show'} Form Features
              </Button>
            </div>
            
            {showDemo && (
              <div className="demo-info">
                <h4>✨ ProductForm Features:</h4>
                <ul>
                  <li><strong>Real-time Validation:</strong> Instant feedback as you type</li>
                  <li><strong>Character Counters:</strong> Visual indicators for field limits</li>
                  <li><strong>Image Preview:</strong> See images before submitting</li>
                  <li><strong>Form Reset:</strong> Clear all fields with one click</li>
                  <li><strong>Error Handling:</strong> User-friendly validation messages</li>
                  <li><strong>Loading States:</strong> Disabled form during submission</li>
                  <li><strong>Modal Integration:</strong> Clean popup interface</li>
                </ul>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Add Product Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={handleCloseAddModal}
          title="Add New Product"
          size="large"
        >
          <ProductForm
            onSubmit={handleAddProduct}
            onCancel={handleCloseAddModal}
            loading={loading}
            submitText="Add Product"
            title="" // Title is handled by modal
          />
        </Modal>

        {/* Edit Product Modal */}
        <Modal
          isOpen={!!editingProduct}
          onClose={handleCloseEditModal}
          title="Edit Product"
          size="large"
        >
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSubmit={handleEditProduct}
              onCancel={handleCloseEditModal}
              loading={loading}
              submitText="Update Product"
              title="" // Title is handled by modal
            />
          )}
        </Modal>

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
            onEdit={handleEditProductClick}
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