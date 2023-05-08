import { CinoModel } from './hooks/use-cino';
import Desktop from './components/desktop';

import './app.scss';

export const App = () => {
  return (
    <CinoModel.Provider>
      <Desktop />
    </CinoModel.Provider>
  );
};
