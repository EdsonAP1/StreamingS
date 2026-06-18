# Skill: Diseño Frontend Retro (StreamingS)

## Objetivo
Esta skill define las directrices arquitectónicas, reglas de UI/UX y la estructura de componentes para generar las interfaces web del proyecto "StreamingS", utilizando un estilo pixel art de 8-bits enfocado en máxima conversión.

## Instrucciones para el Agente
Cada vez que interactúes con el sistema de vistas (HTML/Jinja2 y CSS), estás obligado a respetar las siguientes reglas técnicas y visuales:

### 1. Librerías Base (CDN Obligatorio)
Toda plantilla principal de Jinja (`base.html`) debe inyectar estrictamente en su etiqueta `<head>`:
- **Tipografía:** `https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap`
- **Framework CSS:** `https://unpkg.com/nes.css@2.3.0/css/nes.min.css`

### 2. Tema Principal (Modo Oscuro)
Debes incorporar o generar esta hoja de estilos en línea o en un archivo `custom.css` para forzar el aspecto retro en todo el DOM:
```css
body {
  font-family: 'Press Start 2P', monospace;
  background-color: #121214;
  color: #ffffff;
  font-size: 12px;
}
.pixel-art-img {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}