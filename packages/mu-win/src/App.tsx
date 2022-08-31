import './App.css';

import Win from './win';
import Box from './win/box';

function App() {
    return (
        <Box>
            <>
                <Win title='11'>
                    <span>Win1</span>
                </Win>
                <Win title='11'>
                    <span>Win1</span>
                </Win>
            </>
        </Box>
    );
}

export default App;
