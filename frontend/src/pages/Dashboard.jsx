import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { getProductImageUrl } from '../services/imageHelper';

const DEFAULT_LOGOS = [
  { name: 'Netflix Premium', url: '/netflix_pixel.png' },
  { name: 'HBO Max Retro', url: '/hbo_max_pixel.png' },
  { name: 'Disney+ Pixel', url: '/disney_pixel.png' },
  { name: 'StreamingS Default', url: '/retro_logo.png' }
];

export default function Dashboard({ token, onLogout, onNavigate }) {
  const [products, setProducts] = useState([]);
  const [whatsappLink, setWhatsappLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Estado del modal de producto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' o 'edit'
  const [currentProductId, setCurrentProductId] = useState(null);

  // Campos del formulario del producto
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [disponible, setDisponible] = useState(true);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const response = await apiService.uploadImage(file, token);
      if (response && response.success) {
        setImagenUrl(response.url);
        showFlash('Imagen subida exitosamente a Supabase Storage.', 'success');
      } else {
        showFlash(response.message || 'Error al subir la imagen.', 'error');
      }
    } catch (err) {
      console.error(err);
      showFlash('Error de conexión al subir el archivo.', 'error');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const prodData = await apiService.getProducts();
      setProducts(Array.isArray(prodData) ? prodData : []);

      const waConfig = await apiService.getWhatsappConfig();
      if (waConfig) {
        setWhatsappLink(waConfig.link || '');
      }
    } catch (err) {
      console.error(err);
      showFlash('Error al cargar datos del panel.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showFlash = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handleSaveWhatsapp = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.updateWhatsappLink(whatsappLink, token);
      if (response && response.success) {
        showFlash('¡Link del grupo de WhatsApp actualizado exitosamente!', 'success');
      } else {
        showFlash(response.message || 'Error al actualizar el enlace.', 'error');
      }
    } catch {
      showFlash('Error de conexión al guardar el enlace.', 'error');
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setCurrentProductId(null);
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setCategoria('Netflix');
    setImagenUrl(DEFAULT_LOGOS[0].url); // Por defecto Netflix
    setDisponible(true);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setCurrentProductId(product.id);
    setNombre(product.nombre);
    setDescripcion(product.descripcion || '');
    setPrecio(product.precio);
    setCategoria(product.categoria || 'Netflix');
    setImagenUrl(product.imagen_url || DEFAULT_LOGOS[3].url);
    setDisponible(product.disponible);
    setIsModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !precio) {
      alert('Nombre y Precio son requeridos.');
      return;
    }

    const productData = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      imagen_url: imagenUrl,
      categoria,
      disponible
    };

    try {
      let response;
      if (modalMode === 'create') {
        response = await apiService.createProduct(productData, token);
        if (response && response.success) {
          showFlash(`¡Producto "${nombre}" creado exitosamente!`, 'success');
        }
      } else {
        response = await apiService.updateProduct(currentProductId, productData, token);
        if (response && response.success) {
          showFlash(`¡Producto "${nombre}" actualizado exitosamente!`, 'success');
        }
      }
      setIsModalOpen(false);
      loadDashboardData();
    } catch (err) {
      console.error(err);
      showFlash('Error al guardar el producto.', 'error');
    }
  };

  const handleDeleteProduct = async (productId, name) => {
    if (!window.confirm(`¿Seguro que deseas eliminar el producto "${name}"?`)) {
      return;
    }

    try {
      const response = await apiService.deleteProduct(productId, token);
      if (response && response.success) {
        showFlash('Producto eliminado correctamente.', 'success');
        loadDashboardData();
      } else {
        showFlash(response.message || 'Error al eliminar el producto.', 'error');
      }
    } catch (err) {
      console.error(err);
      showFlash('Error al conectar con el servidor para borrar.', 'error');
    }
  };

  return (
    <>
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
          <button onClick={() => onNavigate('catalog')} className="nes-btn is-primary">
            VER CATÁLOGO
          </button>
          <button onClick={onLogout} className="nes-btn is-error">
            SALIR
          </button>
        </nav>
      </header>

      <main className="main-content">
        <div className="dashboard-title-bar">
          <h2 style={{ color: '#f7d51d', textShadow: '2px 2px 0px #000', fontSize: '14px', margin: 0 }}>
            <i className="nes-icon trophy is-medium" style={{ marginRight: '10px' }}></i> PANEL DE CONTROL
          </h2>
          <button onClick={openCreateModal} className="nes-btn is-success">NUEVO PRODUCTO</button>
        </div>

        {/* Mensajes Flash */}
        {message.text && (
          <div 
            className={`nes-container is-dark is-rounded flash-messages ${message.type === 'error' ? 'msg-error' : 'msg-success'}`}
            style={{ borderWidth: '2px', padding: '12px', textAlign: 'center' }}
          >
            <p style={{ margin: 0, fontSize: '9px' }}>{message.text}</p>
          </div>
        )}

        {/* Settings de WhatsApp */}
        <section 
          className="nes-container is-dark is-rounded with-title" 
          style={{ borderWidth: '4px', borderColor: '#209cee', marginBottom: '30px' }}
        >
          <h3 className="title" style={{ color: '#209cee' }}>CONFIGURACIÓN</h3>
          <form onSubmit={handleSaveWhatsapp} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="nes-field" style={{ flex: 1, minWidth: '250px' }}>
              <label htmlFor="whatsapp_group_link">LINK GRUPO DE WHATSAPP (BOTÓN FLOTANTE):</label>
              <input 
                type="url" 
                id="whatsapp_group_link" 
                className="nes-input is-dark" 
                value={whatsappLink} 
                onChange={(e) => setWhatsappLink(e.target.value)}
                placeholder="https://chat.whatsapp.com/..." 
              />
            </div>
            <button type="submit" className="nes-btn is-primary">GUARDAR LINK</button>
          </form>
        </section>

        {/* Tabla de Productos */}
        <section className="nes-container is-dark is-rounded with-title" style={{ borderWidth: '4px' }}>
          <h3 className="title">INVENTARIO DE CUENTAS</h3>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p className="blink-green">CARGANDO INVENTARIO...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="nes-table is-bordered is-dark dashboard-table">
                <thead>
                  <tr>
                    <th>LOGO</th>
                    <th>NOMBRE</th>
                    <th>CATEGORÍA</th>
                    <th>PRECIO</th>
                    <th>ESTADO</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <img 
                            src={getProductImageUrl(product.imagen_url)} 
                            className="pixel-art-img" 
                            alt="Logo" 
                            width="40" 
                            height="40" 
                            style={{ objectFit: 'contain' }}
                          />
                        </td>
                        <td style={{ color: '#f7d51d' }}>{product.nombre}</td>
                        <td>
                          <span className="nes-badge">
                            <span className="is-primary" style={{ fontSize: '8px' }}>{product.categoria}</span>
                          </span>
                        </td>
                        <td>{product.precio.toFixed(2)} Bs.</td>
                        <td>
                          {product.disponible ? (
                            <span className="nes-text is-success">ACTIVO</span>
                          ) : (
                            <span className="nes-text is-error">PAUSADO</span>
                          )}
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button 
                              onClick={() => openEditModal(product)} 
                              className="nes-btn is-warning is-small"
                            >
                              EDITAR
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id, product.nombre)} 
                              className="nes-btn is-error is-small"
                            >
                              ELIMINAR
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ padding: '30px' }}>No hay cuentas registradas. ¡Presiona NUEVO PRODUCTO para agregar una!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <footer className="nes-container is-dark is-rounded retro-footer" style={{ borderTop: '4px solid #3f3f44' }}>
        <p style={{ margin: 0 }}>&copy; 2026 StreamingS - Catálogo Retro 8-Bits</p>
      </footer>

      {/* MODAL DE CREAR / EDITAR PRODUCTO */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="nes-container is-rounded is-dark modal-content">
            <div className="modal-header">
              <h3>{modalMode === 'create' ? 'NUEVO PRODUCTO' : 'EDITAR PRODUCTO'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">&times;</button>
            </div>

            <form onSubmit={handleProductSubmit}>
              <div className="form-group nes-field">
                <label htmlFor="prod_name">NOMBRE DE LA CUENTA:</label>
                <input 
                  type="text" 
                  id="prod_name" 
                  className="nes-input is-dark"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Netflix Premium 4K"
                />
              </div>

              <div className="form-group nes-field">
                <label htmlFor="prod_desc">DESCRIPCIÓN / DETALLES:</label>
                <textarea 
                  id="prod_desc" 
                  className="nes-textarea is-dark"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Detalles de pantallas, vigencia, etc."
                />
              </div>

              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <div className="form-group nes-field" style={{ flex: 1, minWidth: '150px' }}>
                  <label htmlFor="prod_price">PRECIO (Bs.):</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    id="prod_price" 
                    className="nes-input is-dark"
                    required
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group nes-field" style={{ flex: 1, minWidth: '150px' }}>
                  <label htmlFor="prod_category">CATEGORÍA:</label>
                  <div className="nes-select is-dark">
                    <select 
                      id="prod_category"
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                    >
                      <option value="Netflix">Netflix</option>
                      <option value="HBO Max">HBO Max</option>
                      <option value="Disney+">Disney+</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Selección de Logotipos */}
              <div className="form-group">
                <label style={{ fontSize: '10px', display: 'block', marginBottom: '10px' }}>
                  SELECCIONAR LOGOTIPO DE SERVICIO:
                </label>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
                  {DEFAULT_LOGOS.map((logo) => (
                    <div 
                      key={logo.url}
                      onClick={() => setImagenUrl(logo.url)}
                      style={{
                        padding: '5px',
                        border: imagenUrl === logo.url ? '4px solid #f7d51d' : '4px solid #3f3f44',
                        cursor: 'pointer',
                        backgroundColor: '#121214',
                        borderRadius: '4px',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img 
                        src={logo.url} 
                        alt={logo.name} 
                        className="pixel-art-img" 
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  ))}
                </div>

                {/* Subir imagen a Supabase Storage */}
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label htmlFor="prod_file" style={{ fontSize: '10px', display: 'block', marginBottom: '10px' }}>
                    O SUBIR FOTO DEL PRODUCTO:
                  </label>
                  <input 
                    type="file" 
                    id="prod_file" 
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                      type="button" 
                      onClick={() => document.getElementById('prod_file').click()} 
                      className="nes-btn is-primary"
                      disabled={uploading}
                    >
                      {uploading ? 'SUBIENDO...' : 'SELECCIONAR FOTO'}
                    </button>
                    {uploading && (
                      <span className="blink-green" style={{ fontSize: '8px', alignSelf: 'center' }}>
                        CARGANDO IMAGEN EN NUBE...
                      </span>
                    )}
                  </div>
                </div>

                <div className="nes-field">
                  <label htmlFor="prod_img_url">O PEGAR URL DE IMAGEN PERSONALIZADA:</label>
                  <input 
                    type="url" 
                    id="prod_img_url" 
                    className="nes-input is-dark"
                    value={imagenUrl}
                    onChange={(e) => setImagenUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Disponibilidad */}
              <div className="form-group" style={{ margin: '25px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}>
                  <input 
                    type="checkbox" 
                    className="nes-checkbox is-dark"
                    checked={disponible}
                    onChange={(e) => setDisponible(e.target.checked)}
                  />
                  <span>SERVICIO DISPONIBLE PARA LA VENTA</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '30px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="nes-btn">CANCELAR</button>
                <button type="submit" className="nes-btn is-success">GUARDAR</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
