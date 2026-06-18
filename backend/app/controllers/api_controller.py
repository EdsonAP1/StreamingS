import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from functools import wraps
from app.models.product_model import ProductModel
from app.models.auth_model import AuthModel
from app import supabase

api_bp = Blueprint('api', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Leer el token desde la cabecera Authorization: Bearer <token>
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token or not AuthModel.verify_token(token):
            return jsonify({'message': 'Acceso no autorizado. Token inválido o ausente.'}), 401
        
        return f(*args, **kwargs)
    return decorated

# ----------------- ENDPOINTS DE AUTENTICACIÓN -----------------

@api_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.json or {}
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Faltan credenciales (usuario y contraseña).'}), 400
        
    if AuthModel.authenticate(username, password):
        token = AuthModel.generate_token()
        return jsonify({
            'success': True,
            'token': token,
            'message': 'Autenticación exitosa.'
        })
    
    return jsonify({'success': False, 'message': 'Usuario o contraseña incorrectos.'}), 401

@api_bp.route('/auth/verify', methods=['GET'])
def verify():
    token = None
    if 'Authorization' in request.headers:
        auth_header = request.headers['Authorization']
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            
    if AuthModel.verify_token(token):
        return jsonify({'valid': True})
    return jsonify({'valid': False}), 401

# ----------------- ENDPOINTS DE PRODUCTOS -----------------

@api_bp.route('/products', methods=['GET'])
def get_products():
    products = ProductModel.get_all()
    # Filtrar no disponibles opcionalmente si es la parte pública, pero al administrador 
    # le interesa ver todos. Así que devolvemos todos, y el frontend puede filtrarlos
    # para el catálogo público si lo prefiere o el backend puede proveer el estado.
    return jsonify(products)

@api_bp.route('/products', methods=['POST'])
@token_required
def create_product():
    data = request.json or {}
    nombre = data.get('nombre')
    descripcion = data.get('descripcion', '')
    precio = data.get('precio', 0.0)
    imagen_url = data.get('imagen_url', '')
    categoria = data.get('categoria', 'Otros')
    disponible = data.get('disponible', True)
    
    if not nombre:
        return jsonify({'message': 'El campo nombre es obligatorio.'}), 400
        
    new_product = ProductModel.create(
        nombre=nombre,
        descripcion=descripcion,
        precio=precio,
        imagen_url=imagen_url,
        categoria=categoria,
        disponible=disponible
    )
    
    return jsonify({'success': True, 'product': new_product}), 201

@api_bp.route('/products/<product_id>', methods=['PUT'])
@token_required
def update_product(product_id):
    data = request.json or {}
    nombre = data.get('nombre')
    descripcion = data.get('descripcion', '')
    precio = data.get('precio', 0.0)
    imagen_url = data.get('imagen_url', '')
    categoria = data.get('categoria', 'Otros')
    disponible = data.get('disponible', True)
    
    if not nombre:
        return jsonify({'message': 'El campo nombre es obligatorio.'}), 400
        
    updated = ProductModel.update(
        product_id=product_id,
        nombre=nombre,
        descripcion=descripcion,
        precio=precio,
        imagen_url=imagen_url,
        categoria=categoria,
        disponible=disponible
    )
    
    if updated:
        return jsonify({'success': True, 'product': updated})
    return jsonify({'message': 'Producto no encontrado.'}), 404

@api_bp.route('/products/<product_id>', methods=['DELETE'])
@token_required
def delete_product(product_id):
    success = ProductModel.delete(product_id)
    if success:
        return jsonify({'success': True, 'message': 'Producto eliminado correctamente.'})
    return jsonify({'message': 'Producto no encontrado.'}), 404

# ----------------- ENDPOINT DE VISITAS -----------------

@api_bp.route('/visits', methods=['GET', 'POST'])
def handle_visits():
    """Lee, incrementa y retorna el contador de visitas."""
    data_dir = current_app.config.get('DATA_DIR') or current_app.root_path
    if not os.path.exists(data_dir):
        try:
            os.makedirs(data_dir, exist_ok=True)
        except:
            data_dir = current_app.root_path
            
    file_path = os.path.join(data_dir, 'visitas.txt')
    initial_count = 1432
    
    count = initial_count
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r') as f:
                content = f.read().strip()
                if content.isdigit():
                    count = int(content)
        except:
            pass
            
    # Solo incrementamos la visita en POST, o si el parámetro increment está en GET
    should_increment = request.method == 'POST' or request.args.get('increment') == 'true'
    if should_increment:
        count += 1
        try:
            with open(file_path, 'w') as f:
                f.write(str(count))
        except:
            pass
            
    # Formatear a 6 dígitos con ceros a la izquierda
    formatted_count = "{:06d}".format(count)
    return jsonify({'visits': count, 'formatted': list(formatted_count)})

# ----------------- ENDPOINTS DE CONFIGURACIÓN DE WHATSAPP -----------------

@api_bp.route('/whatsapp-group', methods=['GET'])
def get_whatsapp_group():
    data_dir = current_app.config.get('DATA_DIR') or current_app.root_path
    file_path = os.path.join(data_dir, 'whatsapp_group.txt')
    link = ''
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                link = f.read().strip()
        except:
            pass
    
    whatsapp_phone = current_app.config.get('WHATSAPP_PHONE', '59175892296')
    return jsonify({'link': link, 'phone': whatsapp_phone})

@api_bp.route('/settings/whatsapp-group', methods=['POST'])
@token_required
def update_whatsapp_group():
    data = request.json or {}
    link = data.get('link', '').strip()
    
    data_dir = current_app.config.get('DATA_DIR') or current_app.root_path
    if not os.path.exists(data_dir):
        try:
            os.makedirs(data_dir, exist_ok=True)
        except:
            data_dir = current_app.root_path
            
    file_path = os.path.join(data_dir, 'whatsapp_group.txt')
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(link)
        return jsonify({'success': True, 'link': link, 'message': 'Link de WhatsApp actualizado exitosamente.'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error al guardar el enlace: {str(e)}'}), 500

# ----------------- ENDPOINT DE SUBIDA DE IMÁGENES -----------------

@api_bp.route('/upload', methods=['POST'])
@token_required
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No se envió ningún archivo.'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'Nombre de archivo vacío.'}), 400
        
    if supabase is None:
        return jsonify({'message': 'Supabase no está configurado en el servidor.'}), 500

    try:
        # Obtener la extensión del archivo
        _, ext = os.path.splitext(file.filename)
        # Generar un nombre único para evitar colisiones
        unique_filename = f"prod_{uuid.uuid4().hex}{ext}"
        
        # Leer los bytes del archivo
        file_bytes = file.read()
        
        # Subir a Supabase Storage en el bucket 'productos'
        bucket_name = 'productos'
        
        # Guardar en Supabase Storage
        supabase.storage.from_(bucket_name).upload(
            path=unique_filename,
            file=file_bytes,
            file_options={"content-type": file.content_type}
        )
        
        # Obtener la URL pública del archivo
        public_url = supabase.storage.from_(bucket_name).get_public_url(unique_filename)
        
        return jsonify({
            'success': True,
            'url': public_url,
            'filename': unique_filename
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error al subir archivo a Supabase Storage: {str(e)}'}), 500
