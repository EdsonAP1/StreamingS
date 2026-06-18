export const getProductImageUrl = (url) => {
  if (!url) return '/retro_logo.png';
  
  const lowerUrl = url.toLowerCase();
  
  // Mapear logos predeterminados locales si la URL contiene estas palabras clave
  if (lowerUrl.includes('netflix')) {
    return '/netflix_pixel.png';
  }
  if (lowerUrl.includes('hbo') || lowerUrl.includes('max')) {
    return '/hbo_max_pixel.png';
  }
  if (lowerUrl.includes('disney')) {
    return '/disney_pixel.png';
  }
  if (lowerUrl.includes('logo') || lowerUrl.includes('retro')) {
    return '/retro_logo.png';
  }
  
  // Si empieza con /static/img/ de la versión anterior monolítica, transformarla a la carpeta public de React
  if (url.startsWith('/static/img/')) {
    const filename = url.replace('/static/img/', '');
    return `/${filename}`;
  }
  
  // Si es una URL absoluta externa, usarla tal cual
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Fallback por defecto
  return url;
};
