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
    console.log('App: handleAddProduct called with:', productData);
    try {
      const newProduct = await addProduct(productData);
      console.log('App: Product added successfully:', newProduct);
      showNotification(`Successfully added "${newProduct.name}"!`, "success");
      setShowAddModal(false);
      return newProduct;
    } catch (error) {
      console.error('App: Failed to add product:', error);
      showNotification(`Failed to add product: ${error.message}`, "error");
      throw error; // Re-throw to let form handle the error state
    }
  };

  // Handle edit product form submission
  const handleEditProduct = async (productData) => {
    console.log('App: handleEditProduct called with:', productData);
    try {
      const updatedProduct = await updateProduct(
        editingProduct.id,
        productData
      );
      console.log('App: Product updated successfully:', updatedProduct);
      showNotification(
        `Successfully updated "${productData.name}"!`,
        "success"
      );
      setEditingProduct(null);
      return updatedProduct;
    } catch (error) {
      console.error('App: Failed to update product:', error);
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
    console.log('App: Edit product clicked:', product);
    setEditingProduct(product);
  };

  const handleDeleteProductClick = (product) => {
    console.log('App: Delete product clicked:', product);
    setDeletingProduct(product);
  };

  const handleViewProduct = (product) => {
    console.log('App: View product clicked:', product);
    showNotification(
      `Viewing "${product.name}" - Price: $${product.price}`,
      "info"
    );
  };

  const handleAddNewProduct = () => {
    console.log('App: Add new product clicked');
    setShowAddModal(true);
  };

  const handleRetryLoad = () => {
    clearError();
    refreshProducts();
  };

  // Close modals
  const handleCloseAddModal = () => {
    console.log('App: Close add modal');
    setShowAddModal(false);
  };

  const handleCloseEditModal = () => {
    console.log('App: Close edit modal');
    setEditingProduct(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeletingProduct(null);
  };

  // Demo function to add sample products for testing
  const handleAddSampleProducts = async () => {
    console.log('App: Adding sample products');
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
      },
      {
        name: "Sony WH-1000XM5",
        price: 399.99,
        stock: 0,
        category: "Electronics",
        description: "Premium wireless noise-canceling headphones"
      },
      {
        name: "KitchenAid Stand Mixer",
        price: 349.99,
        stock: 3,
        category: "Home",
        description: "Professional-grade stand mixer for baking enthusiasts"
      }
    ];

    try {
      let addedCount = 0;
      for (const productData of sampleProducts) {
        try {
          await addProduct(productData);
          addedCount++;
        } catch (error) {
          console.error('Failed to add sample product:', productData.name, error);
        }
      }
      showNotification(`Added ${addedCount} sample products for testing!`, "success");
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

        {/* Demo Controls for Testing */}
        {products.length === 0 && !loading && (
          <Card className="demo-controls">
            <Card.Header>
              <h3>🔍 Test Complete Product Dashboard</h3>
            </Card.Header>
            <Card.Body>
              <p>
                Add sample products to test the complete product management system with 
                real-time search, advanced filtering, and full CRUD operations.
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
                <h4>✨ Complete Features:</h4>
                <ul>
                  <li><strong>Real-time Search:</strong> 300ms debounced input for smooth performance</li>
                  <li><strong>Advanced Filtering:</strong> Category, price range, and stock status filters</li>
                  <li><strong>Smart Matching:</strong> Searches product names, descriptions, and categories</li>
                  <li><strong>Complete CRUD:</strong> Create, read, update, and delete operations</li>
                  <li><strong>Form Validation:</strong> Real-time validation with detailed error messages</li>
                  <li><strong>Data Persistence:</strong> LocalStorage integration with error handling</li>
                  <li><strong>Responsive Design:</strong> Mobile-first approach with touch-friendly UI</li>
                  <li><strong>Performance Optimized:</strong> React.memo and memoized callbacks</li>
                </ul>
                <div className="demo-hint">
                  💡 <strong>Try these features:</strong> Search "iPhone", filter by category, 
                  set price ranges, edit products, and test the responsive design!
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