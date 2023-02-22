import { useEffect, useState } from 'react';
import { Cino, CinoConfig } from '@/lib-entry';

export function useCino(config?: CinoConfig) {
  const [cino, setCino] = useState<Cino>();
  useEffect(() => {
    const cinoInstance = new Cino(config);
    setCino(cinoInstance);
  }, []);

  return {
    cino,
  };
}
