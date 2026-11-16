// ===================================================================
//  DATOS DEL NEGOCIO — lo único que hay que cambiar para cada cliente
//  (ver LEEME.md). Las fotos van en la carpeta fotos/.
// ===================================================================
window.DATOS = {
  nombre: "La Ceiba",
  tipo: "Cocina costeña",
  barrio: "Riomar",
  ciudad: "Barranquilla",

  // WhatsApp con código de país, sin "+" ni espacios.
  whatsapp: "573209349888",
  mensajeWhatsapp: "Hola, vi la demo del restaurante y quiero una página así para mi negocio",

  colores: { fondo: "#f7efe0", texto: "#1f2420", verde: "#1d4a37", acento: "#e2662b" },

  portada: {
    etiqueta: "Cocina costeña · Riomar, Barranquilla",
    titulo: "Sabor de la Costa,",
    tituloAcento: "hecho en casa.",
    texto: "Arepa de huevo, patacón, sancocho los domingos y limonada de coco bien fría. Para comer aquí o pedir a domicilio.",
    foto: "fotos/photo-f129703865-960.webp",
    sello: "Domicilio en Riomar y alrededores",
    datos: ["Almuerzo desde $18.000", "Lun a sáb · 11 a. m. a 9 p. m.", "Domicilio en 40 min aprox."]
  },

  // Cinta que se desliza bajo la portada
  cinta: ["Arepa de huevo", "Patacón pisao", "Sancocho de gallina", "Carimañolas", "Limonada de coco", "Yuca con suero"],

  categorias: ["Fritos", "Platos", "Bebidas"],
  menu: [
    { nombre: "Arepa de huevo", detalle: "Crocante, con huevo entero y carne molida", precio: 6000, categoria: "Fritos", foto: "fotos/photo-f4329840-500.webp", favorito: true },
    { nombre: "Carimañolas", detalle: "De yuca, rellenas de carne o queso", precio: 4500, categoria: "Fritos", foto: "fotos/photo-f4347538-500.webp" },
    { nombre: "Empanadas", detalle: "Masa de maíz, con ají de la casa", precio: 4000, categoria: "Fritos", foto: "fotos/photo-f148899233-500.webp" },
    { nombre: "Patacón pisao", detalle: "Con suero costeño y queso rallado", precio: 8000, categoria: "Fritos", foto: "fotos/photo-f4738440-500.webp" },
    { nombre: "Canastas de patacón", detalle: "Rellenas de camarón en salsa rosada", precio: 18000, categoria: "Platos", foto: "fotos/photo-f129703865-500.webp", favorito: true },
    { nombre: "Sancocho de gallina", detalle: "Solo los domingos, con arroz y aguacate", precio: 22000, categoria: "Platos", foto: "fotos/photo-f150285784-500.webp" },
    { nombre: "Yuca frita con suero", detalle: "Bastones de yuca y suero de la casa", precio: 9000, categoria: "Platos", foto: "fotos/photo-f85144082-500.webp" },
    { nombre: "Maduros con queso", detalle: "Plátano maduro al horno", precio: 7000, categoria: "Platos", foto: "fotos/photo-f6637876-500.webp" },
    { nombre: "Limonada de coco", detalle: "Bien fría, con coco tostado", precio: 9000, categoria: "Bebidas", foto: "fotos/photo-f137118889-500.webp", favorito: true }
  ],

  domicilio: {
    titulo: "Pide por WhatsApp y te llega caliente",
    pasos: [
      { titulo: "Escoge", texto: "Mira la carta y toca «Pedir» en lo que quieras." },
      { titulo: "Escribe", texto: "Se abre WhatsApp con tu pedido listo. Agrega tu dirección." },
      { titulo: "Recibe", texto: "Te confirmamos el valor y sale en unos 40 minutos." }
    ],
    zonas: "Riomar, Altos de Riomar, Villa Santos, Alto Prado y El Golf.",
    pago: "Efectivo, Nequi o transferencia."
  },

  lugar: {
    titulo: "Mesas de madera, ventilador y la radio bajita.",
    texto: "Un sitio pequeño para almorzar sin afán. La cocina se ve desde la mesa y la receta del sancocho es la de la abuela.",
    foto: "fotos/photo-f199837380-960.webp"
  },

  // Reseñas REALES del cliente (de Google). Si está vacío, la sección no aparece.
  resenas: [],

  horario: [
    { dias: "Lunes a sábado", horas: "11 a. m. – 9 p. m." },
    { dias: "Domingo", horas: "11 a. m. – 4 p. m." }
  ],

  // Franja "Demo hecha por Seraphix". Para un cliente real: demo: null
  demo: { texto: "Demo hecha por Seraphix", enlace: "https://angelc-16.github.io/seraphix/" }
};
