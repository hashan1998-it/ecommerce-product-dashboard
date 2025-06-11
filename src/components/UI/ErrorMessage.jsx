import React from 'react';
import Button from './Button';
import Card from './Card';
import './ErrorMessage.css';

const ErrorMessage = ({ 
  error, 
  onRetry, 
  onDismiss,
  title = 'Something went wrong',
  showRetry = true,
  showDismiss = true,
  variant = 'error'
}) => {
  if (!error) return null;

  return (
    <Card className={`error-message error-message-${variant}`}>
      <Card.Body>
        <div className="error-content">
          <div className="error-icon">
            {variant === 'error' && '⚠️'}
            {variant === 'warning' && '⚠️'}
            {variant === 'info' && 'ℹ️'}
          </div>
          <div className="error-details">
            <h4 className="error-title">{title}</h4>
            <p className="error-description">
              {typeof error === 'string' ? error : error.message || 'An unexpected error occurred'}
            </p>
          </div>
        </div>
      </Card.Body>
      {(showRetry || showDismiss) && (
        <Card.Footer className="error-actions">
          {showDismiss && (
            <Button 
              variant="ghost" 
              size="small"
              onClick={onDismiss}
            >
              Dismiss
            </Button>
          )}
          {showRetry && (
            <Button 
              variant="primary" 
              size="small"
              onClick={onRetry}
            >
              Try Again
            </Button>
          )}
        </Card.Footer>
      )}
    </Card>
  );
};

export default ErrorMessage;