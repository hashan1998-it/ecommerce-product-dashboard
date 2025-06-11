import React, { useState } from "react";
import Layout from "./components/UI/Layout";
import Modal from "./components/UI/Modal";
import ConfirmDialog from "./components/UI/ConfirmDialog";
import { ProductList } from "./components/Product";
import { ProductForm } from "./components/Forms";
import LoadingSpinner from "./components/UI/LoadingSpinner";
import ErrorMessage from "./components/UI/ErrorMessage";
import Button from "./components/UI/Button";
import Card from "./components/UI/Card";
import { useProducts } from "./hooks";
import { PRODUCT_CATEGORIES } from "./utils";
import "./App.css";

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
    count,
  } = useProducts({
    autoLoad: true,
    persistToLocalStorage: true,
  });

  const [notification, setNotification] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  // const [showDemo, setShowDemo] = useState(false);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle add product form submission
  const handleAddProduct = async (productData) => {
    try {
      const newProduct = await addProduct(productData);
      showNotification(`Successfully added "${newProduct.name}"!`, "success");
      setShowAddModal(false);
    } catch (error) {
      showNotification(`Failed to add product: ${error.message}`, "error");
      throw error; // Re-throw to let form handle the error state
    }
  };

  // Handle edit product form submission
  const handleEditProduct = async (productData) => {
    try {
      const updatedProduct = await updateProduct(
        editingProduct.id,
        productData
      );
      showNotification(
        `Successfully updated "${productData.name}"!`,
        "success"
      );
      setEditingProduct(null);
      return updatedProduct;
    } catch (error) {
      showNotification(`Failed to update product: ${error.message}`, "error");
      throw error; // Re-throw to let form handle the error state
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(deletingProduct.id);
      showNotification(
        `"${deletingProduct.name}" has been deleted successfully`,
        "success"
      );
      setDeletingProduct(null);
    } catch (error) {
      showNotification(`Failed to delete product: ${error.message}`, "error");
    }
  };

  // Demo function to update the first product
  // const handleDemoUpdateProduct = async () => {
  //   try {
  //     if (products.length === 0) {
  //       showNotification('No products to update. Add a product first!', 'warning');
  //       return;
  //     }

  //     const firstProduct = products[0];
  //     const updates = {
  //       name: `${firstProduct.name} (Updated)`,
  //       price: Math.round((firstProduct.price * 1.1) * 100) / 100,
  //       stock: Math.max(0, firstProduct.stock - 1)
  //     };

  //     await updateProduct(firstProduct.id, updates);
  //     showNotification(`Successfully updated "${firstProduct.name}"!`, 'success');
  //   } catch (error) {
  //     showNotification(`Failed to update product: ${error.message}`, 'error');
  //   }
  // };

  // Handle product actions
  const handleEditProductClick = (product) => {
    setEditingProduct(product);
  };

  const handleDeleteProductClick = (product) => {
    setDeletingProduct(product);
  };

  const handleViewProduct = (product) => {
    showNotification(
      `Viewing "${product.name}" - Price: ${product.price}`,
      "info"
    );
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

  const handleCloseDeleteDialog = () => {
    setDeletingProduct(null);
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
        {/* <Card className="demo-controls">
          <Card.Header>
            <h3>🚀 Enhanced Product Management</h3>
          </Card.Header>
          <Card.Body>
            <p>
              Experience the complete <strong>CRUD functionality</strong> with professional forms, 
              edit mode, and optimistic updates!
            </p>
            <div className="demo-buttons">
              <Button 
                variant="primary" 
                onClick={handleAddNewProduct}
                disabled={loading}
              >
                ➕ Add Product
              </Button>
              
              <Button 
                variant="success" 
                onClick={handleDemoUpdateProduct}
                disabled={loading || products.length === 0}
              >
                ✏️ Quick Update First Product
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={() => {
                  const demoProduct = {
                    name: `Demo Product ${products.length + 1}`,
                    price: 99.99,
                    stock: 10,
                    category: PRODUCT_CATEGORIES[0],
                    description: 'This is a demo product'
                  };
                  handleAddProduct(demoProduct);
                }}
                disabled={loading}
              >
                🎲 Quick Add Demo Product
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setShowDemo(!showDemo)}
              >
                {showDemo ? 'Hide' : 'Show'} Edit Features
              </Button>
            </div>
            
            {showDemo && (
              <div className="demo-info">
                <h4>✨ Edit Mode Features:</h4>
                <ul>
                  <li><strong>Pre-populated Forms:</strong> Existing data loads automatically</li>
                  <li><strong>Change Tracking:</strong> Visual indicators for modified fields</li>
                  <li><strong>Optimistic Updates:</strong> Immediate UI updates with rollback on error</li>
                  <li><strong>Smart Validation:</strong> Button enables when changes are valid</li>
                  <li><strong>Reset Functionality:</strong> Revert to original values</li>
                  <li><strong>Cancel Operation:</strong> Discard changes without saving</li>
                  <li><strong>Clear User Feedback:</strong> Success/error notifications</li>
                  <li><strong>Confirmation Dialogs:</strong> Prevent accidental deletions</li>
                </ul>
                <div className="demo-hint">
                  💡 <strong>Try it:</strong> Click "Edit" on any product to see the enhanced form experience!
                </div>
              </div>
            )}
          </Card.Body>
        </Card> */}

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

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={!!deletingProduct}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDeleteConfirm}
          title="Delete Product"
          message={
            deletingProduct
              ? `Are you sure you want to delete "${deletingProduct.name}"? This action cannot be undone.`
              : ""
          }
          confirmText="Delete Product"
          cancelText="Cancel"
          variant="danger"
          loading={loading}
        />

        {/* Main Content */}
        {loading && products.length === 0 ? (
          <div className="loading-container">
            <LoadingSpinner size="large" text="Loading products..." />
          </div>
        ) : (
          <ProductList
            products={products}
            loading={loading}
            onEdit={handleEditProductClick}
            onDelete={handleDeleteProductClick}
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
