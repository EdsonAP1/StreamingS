from app import supabase

# Base de datos mock en memoria para cuando no haya conexión con Supabase
_mock_products = [
    {
        'id': 1,
        'nombre': 'Netflix Premium',
        'descripcion': 'Pantalla 4K Ultra HD. Cuenta compartida o completa. Entrega inmediata.',
        'precio': 40.00,
        'imagen_url': 'https://wawvqqoqyukztnjireyr.supabase.co/storage/v1/object/public/logos/netflix_pixel.png',
        'categoria': 'Netflix',
        'disponible': True
    },
    {
        'id': 2,
        'nombre': 'HBO Max Retro',
        'descripcion': 'Acceso ilimitado a películas y series de Warner Bros.',
        'precio': 30.00,
        'imagen_url': 'https://wawvqqoqyukztnjireyr.supabase.co/storage/v1/object/public/logos/hbo_max_pixel.png',
        'categoria': 'HBO Max',
        'disponible': True
    },
    {
        'id': 3,
        'nombre': 'Disney+ Pixel',
        'descripcion': 'Películas y series animadas. Pixar, Marvel, Star Wars y más.',
        'precio': 25.00,
        'imagen_url': 'https://wawvqqoqyukztnjireyr.supabase.co/storage/v1/object/public/logos/disney_pixel.png',
        'categoria': 'Disney+',
        'disponible': True
    }
]

class ProductModel:
    @staticmethod
    def get_all():
        """Obtiene todos los productos de la tabla 'productos' en Supabase (o mock en memoria)."""
        if supabase is None:
            return _mock_products
        try:
            response = supabase.table('productos').select('*').order('nombre').execute()
            return response.data
        except Exception as e:
            print(f"[Supabase get_all Error] Usando datos mock: {e}")
            return _mock_products

    @staticmethod
    def get_by_id(product_id):
        """Busca un producto por su ID en Supabase o mock."""
        try:
            product_id = int(product_id)
        except ValueError:
            pass

        if supabase is None:
            for p in _mock_products:
                if p['id'] == product_id:
                    return p
            return None
        try:
            response = supabase.table('productos').select('*').eq('id', product_id).execute()
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            print(f"[Supabase get_by_id Error] Usando datos mock: {e}")
            for p in _mock_products:
                if p['id'] == product_id:
                    return p
            return None

    @staticmethod
    def create(nombre, descripcion, precio, imagen_url, categoria, disponible=True):
        """Crea un nuevo producto en Supabase o mock."""
        try:
            precio = float(precio)
        except ValueError:
            precio = 0.0

        if supabase is None:
            new_id = max([p['id'] for p in _mock_products]) + 1 if _mock_products else 1
            new_product = {
                'id': new_id,
                'nombre': nombre,
                'descripcion': descripcion,
                'precio': precio,
                'imagen_url': imagen_url or 'https://wawvqqoqyukztnjireyr.supabase.co/storage/v1/object/public/logos/retro_logo.png',
                'categoria': categoria,
                'disponible': disponible
            }
            _mock_products.append(new_product)
            return new_product
        try:
            data = {
                'nombre': nombre,
                'descripcion': descripcion,
                'precio': precio,
                'imagen_url': imagen_url or 'https://wawvqqoqyukztnjireyr.supabase.co/storage/v1/object/public/logos/retro_logo.png',
                'categoria': categoria,
                'disponible': disponible
            }
            response = supabase.table('productos').insert(data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"[Supabase create Error] Usando datos mock: {e}")
            new_id = max([p['id'] for p in _mock_products]) + 1 if _mock_products else 1
            new_product = {
                'id': new_id,
                'nombre': nombre,
                'descripcion': descripcion,
                'precio': precio,
                'imagen_url': imagen_url or 'https://wawvqqoqyukztnjireyr.supabase.co/storage/v1/object/public/logos/retro_logo.png',
                'categoria': categoria,
                'disponible': disponible
            }
            _mock_products.append(new_product)
            return new_product

    @staticmethod
    def update(product_id, nombre, descripcion, precio, imagen_url, categoria, disponible):
        """Actualiza un producto existente en Supabase o mock."""
        try:
            product_id = int(product_id)
        except ValueError:
            pass
        try:
            precio = float(precio)
        except ValueError:
            precio = 0.0

        if supabase is None:
            for p in _mock_products:
                if p['id'] == product_id:
                    p['nombre'] = nombre
                    p['descripcion'] = descripcion
                    p['precio'] = precio
                    p['imagen_url'] = imagen_url or 'https://wawvqqoqyukztnjireyr.supabase.co/storage/v1/object/public/logos/retro_logo.png'
                    p['categoria'] = categoria
                    p['disponible'] = disponible
                    return p
            return None
        try:
            # Obtener el producto actual para verificar si cambia su imagen
            old_product = ProductModel.get_by_id(product_id)
            old_image_url = old_product.get('imagen_url') if old_product else None

            data = {
                'nombre': nombre,
                'descripcion': descripcion,
                'precio': precio,
                'imagen_url': imagen_url or 'https://wawvqqoqyukztnjireyr.supabase.co/storage/v1/object/public/logos/retro_logo.png',
                'categoria': categoria,
                'disponible': disponible
            }
            response = supabase.table('productos').update(data).eq('id', product_id).execute()
            
            # Si se actualizó con éxito y la imagen cambió, borrar la anterior del storage
            if response.data and old_image_url and old_image_url != data['imagen_url']:
                _delete_image_from_storage(old_image_url)

            return response.data[0] if response.data else None
        except Exception as e:
            print(f"[Supabase update Error] Usando datos mock: {e}")
            for p in _mock_products:
                if p['id'] == product_id:
                    p['nombre'] = nombre
                    p['descripcion'] = descripcion
                    p['precio'] = precio
                    p['imagen_url'] = imagen_url or 'https://wawvqqoqyukztnjireyr.supabase.co/storage/v1/object/public/logos/retro_logo.png'
                    p['categoria'] = categoria
                    p['disponible'] = disponible
                    return p
            return None

    @staticmethod
    def delete(product_id):
        """Elimina un producto por su ID en Supabase o mock."""
        try:
            product_id = int(product_id)
        except ValueError:
            pass

        if supabase is None:
            for idx, p in enumerate(_mock_products):
                if p['id'] == product_id:
                    del _mock_products[idx]
                    return True
            return False
        try:
            # Obtener el producto antes de eliminarlo para saber qué imagen borrar
            product = ProductModel.get_by_id(product_id)
            image_url = product.get('imagen_url') if product else None

            response = supabase.table('productos').delete().eq('id', product_id).execute()
            
            # Si se eliminó correctamente, borrar la imagen del storage
            if response.data and image_url:
                _delete_image_from_storage(image_url)

            return response.data
        except Exception as e:
            print(f"[Supabase delete Error] Usando datos mock: {e}")
            for idx, p in enumerate(_mock_products):
                if p['id'] == product_id:
                    del _mock_products[idx]
                    return True
            return False

# ----------------- FUNCIÓN AUXILIAR DE ELIMINACIÓN DE STORAGE -----------------

def _delete_image_from_storage(imagen_url):
    """Elimina la imagen del storage de Supabase si corresponde al bucket 'productos'."""
    if not imagen_url or supabase is None:
        return
    
    # Comprobar si la imagen pertenece a nuestro bucket de productos
    if '/storage/v1/object/public/productos/' in imagen_url:
        try:
            # Extraer el nombre del archivo al final de la URL y limpiar parámetros
            filename = imagen_url.split('/')[-1]
            if filename:
                if '?' in filename:
                    filename = filename.split('?')[0]
                if '#' in filename:
                    filename = filename.split('#')[0]
                
                supabase.storage.from_('productos').remove([filename])
                print(f"[Supabase Storage] Imagen eliminada con éxito: {filename}")
        except Exception as e:
            print(f"[Supabase Storage] Error al eliminar imagen {imagen_url}: {e}")
