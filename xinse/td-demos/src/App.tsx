import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { routes } from './route';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} {...route} element={<route.component />} />
          ))}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
