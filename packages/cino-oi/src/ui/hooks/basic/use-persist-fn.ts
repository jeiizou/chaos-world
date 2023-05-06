import { useRef } from 'react';

export function usePersistFn(fn: any) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const persistFn = useRef<any>();
  if (!persistFn.current) {
    persistFn.current = function (...args: any[]) {
      return fnRef.current.apply(this, args);
    };
  }

  return persistFn.current;
}
