import { Desktop, useDesktop, ConfigApp, AppStore } from '../lib-entry';
import { useEffect } from 'react';

function App() {
  const { desktop } = useDesktop();

  useEffect(() => {
    desktop.install(ConfigApp);
    desktop.install(AppStore);
  }, []);

  return <Desktop desktop={desktop} />;
}

export default App;
