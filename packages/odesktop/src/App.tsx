import './App.css';

import Boxer from './components/window';
import Container from './components/container';
import Desktop from './components/desktop';

const DESKTOP_DEFAULT_CONFIG = {
    desktopStyle: {
        backgroundImage: 'linear-gradient(315deg,#17ead9,#6078ea)',
        backgroundSize: 'cover',
    },
};

function App() {
    return (
        <Desktop>
            <Container>
                <Boxer title='Win1'>
                    <span>Win1-Content</span>
                </Boxer>
                <Boxer title='Win5' defaultPosition={[10, 10]}>
                    <div>Win5-ContentContentContentContent</div>
                </Boxer>
                <Boxer title='Win6' defaultPosition={[20, 20]}>
                    <span>Win6</span>
                </Boxer>
            </Container>
        </Desktop>
    );
}

export default App;
