# Sutura Company Web

Proyecto reservado para replicar la web publica de la compania en este servidor.

## Objetivo

- Web publica rapida, editable y con buen SEO.
- Tracking propio con Matomo.
- Descargas servidas por Zipline o por Nginx con eventos de Matomo.
- Panel interno para revisar visitas, descargas, SEO, errores 404 y rendimiento.

## Pendiente

Para replicar la web actual hace falta una de estas dos cosas:

- URL publica de la web actual.
- Export/backup de la web actual con HTML, CSS, imagenes y textos.

Cuando este eso, el flujo recomendado es:

1. Auditar estructura, paginas, imagenes, metadatos y enlaces actuales.
2. Recrear la web como sitio estatico rapido.
3. Anadir sitemap, robots.txt, Open Graph, JSON-LD y redirecciones.
4. Insertar tracking Matomo.
5. Publicar detras de Nginx y mantener el dashboard tecnico separado.

La plantilla de tracking esta en:

```bash
/home/trescejas/REPOS/sutura-company-web/matomo-tracking-template.html
```
