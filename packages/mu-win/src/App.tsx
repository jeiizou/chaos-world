import './App.css';

import Boxer from './components/boxer';
import Container from './components/container';

function App() {
    return (
        <>
            <Container>
                <Boxer title='Win1'>
                    <span>Win1-Content</span>
                </Boxer>
                <Boxer title='Win2' defaultPosition={[10, 10]}>
                    <div>Win2-ContentContentContentContent</div>
                </Boxer>
                <Boxer title='Win3' defaultPosition={[20, 20]}>
                    <span>Win3</span>
                </Boxer>
            </Container>
        </>
    );
}

export default App;
