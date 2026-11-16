# Seraphix — web

Landing de Seraphix (estudio digital en Barranquilla: webs, app de gestión y bots para negocios) y demos de
portafolio. HTML, CSS y JavaScript sin compilación.

Publicada en Cloudflare Pages: https://seraphix.pages.dev/ (copia en GitHub Pages: https://angelc-16.github.io/seraphix/)

## Estructura

| Ruta | Qué es |
|---|---|
| `index.html`, `estilos.css`, `app.js` | Landing |
| `privacidad.html`, `terminos.html` | Aviso de privacidad (Ley 1581 de 2012) y términos del servicio |
| `assets/` | Logo, favicon, ícono de iPhone, imagen para compartir (`compartir.png`), captura del caso real |
| `assets/fuentes/` | Unbounded y Manrope servidas desde la propia web (licencia SIL OFL 1.1, ver `OFL-*.txt`) |
| `demo/barberia/`, `demo/restaurante/` | Demos de portafolio; cada una se edita desde su `datos.js` (ver su `LEEME.md`) |
| `robots.txt`, `sitemap.xml` | Para buscadores (robots.txt solo tiene efecto con dominio propio) |

## Verla en local

Abrir `index.html` en el navegador, o servir la carpeta:

```
python -m http.server 8000
```

## Cambiar datos

- **Número de WhatsApp:** está en los enlaces `wa.me` de `index.html` (funcionan sin JavaScript) y en `app.js`
  (constante `WHATSAPP`). Cambiar ambos.
- **Precios y plazos:** `index.html` (secciones *Servicios* y *Precios*) y `terminos.html`.
- **Correo de contacto:** pie de `index.html`, `privacidad.html` y `terminos.html`.

## Publicar

Hacer commit y push a `main`; Cloudflare Pages y GitHub Pages actualizan la web en uno o dos minutos. No subir carpetas de pruebas del
navegador (`.taste-skill/`, `shots/`, `.playwright-mcp/`): ya están en `.gitignore`.

## Créditos

- Fuentes: Unbounded y Manrope, SIL Open Font License 1.1.
- Fotos de las demos: Wikimedia Commons, créditos en `demo/*/creditos.html`.
- Caso real: app de gestión del negocio Pollo de la Vieja Vice, con autorización del cliente.
