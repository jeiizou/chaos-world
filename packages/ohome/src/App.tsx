import './App.css';
import { Desktop, useDesktop, ConfigApp } from '@jeiiz/odesktop';
import { useEffect } from 'react';

function App() {
    const { desktop } = useDesktop();

    useEffect(()=>{
      desktop.install(ConfigApp)
    }, [])

    return <Desktop desktop={desktop} />;
}

export default App;
