import React from 'react';
import Layout from './components/UI/Layout';
import Card from './components/UI/Card';
import Button from './components/UI/Button';
import './App.css';

function App() {
  // Mock data for demonstration
  const mockProductCount = 0;

  return (
    <Layout productCount={mockProductCount}>
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
          <h3>Component Showcase</h3>
          <div className="component-demo">
            <Card className="demo-card">
              <Card.Header>Button Variants</Card.Header>
              <Card.Body>
                <div className="button-showcase">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
                <div className="button-showcase">
                  <Button size="small">Small</Button>
                  <Button size="medium">Medium</Button>
                  <Button size="large">Large</Button>
                </div>
                <div className="button-showcase">
                  <Button loading>Loading...</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </Card.Body>
            </Card>

            <Card className="demo-card">
              <Card.Header>Card Variants</Card.Header>
              <Card.Body>
                <div className="card-showcase">
                  <Card variant="primary" padding="small">
                    <Card.Body>Primary Card</Card.Body>
                  </Card>
                  <Card variant="success" padding="small">
                    <Card.Body>Success Card</Card.Body>
                  </Card>
                  <Card variant="warning" padding="small">
                    <Card.Body>Warning Card</Card.Body>
                  </Card>
                  <Card variant="danger" padding="small">
                    <Card.Body>Danger Card</Card.Body>
                  </Card>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;