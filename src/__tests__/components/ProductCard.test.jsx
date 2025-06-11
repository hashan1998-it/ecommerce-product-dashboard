/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from '../../components/Product/ProductCard';
import { createMockProduct } from '../setup';

// Mock the utils module
vi.mock('../../utils', () => ({
  formatPrice: vi.fn((price) => `$${price.toFixed(2)}`),
  truncateText: vi.fn((text, length) => text.length > length ? text.slice(0, length) + '...' : text),
  getStockStatus: vi.fn(() => 'in_stock'),
  STOCK_STATUS_LABELS: {
    in_stock: 'In Stock',
    low_stock: 'Low Stock',
    out_of_stock: 'Out of Stock'
  },
  STOCK_STATUS_COLORS: {
    in_stock: '#28a745',
    low_stock: '#ffc107',
    out_of_stock: '#dc3545'
  },
  FALLBACK_IMAGE: 'data:image/svg+xml;base64,fallback'
}));

describe('ProductCard', () => {
  const mockProduct = createMockProduct();
  const mockHandlers = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onView: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} {...mockHandlers} />);
    
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
    expect(screen.getByText(`${mockProduct.stock} units`)).toBeInTheDocument();
  });

  it('displays product image with fallback', () => {
    render(<ProductCard product={mockProduct} {...mockHandlers} />);
    
    const image = screen.getByAltText(mockProduct.name);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockProduct.imageUrl);
  });

  it('shows stock status badge', () => {
    render(<ProductCard product={mockProduct} {...mockHandlers} />);
    
    const stockBadge = screen.getByText('In Stock');
    expect(stockBadge).toBeInTheDocument();
    expect(stockBadge).toHaveClass('product-stock-badge');
  });

  it('calls appropriate handlers when buttons are clicked', () => {
    render(<ProductCard product={mockProduct} {...mockHandlers} />);
    
    fireEvent.click(screen.getByText('View'));
    expect(mockHandlers.onView).toHaveBeenCalledWith(mockProduct);
    
    fireEvent.click(screen.getByText('Edit'));
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockProduct);
    
    fireEvent.click(screen.getByText('Delete'));
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockProduct);
  });

  it('hides actions when showActions is false', () => {
    render(<ProductCard product={mockProduct} showActions={false} />);
    
    expect(screen.queryByText('View')).not.toBeInTheDocument();
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('handles missing description gracefully', () => {
    const productWithoutDescription = createMockProduct({ description: '' });
    render(<ProductCard product={productWithoutDescription} {...mockHandlers} />);
    
    expect(screen.getByText('No description available')).toBeInTheDocument();
  });

  it('handles image error correctly', () => {
    render(<ProductCard product={mockProduct} {...mockHandlers} />);
    
    const image = screen.getByAltText(mockProduct.name);
    
    // Simulate image error
    fireEvent.error(image);
    
    // Image src should change to fallback
    expect(image).toHaveAttribute('src', 'data:image/svg+xml;base64,fallback');
  });

  it('applies correct CSS classes', () => {
    render(<ProductCard product={mockProduct} {...mockHandlers} />);
    
    const card = screen.getByText(mockProduct.name).closest('.product-card');
    expect(card).toHaveClass('product-card');
  });

  it('shows loading attribute on image for lazy loading', () => {
    render(<ProductCard product={mockProduct} {...mockHandlers} />);
    
    const image = screen.getByAltText(mockProduct.name);
    expect(image).toHaveAttribute('loading', 'lazy');
  });
});