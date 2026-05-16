# suturateatro_web

Sitio estatico de Sutura Teatro servido en:

- https://sutura.ddns.net/web/

## Estructura

- `index.html`: pagina principal.
- `assets/`: estilos, JavaScript, tipografias e imagenes.
- Carpetas por pagina: `compania/`, `proyectos/`, `contacto/`, etc.
- `robots.txt` y `sitemap.xml`: archivos SEO basicos.

## Despliegue

Nginx sirve `/web/` desde `/var/www/dashboard/web`. En este servidor esa ruta apunta a este repositorio:

`/home/trescejas/REPOS/suturateatro_web`
