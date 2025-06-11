/* eslint-disable no-undef */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    
    const spinner = document.querySelector('.loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('loading-spinner-medium');
    expect(spinner).toHaveClass('loading-spinner-primary');
  });

  it('renders with custom size', () => {
    render(<LoadingSpinner size="large" />);
    
    const spinner = document.querySelector('.loading-spinner');
    expect(spinner).toHaveClass('loading-spinner-large');
  });

  it('renders with custom color', () => {
    render(<LoadingSpinner color="success" />);
    
    const spinner = document.querySelector('.loading-spinner');
    expect(spinner).toHaveClass('loading-spinner-success');
  });

  it('renders with text', () => {
    const text = 'Loading data...';
    render(<LoadingSpinner text={text} />);
    
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('renders in fullscreen mode', () => {
    render(<LoadingSpinner fullScreen />);
    
    const container = document.querySelector('.loading-container');
    expect(container).toHaveClass('loading-fullscreen');
  });

  it('applies custom className', () => {
    const customClass = 'custom-spinner';
    render(<LoadingSpinner className={customClass} />);
    
    const spinner = document.querySelector('.loading-spinner');
    expect(spinner).toHaveClass(customClass);
  });
});