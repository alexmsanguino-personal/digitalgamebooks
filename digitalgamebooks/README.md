# Digital Gamebooks

Aplicación React + Vite para consultar libros de aventuras por misión y número de evento, sin tener que recorrer el PDF durante la partida.

## Estado actual

- Biblioteca visual con libros disponibles y próximos títulos.
- Big Trouble in Little China digitalizado en español: 15 misiones y 67 eventos (`1.1`–`15.2`).
- Selector agrupado por misión y navegación anterior/siguiente.
- Datos separados por libro e idioma, preparados para añadir traducciones.
- Diseño adaptable a escritorio y móvil.

## Desarrollo

```bash
npm install
npm run dev
```

Comprobaciones:

```bash
npm run build
npm run lint
```

## Datos de los libros

La versión web no necesita una base de datos por ahora. Los eventos se guardan como JSON estático versionado, lo que mantiene el despliegue sencillo y gratuito:

```text
src/data/books/
  big-trouble-little-china.es.json
```

Cada archivo declara `bookId`, `language` y un diccionario `entries`. Una futura traducción puede añadirse como otro archivo, por ejemplo `big-trouble-little-china.en.json`, y registrarse en `src/App.tsx`.

El JSON español se regenera a partir de la extracción de texto del PDF con:

```bash
npm run data:big-trouble
```

El generador está en `scripts/build-big-trouble-data.cjs` y valida que estén presentes los 67 identificadores esperados antes de sobrescribir el archivo de datos.
