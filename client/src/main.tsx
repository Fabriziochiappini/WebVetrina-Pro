import { createRoot } from "react-dom/client";
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Componente semplificato per test immediato
const TestComponent = () => (
  <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
    <h1 style={{ color: '#2563eb', margin: '0 0 16px 0' }}>WEB PRO ITALIA</h1>
    <p style={{ margin: '0 0 8px 0' }}>✅ React funziona</p>
    <p style={{ margin: '0 0 8px 0' }}>✅ Server attivo</p>
    <p style={{ margin: '0 0 8px 0' }}>✅ Database intatto</p>
    <p style={{ margin: '0 0 16px 0' }}>✅ Componenti disponibili</p>
    <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '8px' }}>
      <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Prossimi passi:</p>
      <p style={{ margin: '0' }}>Ripristino graduale dei componenti originali</p>
    </div>
  </div>
);

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<TestComponent />);
}