// Número de WhatsApp de Seraphix (código de país + número, sin "+" ni espacios).
// Si se deja vacío, los botones llevan a la sección de contacto.
const WHATSAPP = "573209349888";

if (WHATSAPP) {
  for (const enlace of document.querySelectorAll("[data-wa]")) {
    enlace.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(enlace.dataset.wa)}`;
    enlace.target = "_blank";
    enlace.rel = "noopener";
  }
}
