import React from 'react';

export default function WhatsappFloatBtn({ link }) {
  if (!link) return null;

  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="whatsapp-float-btn"
    >
      <i className="nes-icon whatsapp"></i>
      <span>COMUNIDAD</span>
    </a>
  );
}
