import Desktop from './components/desktop';
import { useDesktop } from './hooks/use-desktop';
import { useEffect } from 'react';
import './App.css';
import { AppType } from './types';

function App() {
    const { desktop } = useDesktop();

    useEffect(() => {
        desktop.install?.({
            id: 'app1',
            name: 'app 1',
            type: AppType.ReactComponentApp,
            component: <div>APP1</div>,
        });
        desktop.install?.({
            id: 'app2',
            name: 'app 2',
            type: AppType.ReactComponentApp,
            component: <div>APP2</div>,
        });
    }, []);

    return <Desktop desktop={desktop} />;
}

export default App;
