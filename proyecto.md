# proyecto.md

Actúa como un Arquitecto de Software y Desarrollador Full-Stack experto en Python. Tu tarea es generar el código completo, modular y listo para producción para una aplicación web llamada "StreamingS".

## 1. Descripción del Proyecto
"StreamingS" es una plataforma web para vender cuentas de streaming (Netflix, HBO Max, Disney+, etc.). Tiene dos áreas principales:
- **Catálogo Público:** Una vista estática para los clientes con un diseño visual retro de 8-bits (pixel art). Al hacer clic en el botón "Comprar" de un producto, el usuario debe ser redirigido a WhatsApp con un mensaje preconfigurado que incluye el nombre del producto y el precio.
- **Panel de Administración:** Una ruta web oculta (ej. `/admin/login`) protegida con sesión de usuario. Aquí, el administrador podrá realizar un CRUD (Crear, Leer, Actualizar, Eliminar) de los productos y sus precios.

## 2. Tecnologías Estrictas
- **Lenguaje:** Python 3.10+
- **Framework Backend:** Flask
- **Base de Datos:** Supabase (utilizando la librería oficial `supabase-py`)
- **Motor de Plantillas:** Jinja2 (integrado en Flask)
- **Estilos:** NES.css y Google Fonts ("Press Start 2P") cargados por CDN.
- **Arquitectura:** Patrón Modelo-Vista-Controlador (MVC) estricto.

## 3. Estructura de Directorios a Generar
```text
/StreamingS
│
├── run.py                 # Punto de entrada de la app
├── config.py              # Variables de entorno (SUPABASE_URL, SUPABASE_KEY, FLASK_SECRET_KEY)
├── requirements.txt       # flask, supabase, python-dotenv
│
├── /app
│   ├── __init__.py        # Inicializa Flask, Jinja y el cliente de Supabase
│   │
│   ├── /models            # Capa del MODELO
│   │   ├── __init__.py
│   │   ├── auth_model.py  # Autenticación del admin (hardcoded o en Supabase)
│   │   └── product_model.py # Operaciones CRUD en la tabla "productos" de Supabase
│   │
│   ├── /controllers       # Capa del CONTROLADOR
│   │   ├── __init__.py
│   │   ├── public_controller.py # Rutas principales y renderizado del catálogo
│   │   └── admin_controller.py  # Rutas protegidas (Login, Dashboard)
│   │
│   └── /views             # Capa de la VISTA (Plantillas Jinja)
│       ├── /templates
│       │   ├── base.html       # Layout maestro con llamadas a NES.css
│       │   ├── catalog.html    # Lista de tarjetas de productos
│       │   ├── login.html      # Pantalla de admin (Insert Coin)
│       │   └── dashboard.html  # Tabla de administración
│       └── /static
│           ├── /css
│           │   └── custom.css
│           └── /img            # (Imágenes pixel art de los logos)@