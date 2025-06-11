import React, { useState, useEffect } from 'react';
import Layout from './components/UI/Layout';
import Card from './components/UI/Card';
import Button from './components/UI/Button';
import { sampleProducts, getProductStats, PRODUCT_CATEGORIES, FALLBACK_IMAGE } from './utils';
import './App.css';

function App() {
  const [products] = useState(sampleProducts);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Calculate product statistics
    const productStats = getProductStats(products);
    setStats(productStats);
  }, [products]);

  const handleImageError = (e) => {
    e.target.src = FALLBACK_IMAGE;
  };

  return (
    <Layout productCount={products.length}>
      <div className="app-content">
        <div className="welcome-section">
          <Card className="welcome-card" hover>
            <Card.Header>
              <h2>Welcome to Product Dashboard</h2>
            </Card.Header>
            <Card.Body>
              <p>
                Manage your e-commerce product catalog with ease. Add, edit, search, 
                and filter products with our comprehensive dashboard.
              </p>
              
              {stats && (
                <div className="stats-grid">
                  <div className="stat-card">
                    <span className="stat-number">{stats.total}</span>
                    <span className="stat-label">Total Products</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">{stats.inStock}</span>
                    <span className="stat-label">In Stock</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">{stats.lowStock}</span>
                    <span className="stat-label">Low Stock</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">{stats.outOfStock}</span>
                    <span className="stat-label">Out of Stock</span>
                  </div>
                </div>
              )}

              <div className="feature-list">
                <div className="feature-item">
                  <span className="feature-icon">📦</span>
                  <span>Complete CRUD Operations</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔍</span>
                  <span>Advanced Search & Filtering</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📱</span>
                  <span>Responsive Design</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💾</span>
                  <span>Local Storage Persistence</span>
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <Button variant="outline" size="small">
                Learn More
              </Button>
              <Button variant="primary" size="small">
                Get Started
              </Button>
            </Card.Footer>
          </Card>
        </div>

        <div className="demo-section">
          <h3>Product Data Overview</h3>
          <div className="data-showcase">
            <Card className="demo-card">
              <Card.Header>Product Categories</Card.Header>
              <Card.Body>
                <div className="categories-grid">
                  {PRODUCT_CATEGORIES.map(category => (
                    <div key={category} className="category-item">
                      <span className="category-name">{category}</span>
                      <span className="category-count">
                        {stats?.categories[category] || 0} products
                      </span>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            <Card className="demo-card">
              <Card.Header>Sample Products Preview</Card.Header>
              <Card.Body>
                <div className="products-preview">
                  {products.slice(0, 3).map(product => (
                    <div key={product.id} className="product-preview-item">
                      <div className="product-preview-image">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          onError={handleImageError}
                        />
                      </div>
                      <div className="product-preview-info">
                        <h4>{product.name}</h4>
                        <p>${product.price}</p>
                        <span className="category-tag">{product.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-muted">
                  ...and {products.length - 3} more products ready for management
                </p>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;