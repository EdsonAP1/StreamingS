import os
from flask import Blueprint, render_template, current_app
from app.models.product_model import ProductModel

public_bp = Blueprint('public', __name__)

def get_and_increment_visits():
    """Lee el contador de visitas desde un archivo de texto, lo incrementa y lo guarda."""
    data_dir = current_app.config.get('DATA_DIR') or current_app.root_path
    if not os.path.exists(data_dir):
        try:
            os.makedirs(data_dir, exist_ok=True)
        except Exception as e:
            print(f"Error al crear DATA_DIR {data_dir}: {e}")
            data_dir = current_app.root_path
            
    file_path = os.path.join(data_dir, 'visitas.txt')
    initial_count = 1432  # Número inicial realista para dar confianza
    
    count = initial_count
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r') as f:
                content = f.read().strip()
                if content.isdigit():
                    count = int(content)
        except Exception as e:
            print(f"Error al leer visitas: {e}")
            
    count += 1
    
    try:
        with open(file_path, 'w') as f:
            f.write(str(count))
    except Exception as e:
        print(f"Error al escribir visitas: {e}")
        
    # Retornar el número formateado con ceros a la izquierda en una lista (ej: ['0', '0', '1', '4', '3', '3'])
    return list("{:06d}".format(count))

from app.controllers.admin_controller import get_whatsapp_group_link

@public_bp.route('/')
def catalog():
    """Ruta para ver el catálogo público."""
    products = ProductModel.get_all()
    whatsapp_phone = current_app.config.get('WHATSAPP_PHONE', '59170000000')
    visit_count = get_and_increment_visits()
    whatsapp_group = get_whatsapp_group_link()
    
    # Mostrar sólo los productos disponibles
    available_products = [p for p in products if p.get('disponible', True)]
    return render_template('catalog.html', products=available_products, whatsapp_phone=whatsapp_phone, visit_count=visit_count, whatsapp_group=whatsapp_group)
