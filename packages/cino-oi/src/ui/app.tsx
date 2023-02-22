import { useEffect } from 'react';
import { useCino } from './hooks/useCino';

export const App = () => {
  const { cino } = useCino();

  useEffect(() => {
    if (cino) {
      cino.install();
    }
  }, [cino]);

  return <div>123</div>;
};
