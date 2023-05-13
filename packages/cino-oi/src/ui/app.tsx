import { CinoModel } from './hooks/use-cino';
import Desktop from './components/desktop';

import './app.scss';
import AppRegister from './components/app-register';

export const App = () => {
  return (
    <CinoModel.Provider>
      <AppRegister></AppRegister>
      <Desktop />
    </CinoModel.Provider>
  );
};
