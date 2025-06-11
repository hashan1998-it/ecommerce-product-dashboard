import React, { useState } from 'react';
import { FALLBACK_IMAGE } from '../../utils/constants';

const ImageWithFallback = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = FALLBACK_IMAGE,
  ...props 
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasErrored, setHasErrored] = useState(false);

  const handleError = () => {
    if (!hasErrored) {
      setHasErrored(true);
      setCurrentSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    // Reset error state if image loads successfully
    setHasErrored(false);
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      {...props}
    />
  );
};

export default ImageWithFallback;