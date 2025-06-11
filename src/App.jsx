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

  // Demo function to add sample products for testing search
  const handleAddSampleProducts = async () => {
    const sampleProducts = [
      {
        name: "iPhone 15 Pro Max",
        price: 1199.99,
        stock: 25,
        category: "Electronics",
        description: "Latest Apple smartphone with titanium design and advanced camera system"
      },
      {
        name: "MacBook Air M3",
        price: 1299.99,
        stock: 15,
        category: "Electronics",
        description: "Ultra-thin laptop with M3 chip for incredible performance"
      },
      {
        name: "Nike Air Jordan 1",
        price: 169.99,
        stock: 30,
        category: "Sports",
        description: "Classic basketball shoes with iconic design"
      },
      {
        name: "Levi's 501 Original Jeans",
        price: 89.99,
        stock: 50,
        category: "Clothing",
        description: "Classic straight-fit jeans in premium denim"
      },
      {
        name: "JavaScript: The Good Parts",
        price: 29.99,
        stock: 100,
        category: "Books",
        description: "Essential guide to JavaScript programming best practices"
      }
    ];

    try {
      for (const product of sampleProducts) {
        await addProduct(product);
      }
      showNotification(`Added ${sampleProducts.length} sample products for testing!`, "success");
    } catch (error) {
      showNotification(`Failed to add sample products: ${error.message}`, "error");
    }
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

        {/* Demo Controls for Search Testing */}
        {products.length === 0 && !loading && (
          <Card className="demo-controls">
            <Card.Header>
              <h3>🔍 Test Real-time Search</h3>
            </Card.Header>
            <Card.Body>
              <p>
                Add sample products to test the real-time search functionality with debounced input, 
                case-insensitive matching, and live results count.
              </p>
              <div className="demo-buttons">
                <Button 
                  variant="primary" 
                  onClick={handleAddSampleProducts}
                  disabled={loading}
                >
                  🚀 Add Sample Products
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleAddNewProduct}
                  disabled={loading}
                >
                  ➕ Add Single Product
                </Button>
              </div>
              
              <div className="demo-info">
                <h4>✨ Search Features:</h4>
                <ul>
                  <li><strong>Real-time Search:</strong> 300ms debounced input for smooth performance</li>
                  <li><strong>Smart Matching:</strong> Searches product names, descriptions, and categories</li>
                  <li><strong>Case Insensitive:</strong> Find products regardless of capitalization</li>
                  <li><strong>Live Results:</strong> See result count update as you type</li>
                  <li><strong>Quick Clear:</strong> Clear search with escape key or clear button</li>
                  <li><strong>Filter Integration:</strong> Works seamlessly with existing filters</li>
                </ul>
                <div className="demo-hint">
                  💡 <strong>Try searching for:</strong> "iPhone", "nike", "javascript", "denim", or "camera"
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

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
            showSearch={true}
          />
        )}
      </div>
    </Layout>
  );
}

export default App;