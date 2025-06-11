/* eslint-disable no-undef */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductGrid from '../../components/Product/ProductGrid';
import { createMockProducts } from '../setup';

// Mock ProductCard component
vi.mock('../../components/Product/ProductCard', () => ({
  default: function MockProductCard({ product }) {
    return <div data-testid={`product-card-${product.id}`}>{product.name}</div>;
  }
}));

describe('ProductGrid', () => {
  const mockProducts = createMockProducts(3);
  const mockHandlers = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onView: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders products correctly', () => {
    render(<ProductGrid products={mockProducts} {...mockHandlers} />);
    
    mockProducts.forEach(product => {
      expect(screen.getByTestId(`product-card-${product.id}`)).toBeInTheDocument();
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it('shows loading skeleton when loading', () => {
    render(<ProductGrid products={[]} loading={true} {...mockHandlers} />);
    
    const skeletons = document.querySelectorAll('.product-card-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows empty state when no products', () => {
    render(<ProductGrid products={[]} loading={false} {...mockHandlers} />);
    
    expect(screen.getByText('No products found')).toBeInTheDocument();
    expect(screen.getByText(/Try adjusting your search/)).toBeInTheDocument();
  });

  it('shows custom empty message', () => {
    const customMessage = 'Custom empty message';
    const customDescription = 'Custom description';
    
    render(
      <ProductGrid 
        products={[]} 
        loading={false}
        emptyMessage={customMessage}
        emptyDescription={customDescription}
        {...mockHandlers} 
      />
    );
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
    expect(screen.getByText(customDescription)).toBeInTheDocument();
  });

  it('handles null or undefined products gracefully', () => {
    render(<ProductGrid products={null} loading={false} {...mockHandlers} />);
    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<ProductGrid products={mockProducts} {...mockHandlers} />);
    
    expect(container.querySelector('.product-grid-container')).toBeInTheDocument();
    expect(container.querySelector('.product-grid')).toBeInTheDocument();
  });
});