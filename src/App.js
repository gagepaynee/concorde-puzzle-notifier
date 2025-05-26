import logo from './logo.svg';
import './App.css';
import { useEffect, useRef, useState } from 'react';

function App() {
  const [registeredIds, setRegisteredIds] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket('ws://192.168.0.144:5000');
    wsRef.current = ws;

    ws.onopen = () => {
      const id = Math.random().toString(36).substring(2, 10);
      const message = { event: 'setup', id };
      try {
        ws.send(JSON.stringify(message));
      } catch (err) {
        console.error('Failed to send setup message', err);
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'register_success' && data.id) {
          setRegisteredIds((prev) => {
            if (prev.includes(data.id)) {
              return prev;
            }
            return [...prev, data.id];
          });
        }
      } catch (err) {
        console.error('Failed to parse message', err);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleUnlock = (id) => {
    const message = { event: 'unlocked', id };
    try {
      wsRef.current?.send(JSON.stringify(message));
    } catch (err) {
      console.error('Failed to send unlock message', err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {registeredIds.map((id) => (
          <button key={id} onClick={() => handleUnlock(id)}>
            {`Unlock ${id}`}
          </button>
        ))}
      </header>
    </div>
  );
}

export default App;
