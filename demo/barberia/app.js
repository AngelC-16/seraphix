// Pinta la página a partir de window.DATOS (datos.js). No hace falta tocar este archivo.
(function () {
  const D = window.DATOS;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pesos = (n) => "$" + Number(n).toLocaleString("es-CO");
  const wa = (texto) => `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(texto || D.mensajeWhatsapp)}`;
  const mapa = `https://www.google.com/maps/search/${encodeURIComponent(`${D.tipo} ${D.nombre} ${D.barrio} ${D.ciudad}`)}`;
  const ext = 'target="_blank" rel="noopener"';
  const icoWa = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>';

  const r = document.documentElement.style;
  r.setProperty("--fondo", D.colores.fondo);
  r.setProperty("--texto", D.colores.texto);
  r.setProperty("--acento", D.colores.acento);
  document.title = `${D.nombre} · ${D.tipo} en ${D.barrio}, ${D.ciudad}`;

  // "Desde": el precio más bajo del primer grupo (los cortes), no el de un extra como las cejas.
  const desde = Math.min(...D.servicios[0].items.map((i) => i.precio));
  const P = D.portada;

  const demo = D.demo ? `<a class="demo" href="${esc(D.demo.enlace)}" ${ext}>${esc(D.demo.texto)} <span aria-hidden="true">↗</span></a>` : "";

  const carta = D.servicios.map((g) => `
    <div class="grupo">
      <h3 class="grupo__titulo">${esc(g.grupo)}</h3>
      <ul class="lista">${g.items.map((i) => `
        <li class="item${i.destacado ? " item--destacado" : ""}">
          <span class="item__nombre">${esc(i.nombre)}${i.destacado ? ' <em class="sello">Favorito</em>' : ""}</span>
          <span class="item__puntos" aria-hidden="true"></span>
          <span class="item__precio">${pesos(i.precio)}</span>
          <span class="item__detalle">${esc(i.detalle)}</span>
        </li>`).join("")}
      </ul>
    </div>`).join("");

  const galeria = D.galeria.map((src, n) => `<figure class="foto g${n + 1}"><img src="${esc(src)}" alt="" loading="lazy"></figure>`).join("");

  const resenas = D.resenas.length ? `
    <section class="seccion resenas" aria-labelledby="t-resenas"><div class="contenedor">
      <h2 id="t-resenas" class="titulo">Lo que dicen en Google</h2>
      <div class="resenas__lista">${D.resenas.map((x) => `<blockquote><p>“${esc(x.texto)}”</p><cite>${esc(x.autor)} · ${"★".repeat(x.estrellas || 5)}</cite></blockquote>`).join("")}</div>
    </div></section>` : "";

  document.getElementById("app").innerHTML = `
  ${demo}
  <header class="barra">
    <a class="marca" href="#inicio"><span class="marca__nombre">${esc(D.nombre)}</span><span class="marca__tipo">${esc(D.tipo)}</span></a>
    <nav class="menu" aria-label="Secciones"><a href="#carta">Precios</a><a href="#trabajos">Trabajos</a><a href="#visita">Visita</a></nav>
    <a class="boton boton--chico" href="${wa()}" ${ext}>Reservar</a>
  </header>

  <main>
    <section class="portada" id="inicio">
      <img class="portada__foto" src="${esc(P.foto)}" alt="Barbero haciendo un corte con peine y máquina" fetchpriority="high">
      <div class="portada__velo"></div>
      <div class="contenedor portada__contenido">
        <p class="etiqueta entra" style="--d:0">${esc(P.etiqueta)}</p>
        <h1 class="portada__titulo"><span class="entra" style="--d:1">${esc(P.titulo[0])}</span><span class="entra acento" style="--d:2">${esc(P.titulo[1])}</span></h1>
        <p class="portada__texto entra" style="--d:3">${esc(P.texto)}</p>
        <div class="acciones entra" style="--d:4">
          <a class="boton" href="${wa()}" ${ext}>${icoWa} Reservar por WhatsApp</a>
          <a class="boton boton--borde" href="#carta">Ver precios</a>
        </div>
      </div>
      <ul class="cinta" aria-label="Datos rápidos">${P.datos.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
    </section>

    <section class="seccion carta" id="carta" aria-labelledby="t-carta"><div class="contenedor carta__grid">
      <div class="carta__cabeza">
        <p class="etiqueta">La carta</p>
        <h2 id="t-carta" class="titulo">Precios claros,<br>sin sorpresas.</h2>
        <p class="nota">Desde ${pesos(desde)}. Precios en pesos colombianos.</p>
        <figure class="foto carta__foto"><img src="${esc(D.fotoServicios)}" alt="Navaja de barbero sobre madera" loading="lazy"></figure>
      </div>
      <div class="carta__lista">${carta}</div>
    </div></section>

    <section class="seccion trabajos" id="trabajos" aria-labelledby="t-trabajos"><div class="contenedor">
      <div class="fila-cabeza">
        <h2 id="t-trabajos" class="titulo">El oficio,<br>de cerca.</h2>
        <p class="nota">Navaja, brocha y máquina. Herramientas que se limpian entre cada cliente.</p>
      </div>
      <div class="mosaico">${galeria}</div>
    </div></section>

    <section class="casa" aria-labelledby="t-casa">
      <figure class="casa__foto"><img src="${esc(D.casa.foto)}" alt="Sillas de barbero en el local" loading="lazy"></figure>
      <div class="contenedor casa__texto">
        <h2 id="t-casa" class="titulo titulo--grande">${esc(D.casa.titulo)}</h2>
        <div class="casa__cols">
          <p>${esc(D.casa.texto)}</p>
          <ul class="cifras">${D.casa.cifras.map((c) => `<li><strong>${esc(c.valor)}</strong><span>${esc(c.texto)}</span></li>`).join("")}</ul>
        </div>
      </div>
    </section>

    ${resenas}

    <section class="seccion visita" id="visita" aria-labelledby="t-visita"><div class="contenedor">
      <p class="etiqueta">Visítanos</p>
      <h2 id="t-visita" class="barrio">${esc(D.barrio)}<span>${esc(D.ciudad)}</span></h2>
      <div class="visita__grid">
        <dl class="horario">${D.horario.map((h) => `<div><dt>${esc(h.dias)}</dt><dd>${esc(h.horas)}</dd></div>`).join("")}</dl>
        <div class="visita__acciones">
          <a class="boton" href="${wa()}" ${ext}>${icoWa} Pedir turno</a>
          <a class="enlace" href="${mapa}" ${ext}>Ver en Google Maps →</a>
        </div>
      </div>
      <figure class="foto visita__foto"><img src="${esc(D.fotoVisita)}" alt="Fachada de una barbería con letrero de neón" loading="lazy"></figure>
    </div></section>

    <section class="final" aria-labelledby="t-final"><div class="contenedor">
      <h2 id="t-final" class="final__titulo">¿Te toca<br><span class="acento">corte?</span></h2>
      <a class="boton boton--grande" href="${wa()}" ${ext}>${icoWa} Reservar por WhatsApp</a>
    </div></section>
  </main>

  <footer class="pie"><div class="contenedor pie__fila">
    <span class="marca__nombre">${esc(D.nombre)}</span>
    <span>${esc(D.barrio)}, ${esc(D.ciudad)}</span>
    <span>© ${new Date().getFullYear()}</span>
    <a href="creditos.html">Créditos de fotos</a>
    ${D.demo ? `<a href="${esc(D.demo.enlace)}" ${ext}>${esc(D.demo.texto)}</a>` : ""}
  </div></footer>

  <a class="barra-movil" href="${wa()}" ${ext}>${icoWa} Reservar por WhatsApp</a>`;

  // Menú: subrayado suave al pasar; foto con zoom: todo en CSS. Aquí solo la entrada inicial.
  requestAnimationFrame(() => document.body.classList.add("listo"));
})();
