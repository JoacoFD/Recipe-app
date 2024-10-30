# App de Recetas 🍽️

Esta aplicación de recetas permite a los usuarios buscar, agregar y guardar recetas, así como gestionar sus favoritas y calificarlas. Desarrollada con Node.js y MongoDB, cuenta con un backend que permite agregar recetas con título, ingredientes y preparación, buscarlas por nombre, marcar como favoritas y asignar calificaciones de 1 a 5 estrellas, calculando el promedio de cada receta. Esta app es ideal para practicar manipulación de datos en MongoDB, crear endpoints en Node.js y realizar comunicación entre frontend y backend.
## Índice

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)

## Características

- Agregar recetas con título, ingredientes y preparación.
- Buscar recetas por título.
- Marcar recetas como favoritas y ver recetas favoritas.
- Cargar recetas de manera dinámica desde el backend.

## Tecnologías

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Flask (Python)
- **Base de Datos**: MongoDB
- **Estilos**: Font Awesome para iconos

## Instalación

Para instalar y ejecutar la aplicación localmente, sigue estos pasos:

1. **Clona el repositorio**:
   ```bash
   git clone <URL del repositorio>
   cd nombre-del-repositorio

2.**Crea un entorno virtual y actívalo:**
python -m venv .venv

source .venv/bin/activate  # En Linux/Mac

.venv\Scripts\activate  # En Windows

3.**Instala las dependencias**:
pip install -r requirements.txt


4.**Inicia el servidor: Asegúrate de tener MongoDB ejecutándose y luego ejecuta:**:

python backend/server.js

5.**Abre el archivo HTML en tu navegador: Abre frontend/index.html en tu navegador preferido.**
