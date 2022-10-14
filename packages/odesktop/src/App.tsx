import Desktop from './components/desktop';
import { useDesktop } from './hooks/use-desktop';
import { useEffect } from 'react';
import './App.css';

function App() {
    const { desktop } = useDesktop();

    useEffect(() => {
        desktop.install({
            id: 'app1',
            name: 'app 1',
        });
        desktop.install({
            id: 'app2',
            name: 'app 2',
        });
    }, []);

    return <Desktop desktop={desktop} />;
}

export default App;
