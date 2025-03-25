import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Stillerinizi burada import edin
import serviceWorkerRegistration from './serviceWorkerRegistration'; // Service worker kaydı

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA servis worker'ını kaydet
serviceWorkerRegistration();