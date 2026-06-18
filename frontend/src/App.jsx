import React, { useState, useEffect } from 'react';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { apiService } from './services/api';

export default function App() {
  const [view, setView] = useState('catalog'); // 'catalog', 'login', 'dashboard'
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Intentar restaurar sesión de administrador al iniciar
    const savedToken = sessionStorage.getItem('admin_token');
    if (savedToken) {
      apiService.verifyToken(savedToken).then(response => {
        if (response && response.valid) {
          setToken(savedToken);
          // Si el token es válido, y el usuario estaba en login o catálogo, podemos dejarlo en catálogo o dashboard
          // Por seguridad o comodidad, lo dejamos donde estaba o en dashboard si navega explícitamente.
        } else {
          sessionStorage.removeItem('admin_token');
        }
      });
    }
  }, []);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
    sessionStorage.setItem('admin_token', newToken);
    setView('dashboard');
  };

  const handleLogout = () => {
    setToken(null);
    sessionStorage.removeItem('admin_token');
    setView('catalog');
  };

  const handleNavigate = (targetView) => {
    if (targetView === 'dashboard' && !token) {
      setView('login');
    } else {
      setView(targetView);
    }
  };

  // Renderizado dinámico de vistas
  return (
    <div id="app-container">
      {view === 'catalog' && (
        <Catalog onNavigate={handleNavigate} />
      )}
      
      {view === 'login' && (
        token ? (
          <Dashboard token={token} onLogout={handleLogout} onNavigate={handleNavigate} />
        ) : (
          <Login onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
        )
      )}
      
      {view === 'dashboard' && (
        token ? (
          <Dashboard token={token} onLogout={handleLogout} onNavigate={handleNavigate} />
        ) : (
          <Login onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
        )
      )}
    </div>
  );
}
