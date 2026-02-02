# Digital Gamebooks (prototipo)

Pequeña app web en React + Vite para consultar entradas de libros de aventuras de mesa con búsqueda por número y selector de idioma. Mock de datos en local y preparada para desplegar en Azure Static Web Apps (plan gratuito).

## Requisitos
- Node 18+
- npm (incluido con Node)

## Scripts
- `npm install` instala dependencias.
- `npm run dev` levanta el entorno local en `http://localhost:5173`.
- `npm run build` genera la versión estática en `dist/`.
- `npm run preview` sirve el build para verificación.

## Estructura breve
- `src/data/catalog.ts`: catálogo de juegos (id, idiomas, rango de entradas).
- `src/data/entries.ts`: entradas mock por juego/idioma.
- `src/App.tsx`: UI principal con selector de juego/idioma y buscador.
- `src/index.css` / `src/App.css`: estilos responsive, tema oscuro con acentos.

## Despliegue en Azure Static Web Apps (Free)
1) Crea el recurso en Azure Portal seleccionando GitHub como origen y la rama principal. Ruta de app: `/`, comando de build: `npm run build`, directorio de artefactos: `dist`.
2) Añade el secreto `AZURE_STATIC_WEB_APPS_API_TOKEN` en GitHub (lo da el asistente de Azure).
3) El workflow `.github/workflows/azure-static-web-apps.yml` construye y publica la app con cada push.

## Datos adicionales
Los datos son estáticos para la demo. Si necesitas edición en vivo, se puede añadir Azure Functions + Table Storage (free/consumo) más adelante.
