import { createRoot } from "react-dom/client";
import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Componente di test semplice per verificare React
function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>WEB PRO ITALIA - Sito in Ripristino</h1>
      <p>Il sito è in fase di ripristino tecnico...</p>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<TestApp />);