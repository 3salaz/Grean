import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { setupIonicReact } from '@ionic/react';

setupIonicReact();

// Add the ResizeObserver workaround
if (window.ResizeObserver) {
  const resizeObserverErrSilenced = (err: ErrorEvent) =>
    err.message.includes('ResizeObserver loop limit exceeded');
  window.addEventListener('error', (err: ErrorEvent) => {
    if (resizeObserverErrSilenced(err)) {
      err.stopImmediatePropagation();
    }
  });
}

// Get the root element
const rootElement = document.getElementById('root');

// Ensure the root element exists
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );

  reportWebVitals(console.log);
} else {
  console.error('Root element not found');
}
