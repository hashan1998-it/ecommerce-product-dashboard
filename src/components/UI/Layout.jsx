import React from 'react';
import Header from './Header';
import './Layout.css';

const Layout = ({ children, productCount = 0 }) => {
  return (
    <div className="layout">
      <Header productCount={productCount} />
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;