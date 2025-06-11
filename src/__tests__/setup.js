/* eslint-disable no-undef */
import { render } from '@testing-library/react';

// Custom render function that includes providers if needed
export const renderWithProviders = (ui, options = {}) => {
  return render(ui, {
    // Add providers here if you add Context later
    ...options,
  });
};

// Mock functions for common use cases
export const createMockProduct = (overrides = {}) => ({
  id: '1',
  name: 'Test Product',
  description: 'Test description',
  price: 99.99,
  category: 'Electronics',
  stock: 10,
  imageUrl: 'data:image/svg+xml;base64,test',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  ...overrides,
});

export const createMockProducts = (count = 3) => {
  return Array.from({ length: count }, (_, index) => 
    createMockProduct({
      id: (index + 1).toString(),
      name: `Test Product ${index + 1}`,
      price: 99.99 + index * 10,
      stock: 10 - index * 2,
    })
  );
};

// Mock timers utility
export const mockTimers = () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });
};

// Mock fetch utility
export const mockFetch = (mockResponse) => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })
  );
};