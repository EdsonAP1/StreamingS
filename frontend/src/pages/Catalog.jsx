import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { getProductImageUrl } from '../services/imageHelper';
import VisitCounter from '../components/VisitCounter';
import WhatsappFloatBtn from '../components/WhatsappFloatBtn';

export default function Catalog({ onNavigate }) {
  const [products, setProducts] = useState([]);
  const [visits, setVisits] = useState([]);
  const [whatsappConfig, setWhatsappConfig] = useState({ link: '', phone: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Cargar productos
        const prodData = await apiService.getProducts();
        // Filtrar productos para mostrar solo los disponibles en la página pública
        const available = Array.isArray(prodData) ? prodData.filter(p => p.disponible) : [];
        setProducts(available);

        // Incrementar y obtener visitas
        const visitsData = await apiService.getVisits(true);
        if (visitsData && visitsData.formatted) {
          setVisits(visitsData.formatted);
        }

        // Obtener configuración de WhatsApp
        const waConfig = await apiService.getWhatsappConfig();
        if (waConfig) {
          setWhatsappConfig(waConfig);
        }
      } catch (err) {
        console.error("Error al cargar datos del catálogo:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleBuy = (product) => {
    const phone = whatsappConfig.phone || '59175892296';
    const message = `Hola. Me interesa adquirir una cuenta de *${product.nombre}* por 30 dias al precio de *${product.precio} Bs.*. Me podria indicar los pasos para realizar el pago y recibir los accesos?`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  return (
    <>
      {/* Stars Cascade Animated Background */}
      <div className="stars-container">
        <div className="trail t-1"></div>
        <div className="trail t-2"></div>
        <div className="trail t-3"></div>
        <div className="trail t-4"></div>
        <div className="trail t-5"></div>
        <div className="trail t-6"></div>
        <div className="trail t-7"></div>
        <div className="trail t-8"></div>
        <div className="trail t-9"></div>
        <div className="trail t-10"></div>
        <div className="trail t-11"></div>
        <div className="trail t-12"></div>
        <div className="trail t-13"></div>
        <div className="float-box fb-1"></div>
        <div className="float-box fb-2"></div>
        <div className="float-box fb-3"></div>
        <div className="float-box fb-4"></div>
      </div>

      {/* Retro Header */}
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
          <button onClick={() => onNavigate('login')} className="nes-btn is-primary">
            ADMINISTRAR
          </button>
        </nav>
      </header>

      <main className="main-content">
        {/* Banner de Bienvenida */}
        <section 
          className="nes-container is-dark is-rounded" 
          style={{ borderWidth: '4px', marginBottom: '35px', padding: '30px' }}
        >
          <div className="nes-balloon from-left is-dark">
            <h2 style={{ fontSize: '13px', color: '#f7d51d', margin: '0 0 10px 0', textTransform: 'uppercase' }}>
              BIENVENIDO A STREAMINGS
            </h2>
            <p style={{ margin: 0, fontSize: '10px', lineHeight: '1.8' }}>
              ¡Consigue tus cuentas de streaming favoritas al mejor precio en 8-bits! Selecciona tu servicio, presiona <strong>"COMPRAR"</strong> y te atenderemos por WhatsApp. <span className="blink-green">INSERT COIN TO START!</span>
            </p>
          </div>

          <div style={{ marginTop: '25px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '9px', color: '#bcbcbc', marginBottom: '20px' }}>
              ★ ¿POR QUÉ COMPRAR EN STREAMINGS? ★
            </h3>
            
            <div className="trust-grid">
              <div 
                className="nes-container is-dark is-rounded" 
                style={{ padding: '15px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <i className="nes-icon trophy is-medium" style={{ marginBottom: '15px' }}></i>
                <div style={{ margin: '5px 0' }} className="nes-badge">
                  <span className="is-success" style={{ fontSize: '8px' }}>5 AÑOS</span>
                </div>
                <p style={{ fontSize: '8px', lineHeight: '1.6', color: '#bcbcbc', margin: '10px 0 0 0' }}>
                  Ofreciendo el mejor servicio estable de streaming en toda Bolivia.
                </p>
              </div>

              <div 
                className="nes-container is-dark is-rounded" 
                style={{ padding: '15px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <i className="nes-icon star is-medium" style={{ marginBottom: '15px' }}></i>
                <div style={{ margin: '5px 0' }} className="nes-badge">
                  <span className="is-primary" style={{ fontSize: '8px' }}>GARANTÍA</span>
                </div>
                <p style={{ fontSize: '8px', lineHeight: '1.6', color: '#bcbcbc', margin: '10px 0 0 0' }}>
                  Reposición inmediata y soporte garantizado ante cualquier corte.
                </p>
              </div>

              <div 
                className="nes-container is-dark is-rounded" 
                style={{ padding: '15px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <i className="nes-icon like is-medium" style={{ marginBottom: '15px' }}></i>
                <div style={{ margin: '5px 0' }} className="nes-badge">
                  <span className="is-warning" style={{ fontSize: '8px' }}>CONFIANZA</span>
                </div>
                <p style={{ fontSize: '8px', lineHeight: '1.6', color: '#bcbcbc', margin: '10px 0 0 0' }}>
                  Varios clientes satisfechos. Soporte al instante por WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Catálogo */}
        <section className="nes-container is-dark is-rounded" style={{ borderWidth: '4px' }}>
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: '15px', 
              borderBottom: '4px solid #3f3f44', 
              paddingBottom: '20px', 
              marginBottom: '20px' 
            }}
          >
            <h2 style={{ color: '#f7d51d', fontSize: '13px', margin: 0 }}>
              <i className="nes-icon star is-small"></i> CATÁLOGO
            </h2>
            <VisitCounter digits={visits} />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <p className="blink-green">CARGANDO SERVICIOS...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="catalog-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card nes-container is-dark is-rounded">
                  <div className="product-card-body">
                    <h3 style={{ fontSize: '12px', margin: '0 0 15px 0', color: '#f7d51d' }}>
                      {product.nombre}
                    </h3>
                    <div className="product-img-container">
                      <img 
                        src={getProductImageUrl(product.imagen_url)} 
                        alt={product.nombre} 
                        className="product-img pixel-art-img" 
                      />
                    </div>
                    <p className="product-description">{product.descripcion}</p>
                    <div className="product-price-tag">
                      <span style={{ fontSize: '10px', color: '#fff' }}>PRECIO:</span> {product.precio.toFixed(2)} Bs.
                      <span style={{ fontSize: '9px', color: '#f7d51d', display: 'block', marginTop: '5px' }}>
                        [30 DIAS DE VIGENCIA]
                      </span>
                    </div>
                    <button 
                      onClick={() => handleBuy(product)} 
                      className="nes-btn is-success product-buy-btn"
                    >
                      COMPRAR
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="nes-container is-dark is-rounded" style={{ textAlign: 'center', padding: '40px' }}>
              <p className="blink-red">¡GAME OVER! No hay productos disponibles por el momento.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="nes-container is-dark is-rounded retro-footer" style={{ borderTop: '4px solid #3f3f44' }}>
        <p style={{ margin: 0 }}>&copy; 2026 StreamingS - Catálogo Retro 8-Bits</p>
      </footer>

      {/* Floating WhatsApp Community Button */}
      <WhatsappFloatBtn link={whatsappConfig.link} />
    </>
  );
}
