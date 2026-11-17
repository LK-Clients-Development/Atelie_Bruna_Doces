import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/400-italic.css';
import '@fontsource/playfair-display/500.css';
import '@fontsource-variable/montserrat';
import './presentation/styles/tokens.css';
import './presentation/styles/global.css';
import './presentation/styles/presentation.css';
import './presentation/styles/v2.css';
import App from './App';

const root = document.getElementById('root');
if (!root) throw new Error('#root não encontrado no index.html');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
