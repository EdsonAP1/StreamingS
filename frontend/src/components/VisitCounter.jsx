import React from 'react';

export default function VisitCounter({ digits }) {
  if (!digits || digits.length === 0) {
    // Valor por defecto en lo que carga
    digits = ['0', '0', '1', '4', '3', '2'];
  }

  return (
    <div 
      className="nes-container is-dark is-rounded" 
      style={{
        padding: '10px 15px', 
        borderWidth: '4px', 
        borderColor: '#209cee', 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '10px', 
        backgroundColor: '#0c0c0e'
      }}
    >
      <span style={{ fontSize: '8px', color: '#209cee', textTransform: 'uppercase' }}>
        ● VISITAS:
      </span>
      <div style={{ display: 'flex', gap: '4px' }}>
        {digits.map((digit, idx) => (
          <span 
            key={idx}
            style={{
              backgroundColor: '#1a1a1e', 
              color: '#39ff14', 
              fontFamily: "'Press Start 2P', monospace", 
              fontSize: '11px', 
              padding: '4px 6px', 
              border: '2px solid #000', 
              borderRadius: '2px', 
              textShadow: '0 0 5px rgba(57, 255, 20, 0.5)'
            }}
          >
            {digit}
          </span>
        ))}
      </div>
    </div>
  );
}
