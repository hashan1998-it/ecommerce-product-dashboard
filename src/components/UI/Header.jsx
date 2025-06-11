import React from 'react';
import './Header.css';

const Header = ({ productCount = 0 }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-brand">
            <h1 className="header-title">E-Commerce Dashboard</h1>
            <p className="header-subtitle">Product Management System</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{productCount}</span>
              <span className="stat-label">
                {productCount === 1 ? 'Product' : 'Products'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;