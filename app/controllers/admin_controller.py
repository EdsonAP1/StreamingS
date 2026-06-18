import os
from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app
from werkzeug.utils import secure_filename
from app.models.auth_model import AuthModel
from app.models.product_model import ProductModel

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def handle_image_upload(request_files, current_url):
    """Maneja la subida de archivos de imagen. Retorna la URL de la imagen guardada o la actual."""
    if 'imagen_archivo' not in request_files:
        return current_url
        
    file = request_files['imagen_archivo']
    if file and file.filename != '' and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Carpeta destino de subidas: app/views/static/uploads
        upload_folder = os.path.join(current_app.root_path, 'views', 'static', 'uploads')
        
        # Crear la carpeta de subidas si no existe
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
            
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)
        return f'/static/uploads/{filename}'
        
    return current_url

@admin_bp.route('/login', methods=['GET', 'POST'])
def login():
    """Maneja el inicio de sesión del administrador."""
    if AuthModel.is_authenticated():
        return redirect(url_for('admin.dashboard'))

    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        if AuthModel.authenticate(username, password):
            AuthModel.login_user(username)
            flash('¡Acceso concedido! Bienvenido al panel de control.', 'success')
            return redirect(url_for('admin.dashboard'))
        else:
            flash('¡ACCESO DENEGADO! Inserta otra moneda (credenciales inválidas).', 'error')

    return render_template('login.html')

@admin_bp.route('/logout')
def logout():
    """Cierra la sesión del administrador."""
    AuthModel.logout_user()
    flash('Sesión terminada. ¡Gracias por jugar!', 'success')
    return redirect(url_for('admin.login'))

def get_whatsapp_group_link():
    data_dir = current_app.config.get('DATA_DIR') or current_app.root_path
    file_path = os.path.join(data_dir, 'whatsapp_group.txt')
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read().strip()
        except:
            pass
    return ''

def set_whatsapp_group_link(link):
    data_dir = current_app.config.get('DATA_DIR') or current_app.root_path
    if not os.path.exists(data_dir):
        try:
            os.makedirs(data_dir, exist_ok=True)
        except Exception as e:
            print(f"Error al crear DATA_DIR {data_dir}: {e}")
            data_dir = current_app.root_path
            
    file_path = os.path.join(data_dir, 'whatsapp_group.txt')
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(link)
    except Exception as e:
        print(f"Error saving whatsapp group link: {e}")

@admin_bp.route('/dashboard')
def dashboard():
    """Muestra el panel de administración con la tabla de productos."""
    if not AuthModel.is_authenticated():
        flash('Debes iniciar sesión para acceder al panel.', 'error')
        return redirect(url_for('admin.login'))
    
    products = ProductModel.get_all()
    whatsapp_group = get_whatsapp_group_link()
    return render_template('dashboard.html', products=products, whatsapp_group=whatsapp_group)

@admin_bp.route('/settings/whatsapp-group', methods=['POST'])
def update_whatsapp_group():
    if not AuthModel.is_authenticated():
        return redirect(url_for('admin.login'))
    
    link = request.form.get('whatsapp_group_link', '').strip()
    set_whatsapp_group_link(link)
    flash('¡Link del grupo de WhatsApp actualizado exitosamente!', 'success')
    return redirect(url_for('admin.dashboard'))

@admin_bp.route('/product/new', methods=['POST'])
def create_product():
    """Crea un nuevo producto."""
    if not AuthModel.is_authenticated():
        return redirect(url_for('admin.login'))
    
    nombre = request.form.get('nombre')
    descripcion = request.form.get('descripcion')
    precio = request.form.get('precio')
    imagen_url = request.form.get('imagen_url')
    categoria = request.form.get('categoria')
    
    if not nombre or not precio:
        flash('El nombre y el precio son requeridos.', 'error')
        return redirect(url_for('admin.dashboard'))

    # Procesar subida de archivo
    imagen_url = handle_image_upload(request.files, imagen_url)

    result = ProductModel.create(nombre, descripcion, precio, imagen_url, categoria)
    if result:
        flash(f'¡Producto "{nombre}" creado con éxito!', 'success')
    else:
        flash('Ocurrió un error al crear el producto.', 'error')
        
    return redirect(url_for('admin.dashboard'))

@admin_bp.route('/product/edit/<product_id>', methods=['POST'])
def edit_product(product_id):
    """Actualiza un producto existente."""
    if not AuthModel.is_authenticated():
        return redirect(url_for('admin.login'))
    
    nombre = request.form.get('nombre')
    descripcion = request.form.get('descripcion')
    precio = request.form.get('precio')
    imagen_url = request.form.get('imagen_url')
    categoria = request.form.get('categoria')
    disponible = request.form.get('disponible') == 'on'
    
    if not nombre or not precio:
        flash('El nombre y el precio son requeridos.', 'error')
        return redirect(url_for('admin.dashboard'))

    # Procesar subida de archivo (si se sube una nueva imagen, se actualiza, si no, conserva la URL actual)
    imagen_url = handle_image_upload(request.files, imagen_url)

    result = ProductModel.update(product_id, nombre, descripcion, precio, imagen_url, categoria, disponible)
    if result:
        flash(f'¡Producto "{nombre}" actualizado con éxito!', 'success')
    else:
        flash('Ocurrió un error al actualizar el producto.', 'error')
        
    return redirect(url_for('admin.dashboard'))

@admin_bp.route('/product/delete/<product_id>', methods=['POST'])
def delete_product(product_id):
    """Elimina un producto."""
    if not AuthModel.is_authenticated():
        return redirect(url_for('admin.login'))
    
    result = ProductModel.delete(product_id)
    if result:
        flash('¡Producto eliminado con éxito!', 'success')
    else:
        flash('Ocurrió un error al intentar eliminar el producto.', 'error')
        
    return redirect(url_for('admin.dashboard'))

