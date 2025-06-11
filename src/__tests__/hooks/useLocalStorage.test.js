/* eslint-disable no-undef */
import { renderHook, act } from '@testing-library/react';
import useLocalStorage from '../../hooks/useLocalStorage';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return default value when localStorage is empty', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));
    
    expect(result.current[0]).toBe('default-value');
  });

  it('should return stored value when localStorage has data', () => {
    localStorageMock.getItem.mockReturnValue('"stored-value"');
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));
    
    expect(result.current[0]).toBe('stored-value');
  });

  it('should update localStorage when value changes', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    
    act(() => {
      result.current[1]('new-value');
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '"new-value"');
    expect(result.current[0]).toBe('new-value');
  });

  it('should handle JSON parsing errors gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');
    const onError = vi.fn();
    
    const { result } = renderHook(() => 
      useLocalStorage('test-key', 'default', { onError })
    );
    
    expect(result.current[0]).toBe('default');
    expect(onError).toHaveBeenCalled();
  });

  it('should remove value from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('"test-value"');
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    
    act(() => {
      result.current[2](); // removeValue function
    });
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key');
    expect(result.current[0]).toBe('default');
  });
});