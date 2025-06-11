import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary',
  text = '',
  fullScreen = false,
  className = ''
}) => {
  const spinnerClass = `
    loading-spinner 
    loading-spinner-${size} 
    loading-spinner-${color}
    ${className}
  `.trim();

  const containerClass = `
    loading-container
    ${fullScreen ? 'loading-fullscreen' : ''}
  `.trim();

  return (
    <div className={containerClass}>
      <div className={spinnerClass}></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;