import { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('Ready');

  const handleAuth = async () => {
    setStatus('Authenticating...');
    try {
      const res = await fetch('/api/auth', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStatus('Authentication successful!');
      } else {
        setStatus(`Authentication failed: ${data.error}`);
      }
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  const handleInspect = async () => {
    if (!url) {
      setStatus('Please enter a URL');
      return;
    }
    setStatus(`Inspecting ${url}...`);
    try {
      const res = await fetch('/api/inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(`Inspection successful for ${url}`);
      } else {
        setStatus(`Inspection failed: ${data.error}`);
      }
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  const handleRequestIndexing = async () => {
    if (!url) {
      setStatus('Please enter a URL');
      return;
    }
    setStatus(`Requesting indexing for ${url}...`);
    try {
      const res = await fetch('/api/request-indexing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(`Indexing requested successfully for ${url}`);
      } else {
        setStatus(`Indexing request failed: ${data.error}`);
      }
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  const handleAutoIndex = async () => {
    setStatus('Starting auto-indexing from RSS feed...');
    try {
      const res = await fetch('/api/auto-index', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStatus('Auto-indexing process completed!');
      } else {
        setStatus(`Auto-indexing failed: ${data.error}`);
      }
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Google SEO Helper</h1>
      </header>
      <main>
        <div className="card">
          <h2>Authentication</h2>
          <button onClick={handleAuth}>Authenticate with Google</button>
        </div>

        <div className="card">
          <h2>Manual URL Operations</h2>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
          />
          <button onClick={handleInspect}>Inspect URL</button>
          <button onClick={handleRequestIndexing}>Request Indexing</button>
        </div>

        <div className="card">
          <h2>Automatic Indexing</h2>
          <button onClick={handleAutoIndex}>Start Auto-Indexing from RSS</button>
        </div>

        <div className="card">
          <h2>Status</h2>
          <p>{status}</p>
        </div>
      </main>
    </div>
  );
}

export default App;