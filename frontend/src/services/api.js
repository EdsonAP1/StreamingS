const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiService = {
  // ----------------- AUTENTICACIÓN -----------------
  async login(username, password) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  },

  async verifyToken(token) {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.status === 401) return { valid: false };
      return response.json();
    } catch {
      return { valid: false };
    }
  },

  // ----------------- PRODUCTOS -----------------
  async getProducts() {
    const response = await fetch(`${API_URL}/api/products`);
    return response.json();
  },

  async createProduct(productData, token) {
    const response = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData),
    });
    return response.json();
  },

  async updateProduct(productId, productData, token) {
    const response = await fetch(`${API_URL}/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData),
    });
    return response.json();
  },

  async deleteProduct(productId, token) {
    const response = await fetch(`${API_URL}/api/products/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  // ----------------- VISITAS -----------------
  async getVisits(increment = false) {
    const url = `${API_URL}/api/visits${increment ? '?increment=true' : ''}`;
    const response = await fetch(url);
    return response.json();
  },

  // ----------------- CONFIGURACIÓN DE WHATSAPP -----------------
  async getWhatsappConfig() {
    const response = await fetch(`${API_URL}/api/whatsapp-group`);
    return response.json();
  },

  async updateWhatsappLink(link, token) {
    const response = await fetch(`${API_URL}/api/settings/whatsapp-group`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ link }),
    });
    return response.json();
  },

  async uploadImage(file, token) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });
    return response.json();
  }
};
