import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Al estar en la misma carpeta se usa ./

// Estilos globales
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/index.css'; // Ruta corregida hacia tus assets internos

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);