import './App.css';
import { Desktop, useDesktop, ConfigApp, AppStore } from '@jeiiz/odesktop';
import '@jeiiz/odesktop/dist/style.css';
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
