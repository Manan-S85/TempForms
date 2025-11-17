import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

console.log('Starting TempForms...');

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            borderRadius: '0.75rem',
            border: '1px solid #e5e7eb',
            fontSize: '14px',
            padding: '12px 16px',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);

console.log('TempForms rendered!');