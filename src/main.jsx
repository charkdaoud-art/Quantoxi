import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

class Boundary extends React.Component {
  state = { err: null };
  static getDerivedStateFromError(err) { return { err }; }
  render() {
    if (this.state.err) return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#fff', fontFamily: 'Manrope, sans-serif', textAlign: 'center', padding: 24 }}>
        <div><h1 style={{ fontSize: 24 }}>Something went wrong.</h1><p style={{ opacity: .7 }}>Please reload the page.</p>
        <button onClick={() => { window.location.hash = ''; window.location.reload(); }} style={{ marginTop: 16, padding: '10px 20px', borderRadius: 999, background: '#6366F1', color: '#fff' }}>Reload</button></div>
      </div>
    );
    return this.props.children;
  }
}
createRoot(document.getElementById('root')).render(<Boundary><App /></Boundary>);
