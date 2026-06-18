import os
from flask import Flask
from flask_cors import CORS
from supabase import create_client, Client
from config import Config

# Cliente global de Supabase
supabase: Client = None

def create_app():
    # Inicializar aplicación Flask como API pura (sin templates ni static locales)
    app = Flask(__name__)
    
    app.config.from_object(Config)

    # Habilitar CORS para permitir peticiones del frontend (por ejemplo, desde Vercel o local en localhost:5173)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

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
        app.logger.warning("Supabase no configurado o con valores dummy. Usando modo mock.")
        supabase = None

    # Registrar Blueprints de los controladores de la API
    from app.controllers.api_controller import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    return app
