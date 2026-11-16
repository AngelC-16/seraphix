# Cómo adaptar esta demo a un cliente (≈10 minutos)

1. **Fotos**: pon las fotos del cliente en `fotos/` (JPG o WebP, máx. ~300 KB cada una; horizontales para la
   portada y el local, cuadradas o 4:3 para el resto).
2. **Datos**: abre `datos.js` y cambia solo lo que está entre comillas y los números:
   nombre, barrio, WhatsApp (573XXXXXXXXX), colores, textos, precios, horario y rutas de las fotos.
3. **Reseñas**: copia 2–4 reseñas **reales** de su Google en `resenas` (`{ texto, autor, estrellas }`).
   Si lo dejas vacío, la sección no aparece. Nunca inventar reseñas.
4. **Quitar la marca de demo**: en `datos.js` pon `demo: null`.
5. **Mensaje de WhatsApp**: cambia `mensajeWhatsapp` por algo como "Hola, quiero reservar un turno".
6. **Créditos**: si usas solo fotos del cliente, borra el enlace "Créditos de fotos" del pie en `app.js`
   y el archivo `creditos.html`.
7. **Favicon**: edita las letras y colores de `favicon.svg`.

Para verla: abre la carpeta con un servidor local (`python -m http.server`) o súbela; desde `file://` también
funciona, pero las fuentes pueden no cargar.

No toques `app.js` ni `estilos.css` salvo para cambios de diseño.
