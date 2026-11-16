// ===================================================================
//  DATOS DEL NEGOCIO — lo único que hay que cambiar para cada cliente
//  (ver LEEME.md). Las fotos van en la carpeta fotos/.
// ===================================================================
window.DATOS = {
  nombre: "Don Filo",
  tipo: "Barbería",
  barrio: "El Prado",
  ciudad: "Barranquilla",

  // WhatsApp con código de país, sin "+" ni espacios.
  whatsapp: "573209349888",
  mensajeWhatsapp: "Hola, vi la demo de la barbería y quiero una página así para mi negocio",

  colores: { fondo: "#0f0d0b", texto: "#f3ece0", acento: "#d8964a" },

  portada: {
    etiqueta: "Barbería · El Prado, Barranquilla",
    titulo: ["Corte fino.", "Sin afán."],          // la 2.ª línea va en color de acento
    texto: "Degradados, barba con toalla caliente y un tinto mientras esperas. Con cita o por orden de llegada.",
    foto: "fotos/photo-f116285951-960.webp",
    datos: ["Corte desde $25.000", "Lun a sáb · 9 a. m. a 8 p. m.", "Pago en efectivo o Nequi"]
  },

  servicios: [
    { grupo: "Cortes", items: [
      { nombre: "Corte clásico", detalle: "Tijera y máquina · 40 min", precio: 30000 },
      { nombre: "Degradado", detalle: "Bajo, medio o alto", precio: 35000 },
      { nombre: "Corte de niño", detalle: "Hasta 12 años", precio: 25000 } ] },
    { grupo: "Barba", items: [
      { nombre: "Barba perfilada", detalle: "Máquina y navaja", precio: 22000 },
      { nombre: "Afeitado con toalla caliente", detalle: "Navaja, toallas y aceite", precio: 30000 },
      { nombre: "Cejas", detalle: "Con navaja", precio: 8000 } ] },
    { grupo: "Combos", items: [
      { nombre: "Corte + barba", detalle: "El de la casa", precio: 50000, destacado: true },
      { nombre: "Corte, barba y cejas", detalle: "Completo", precio: 55000 } ] }
  ],
  fotoServicios: "fotos/photo-f153967571-500.webp",

  galeria: [
    "fotos/photo-f14976199-960.webp",
    "fotos/photo-f201493987-800.webp",
    "fotos/photo-f44357844-960.webp",
    "fotos/photo-f180596011-960.webp",
    "fotos/photo-f93810599-960.webp"
  ],

  casa: {
    titulo: "Una silla, un barbero, el tiempo que haga falta.",
    texto: "Aquí no se corre. Cada turno tiene su tiempo, se lava, se corta y se termina con navaja. Si llegas sin cita, te ofrecemos un tinto mientras se libera una silla.",
    foto: "fotos/photo-f101285686-recorte.webp",
    cifras: [ { valor: "4", texto: "sillas" }, { valor: "40 min", texto: "por corte" }, { valor: "7", texto: "días a la semana" } ]
  },

  // Reseñas REALES del cliente (de Google). Si está vacío, la sección no aparece.
  resenas: [],

  horario: [
    { dias: "Lunes a sábado", horas: "9 a. m. – 8 p. m." },
    { dias: "Domingo", horas: "10 a. m. – 3 p. m." }
  ],
  fotoVisita: "fotos/photo-f17556889-recorte.webp",

  // Franja "Demo hecha por Seraphix". Para un cliente real: demo: null
  demo: { texto: "Demo hecha por Seraphix", enlace: "https://seraphix.pages.dev/" }
};
