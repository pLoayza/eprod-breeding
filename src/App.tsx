import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './assets/pages/Landing';
import Dashboard from './assets/pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app" style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
        <Routes>
          {/* Ruta principal - redirige a landing */}
          <Route path="/" element={<Navigate to="/landing" replace />} />
          
          {/* Página de inicio */}
          <Route path="/landing" element={<Landing />} />
          
          {/* Dashboard principal de la agenda */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Ruta para páginas no encontradas */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;