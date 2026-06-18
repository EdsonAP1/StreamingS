import hashlib
from flask import current_app
from config import Config

class AuthModel:
    @staticmethod
    def authenticate(username, password):
        """Verifica si las credenciales coinciden con las del administrador."""
        return username == Config.ADMIN_USERNAME and password == Config.ADMIN_PASSWORD

    @staticmethod
    def generate_token():
        """Genera un token de sesión seguro y determinista basado en el entorno."""
        secret = current_app.config.get('SECRET_KEY', 'default-key')
        password = current_app.config.get('ADMIN_PASSWORD', 'default-pwd')
        # Crear un token hash SHA-256 único para la sesión del servidor
        token = hashlib.sha256(f"session-{secret}-{password}".encode('utf-8')).hexdigest()
        return token

    @staticmethod
    def verify_token(token):
        """Verifica si el token provisto coincide con el token generado."""
        if not token:
            return False
        expected_token = AuthModel.generate_token()
        return token == expected_token
