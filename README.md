# Curriculum · Sebastián Valenzuela

Curriculum personal con estética de terminal / BBS: cada sección es un comando
con su salida (R, `sacct`, `ls`, `cat`) y al final hay una consola interactiva.

**Ver en línea:** https://morkx.github.io/curriculum/

## Estructura

- `index.html`: todo el contenido del CV (se lee completo sin JavaScript).
- `css/style.css`: estilos de terminal.
- `js/main.js`: atajos de teclado y consola interactiva (sin dependencias).
- `files/svalenzuela_CV_2026.pdf`: CV descargable.
- `img/about.jpg`: imagen para la vista previa al compartir el enlace.

## Consola

Escribí `help` en la consola. Atajos: `1`–`6` para ir a cada sección, `/` para
enfocar la consola, ↑/↓ para el historial y Tab para autocompletar.

Para agregar un comando, sumalo al objeto `commands` en `js/main.js`.

## Ver en local

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

Se publica con GitHub Pages desde la rama `master`.
