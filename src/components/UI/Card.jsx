import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'normal',
  shadow = true,
  hover = false,
  ...props 
}) => {
  const cardClass = `
    card 
    card-${variant} 
    card-padding-${padding}
    ${shadow ? 'card-shadow' : ''} 
    ${hover ? 'card-hover' : ''} 
    ${className}
  `.trim();

  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`card-header ${className}`} {...props}>
    {children}
  </div>
);

const CardBody = ({ children, className = '', ...props }) => (
  <div className={`card-body ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`card-footer ${className}`} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;