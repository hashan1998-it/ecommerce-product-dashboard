/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorMessage from '../../components/UI/ErrorMessage';

describe('ErrorMessage', () => {
  const mockError = 'Something went wrong';
  const mockOnRetry = vi.fn();
  const mockOnDismiss = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when no error is provided', () => {
    const { container } = render(<ErrorMessage error={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders error message with string error', () => {
    render(<ErrorMessage error={mockError} />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(mockError)).toBeInTheDocument();
  });

  it('renders error message with Error object', () => {
    const errorObj = new Error('Test error message');
    render(<ErrorMessage error={errorObj} />);
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    render(
      <ErrorMessage 
        error={mockError} 
        onRetry={mockOnRetry}
        showRetry={true}
      />
    );
    
    fireEvent.click(screen.getByText('Try Again'));
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    render(
      <ErrorMessage 
        error={mockError} 
        onDismiss={mockOnDismiss}
        showDismiss={true}
      />
    );
    
    fireEvent.click(screen.getByText('Dismiss'));
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders custom title', () => {
    const customTitle = 'Custom Error Title';
    render(<ErrorMessage error={mockError} title={customTitle} />);
    
    expect(screen.getByText(customTitle)).toBeInTheDocument();
  });

  it('applies correct variant class', () => {
    const { container } = render(
      <ErrorMessage error={mockError} variant="warning" />
    );
    
    expect(container.querySelector('.error-message-warning')).toBeInTheDocument();
  });

  it('hides retry button when showRetry is false', () => {
    render(
      <ErrorMessage 
        error={mockError} 
        showRetry={false}
      />
    );
    
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });

  it('hides dismiss button when showDismiss is false', () => {
    render(
      <ErrorMessage 
        error={mockError} 
        showDismiss={false}
      />
    );
    
    expect(screen.queryByText('Dismiss')).not.toBeInTheDocument();
  });
});