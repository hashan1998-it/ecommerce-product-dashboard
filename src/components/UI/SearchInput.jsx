import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDebounce } from '../../hooks';
import './SearchInput.css';

const SearchInput = React.memo(({ 
  value = '',
  onChange,
  onClear,
  placeholder = 'Search products...',
  debounceDelay = 300,
  disabled = false,
  showResultsCount = true,
  resultsCount = 0,
  totalCount = 0,
  className = ''
}) => {
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce(inputValue, debounceDelay);
  const inputRef = useRef(null);

  // Update parent when debounced value changes, but not when clearing
  useEffect(() => {
    if (onChange) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange]);

  // Sync with external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setInputValue('');
    // Focus back to input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // Call onClear if provided, which should handle the parent state update
    if (onClear) {
      onClear();
    }
  }, [onClear]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  }, [handleClear]);

  const hasValue = inputValue.length > 0;
  const isSearching = inputValue !== debouncedValue && hasValue;

  return (
    <div className={`search-input-container ${className}`}>
      <div className="search-input-wrapper">
        <div className="search-icon">
          {isSearching ? (
            <div className="search-spinner" />
          ) : (
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`search-input ${hasValue ? 'has-value' : ''}`}
          autoComplete="off"
          spellCheck="false"
          aria-label={placeholder}
        />
        
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="search-clear-button"
            disabled={disabled}
            aria-label="Clear search"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
      
      {showResultsCount && hasValue && !isSearching && (
        <div className="search-results-count">
          {resultsCount === 0 ? (
            <span className="no-results">No products found</span>
          ) : (
            <span className="results-found">
              Found {resultsCount} of {totalCount} product{resultsCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

// Add display name for better debugging
SearchInput.displayName = 'SearchInput';

SearchInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  placeholder: PropTypes.string,
  debounceDelay: PropTypes.number,
  disabled: PropTypes.bool,
  showResultsCount: PropTypes.bool,
  resultsCount: PropTypes.number,
  totalCount: PropTypes.number,
  className: PropTypes.string
};

export default SearchInput;