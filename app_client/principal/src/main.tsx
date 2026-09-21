import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './pages/App';

const root = document.getElementById('principal-react-root');
if (!root) throw new Error('No se encontró el contenedor principal');
createRoot(root).render(<React.StrictMode><App /></React.StrictMode>);
