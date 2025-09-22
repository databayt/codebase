import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing a value
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 500ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes (or component unmounts)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for creating a debounced callback function
 * @param callback - The function to debounce
 * @param delay - The delay in milliseconds (default: 500ms)
 * @returns The debounced callback function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): T {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const debouncedCallback = ((...args: Parameters<T>) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      callback(...args);
    }, delay);

    setDebounceTimer(newTimer);
  }) as T;

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return debouncedCallback;
}

/**
 * Custom hook for debouncing state updates
 * @param initialValue - The initial state value
 * @param delay - The delay in milliseconds (default: 500ms)
 * @returns A tuple of [value, debouncedValue, setValue]
 */
export function useDebouncedState<T>(
  initialValue: T,
  delay: number = 500
): [T, T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initialValue);
  const debouncedValue = useDebounce(value, delay);

  return [value, debouncedValue, setValue];
}

/**
 * Custom hook for debouncing search input
 * @param initialValue - The initial search value
 * @param delay - The delay in milliseconds (default: 300ms for search)
 * @returns An object with search value, debounced value, and setter
 */
export function useSearchDebounce(initialValue: string = '', delay: number = 300) {
  const [search, setSearch] = useState(initialValue);
  const debouncedSearch = useDebounce(search, delay);

  return {
    search,
    debouncedSearch,
    setSearch,
    isDebouncing: search !== debouncedSearch,
    clear: () => setSearch(''),
  };
}