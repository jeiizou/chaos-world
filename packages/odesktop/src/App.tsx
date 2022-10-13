import './App.css';

import Boxer from './components/window';
import Container from './components/free-layout';

function App() {
    return (
        <div id='app'>
            <Container>
                <Boxer title='Win1'>
                    <span>Win1-Content</span>
                </Boxer>
                {/* <Boxer title='Win2'>
                    <span>Win2-Content</span>
                </Boxer>
                <Boxer title='Win3'>
                    <span>Win3-Content</span>
                </Boxer>
                <Boxer title='Win4'>
                    <span>Win4-Content</span>
                </Boxer> */}
                <Boxer title='Win5' defaultPosition={[10, 10]}>
                    <div>Win5-ContentContentContentContent</div>
                </Boxer>
                <Boxer title='Win6' defaultPosition={[20, 20]}>
                    <span>Win6</span>
                </Boxer>
            </Container>
        </div>
    );
}

export default App;
