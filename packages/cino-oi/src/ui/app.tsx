import { useEffect } from 'react';
import { useCino } from './hooks/useCino';
import Desktop from './components/desktop';

import './app.scss';

export const App = () => {
  const { cino } = useCino();

  useEffect(() => {
    if (cino) {
      cino.install();
    }
  }, [cino]);

  return (
    <>
      <Desktop />
    </>
  );
};
