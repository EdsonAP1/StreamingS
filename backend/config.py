import os
from dotenv import load_dotenv

# Cargar variables de entorno desde el archivo .env
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('FLASK_SECRET_KEY', 'default-retro-secret-key-98765')
    SUPABASE_URL = os.environ.get('SUPABASE_URL', 'https://dummy.supabase.co')
    SUPABASE_KEY = os.environ.get('SUPABASE_KEY', 'dummy-key')
    
    # Credenciales por defecto para el administrador
    ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'edson')
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'aruquipa12')
    
    # Teléfono de WhatsApp para redireccionar compras (código de país + número, sin signos + ni espacios)
    WHATSAPP_PHONE = os.environ.get('WHATSAPP_PHONE', '59175892296')
    
    # Directorio para almacenar archivos de datos locales persistentes (como visitas y link de WhatsApp)
    DATA_DIR = os.environ.get('DATA_DIR', None)
