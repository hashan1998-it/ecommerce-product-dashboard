import React, { useState, useEffect } from 'react';
import Layout from './components/UI/Layout';
import { ProductList } from './components/Product';
import { sampleProducts } from './utils';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const loadProducts = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProducts(sampleProducts);
      setLoading(false);
    };

    loadProducts();
  }, []);

  const handleEditProduct = (product) => {
    console.log('Edit product:', product);
    // TODO: Implement edit functionality
  };

  const handleDeleteProduct = (product) => {
    console.log('Delete product:', product);
    // TODO: Implement delete functionality
  };

  const handleViewProduct = (product) => {
    console.log('View product:', product);
    // TODO: Implement view functionality
  };

  const handleAddNewProduct = () => {
    console.log('Add new product');
    // TODO: Implement add functionality
  };

  return (
    <Layout productCount={products.length}>
      <div className="app-content">
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
      </div>
    </Layout>
  );
}

export default App;