import os
from flask import Flask
from supabase import create_client, Client
from config import Config

# Cliente global de Supabase
supabase: Client = None

def create_app():
    # Inicializar aplicación Flask indicando las carpetas de vistas
    app = Flask(__name__, 
                template_folder='views/templates', 
                static_folder='views/static')
    
    app.config.from_object(Config)

    # Inicialización segura de Supabase
    global supabase
    supabase_url = app.config.get('SUPABASE_URL')
    supabase_key = app.config.get('SUPABASE_KEY')
    
    if supabase_url and supabase_key and "dummy" not in supabase_url:
        try:
            supabase = create_client(supabase_url, supabase_key)
            app.logger.info("Cliente de Supabase inicializado correctamente.")
        except Exception as e:
            app.logger.error(f"Error al inicializar el cliente de Supabase: {e}")
            supabase = None
    else:
        app.logger.warning("Supabase no configurado o configurado con valores dummy. Se usará modo offline/mock.")
        supabase = None

    # Registrar Blueprints de Controladores
    from app.controllers.public_controller import public_bp
    from app.controllers.admin_controller import admin_bp

    app.register_blueprint(public_bp)
    app.register_blueprint(admin_bp)

    return app
