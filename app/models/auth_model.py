from flask import session
from config import Config

class AuthModel:
    @staticmethod
    def authenticate(username, password):
        """Verifica si las credenciales coinciden con las configuradas en el entorno."""
        return username == Config.ADMIN_USERNAME and password == Config.ADMIN_PASSWORD

    @staticmethod
    def login_user(username):
        """Guarda la sesión del usuario administrador."""
        session['logged_in'] = True
        session['username'] = username

    @staticmethod
    def logout_user():
        """Elimina la sesión del administrador."""
        session.pop('logged_in', None)
        session.pop('username', None)

    @staticmethod
    def is_authenticated():
        """Retorna verdadero si el administrador está logueado."""
        return session.get('logged_in', False)
