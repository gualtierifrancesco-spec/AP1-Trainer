import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')!).render(<App />);

// Offline-Fähigkeit als installierbare App (nur auf einer echten Website, nicht in Vorschauen)
if ('serviceWorker' in navigator && location.protocol === 'https:' && window.top === window.self) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => undefined);
  });
}
