import { useState } from 'react';
import './App.css';

import GlbSandbox from './components/glb-sandbox';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <GlbSandbox></GlbSandbox>
    </div>
  );
}

export default App;
