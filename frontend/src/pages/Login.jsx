import React, { useState } from 'react';
import { apiService } from '../services/api';

export default function Login({ onNavigate, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Por favor, ingresa todos los campos.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await apiService.login(username, password);
      if (response && response.success) {
        onLoginSuccess(response.token);
      } else {
        setError(response.message || 'Usuario o contraseña incorrectos.');
      }
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Background decoration */}
      <div className="stars-container">
        <div className="trail t-3"></div>
        <div className="trail t-8"></div>
        <div className="float-box fb-1"></div>
        <div className="float-box fb-3"></div>
      </div>

      <header className="nes-container is-dark is-rounded retro-header">
        <div className="header-logo">
          <img 
            src="/retro_logo.png" 
            alt="Logo" 
            className="pixel-art-img" 
          />
          <h1 className="brand-name">StreamingS</h1>
        </div>
        <nav className="retro-nav">
          <button onClick={() => onNavigate('catalog')} className="nes-btn is-error">
            VOLVER
          </button>
        </nav>
      </header>

      <main className="main-content">
        <div className="login-container nes-container is-dark is-rounded" style={{ borderWidth: '4px' }}>
          <h2 className="login-title blink-green">
            <i className="nes-icon key is-medium" style={{ marginRight: '10px' }}></i>
            INSERT COIN
          </h2>

          {error && (
            <div className="nes-container is-rounded is-dark msg-error flash-messages" style={{ borderWidth: '2px', padding: '10px' }}>
              <p style={{ margin: 0, fontSize: '9px', textAlign: 'center' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group nes-field">
              <label htmlFor="username">USUARIO ADMINISTRADOR:</label>
              <input 
                type="text" 
                id="username" 
                className="nes-input is-dark" 
                placeholder="USUARIO"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group nes-field">
              <label htmlFor="password">CONTRASEÑA RETRO:</label>
              <input 
                type="password" 
                id="password" 
                className="nes-input is-dark" 
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="btn-container">
              <button 
                type="submit" 
                className={`nes-btn ${loading ? 'is-disabled' : 'is-success'}`}
                disabled={loading}
              >
                {loading ? 'CARGANDO...' : 'PRESS START'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="nes-container is-dark is-rounded retro-footer" style={{ borderTop: '4px solid #3f3f44' }}>
        <p style={{ margin: 0 }}>&copy; 2026 StreamingS - Catálogo Retro 8-Bits</p>
      </footer>
    </>
  );
}
