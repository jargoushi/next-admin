'use client';

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 防抖回调 Hook
export function useDebounceCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const [debouncedCallback, setDebouncedCallback] = useState<T>(callback);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay]);

  return debouncedCallback;
}

// 节流 Hook
export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useState<number>(Date.now())[0];

  useEffect(() => {
    const handler = setTimeout(
      () => {
        const now = Date.now();
        if (now - lastExecuted >= delay) {
          setThrottledValue(value);
        }
      },
      delay - (Date.now() - lastExecuted)
    );

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, lastExecuted]);

  return throttledValue;
}

// 节流回调 Hook
export function useThrottleCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const [throttledCallback, setThrottledCallback] = useState<T>(callback);
  const lastRun = useState<number>(Date.now())[0];

  useEffect(() => {
    const handler = setTimeout(
      () => {
        if (Date.now() - lastRun >= delay) {
          setThrottledCallback(() => callback);
        }
      },
      delay - (Date.now() - lastRun)
    );

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay, lastRun]);

  return throttledCallback;
}
