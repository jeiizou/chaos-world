import './App.css';

import Window from './components/window';
import Desktop from './components/desktop';

function App() {
    return (
        <Desktop>
            <Window title='Win1' id='win1'>
                <span>Win1-Content</span>
            </Window>
            <Window title='Win5' defaultPosition={[10, 10]} id='win5'>
                <div>Win5-ContentContentContentContent</div>
            </Window>
            <Window title='Win6' defaultPosition={[20, 20]} id='win6'>
                <span>Win6</span>
            </Window>
        </Desktop>
    );
}

export default App;
