// Pinta la página a partir de window.DATOS (datos.js). No hace falta tocar este archivo.
(function () {
  const D = window.DATOS;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pesos = (n) => "$" + Number(n).toLocaleString("es-CO");
  const wa = (texto) => `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(texto || D.mensajeWhatsapp)}`;
  const mapa = `https://www.google.com/maps/search/${encodeURIComponent(`${D.nombre} ${D.tipo} ${D.barrio} ${D.ciudad}`)}`;
  const ext = 'target="_blank" rel="noopener"';
  const icoWa = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>';

  const r = document.documentElement.style;
  r.setProperty("--fondo", D.colores.fondo);
  r.setProperty("--texto", D.colores.texto);
  r.setProperty("--verde", D.colores.verde);
  r.setProperty("--acento", D.colores.acento);
  document.title = `${D.nombre} · ${D.tipo} en ${D.barrio}, ${D.ciudad}`;
  const P = D.portada;

  const demo = D.demo ? `<a class="demo" href="${esc(D.demo.enlace)}" ${ext}>${esc(D.demo.texto)} <span aria-hidden="true">↗</span></a>` : "";
  const cinta = [...D.cinta, ...D.cinta].map((t) => `<span>${esc(t)}</span><span class="cinta__punto" aria-hidden="true">✺</span>`).join("");

  const platos = D.menu.map((p) => `
    <article class="plato" data-categoria="${esc(p.categoria)}">
      <figure class="plato__foto">${p.foto ? `<img src="${esc(p.foto)}" alt="${esc(p.nombre)}" loading="lazy">` : ""}
        ${p.favorito ? '<span class="plato__sello">Favorito</span>' : ""}</figure>
      <div class="plato__info">
        <h3>${esc(p.nombre)}</h3>
        <p>${esc(p.detalle)}</p>
        <div class="plato__pie">
          <strong>${pesos(p.precio)}</strong>
          <a class="pedir" href="${wa(`Hola, quiero pedir: ${p.nombre} (${pesos(p.precio)})`)}" ${ext} aria-label="Pedir ${esc(p.nombre)} por WhatsApp">+ Pedir</a>
        </div>
      </div>
    </article>`).join("");

  const filtros = ["Todo", ...D.categorias].map((c, i) =>
    `<button type="button" class="filtro" aria-pressed="${i === 0}" data-filtro="${esc(c)}">${esc(c)}</button>`).join("");

  const resenas = D.resenas.length ? `
    <section class="seccion" aria-labelledby="t-resenas"><div class="contenedor">
      <h2 id="t-resenas" class="titulo">Lo que dicen en Google</h2>
      <div class="resenas">${D.resenas.map((x) => `<blockquote><p>“${esc(x.texto)}”</p><cite>${esc(x.autor)} · ${"★".repeat(x.estrellas || 5)}</cite></blockquote>`).join("")}</div>
    </div></section>` : "";

  document.getElementById("app").innerHTML = `
  ${demo}
  <header class="barra">
    <a class="marca" href="#inicio">${esc(D.nombre)}<small>${esc(D.tipo)}</small></a>
    <nav class="menu" aria-label="Secciones"><a href="#carta">Carta</a><a href="#domicilio">Domicilio</a><a href="#visita">Visita</a></nav>
    <a class="boton boton--chico" href="${wa()}" ${ext}>Pedir</a>
  </header>

  <main>
    <section class="portada" id="inicio"><div class="contenedor portada__grid">
      <div class="portada__texto">
        <p class="etiqueta entra" style="--d:0">${esc(P.etiqueta)}</p>
        <h1 class="portada__titulo entra" style="--d:1">${esc(P.titulo)} <em>${esc(P.tituloAcento)}</em></h1>
        <p class="portada__lead entra" style="--d:2">${esc(P.texto)}</p>
        <div class="acciones entra" style="--d:3">
          <a class="boton" href="${wa()}" ${ext}>${icoWa} Pedir por WhatsApp</a>
          <a class="boton boton--borde" href="#carta">Ver la carta</a>
        </div>
        <ul class="datos entra" style="--d:4">${P.datos.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
      </div>
      <div class="portada__media entra" style="--d:2">
        <figure class="portada__foto"><img src="${esc(P.foto)}" alt="Canastas de patacón rellenas" fetchpriority="high"></figure>
        <p class="sello-giro" aria-hidden="true"><span>${esc(P.sello)}</span></p>
      </div>
    </div></section>

    <div class="cinta" aria-hidden="true"><div class="cinta__pista">${cinta}</div></div>

    <section class="seccion carta" id="carta" aria-labelledby="t-carta"><div class="contenedor">
      <div class="carta__cabeza">
        <div><p class="etiqueta">La carta</p><h2 id="t-carta" class="titulo">Lo que sale<br><em>de la cocina</em></h2></div>
        <div class="filtros" role="group" aria-label="Filtrar la carta">${filtros}</div>
      </div>
      <div class="platos">${platos}</div>
    </div></section>

    <section class="seccion domicilio" id="domicilio" aria-labelledby="t-dom"><div class="contenedor domicilio__grid">
      <div>
        <p class="etiqueta etiqueta--clara">Domicilios</p>
        <h2 id="t-dom" class="titulo">${esc(D.domicilio.titulo)}</h2>
        <dl class="domicilio__datos"><div><dt>Zonas</dt><dd>${esc(D.domicilio.zonas)}</dd></div><div><dt>Pago</dt><dd>${esc(D.domicilio.pago)}</dd></div></dl>
      </div>
      <ol class="pasos">${D.domicilio.pasos.map((p, i) => `<li><span class="pasos__n">${i + 1}</span><div><h3>${esc(p.titulo)}</h3><p>${esc(p.texto)}</p></div></li>`).join("")}
        <li class="pasos__accion"><a class="boton boton--claro" href="${wa()}" ${ext}>${icoWa} Hacer mi pedido</a></li></ol>
    </div></section>

    <section class="seccion lugar" aria-labelledby="t-lugar"><div class="contenedor lugar__grid">
      <figure class="lugar__foto"><img src="${esc(D.lugar.foto)}" alt="Mesas del restaurante" loading="lazy"></figure>
      <div><p class="etiqueta">El lugar</p><h2 id="t-lugar" class="titulo titulo--medio">${esc(D.lugar.titulo)}</h2><p class="lugar__texto">${esc(D.lugar.texto)}</p></div>
    </div></section>

    ${resenas}

    <section class="seccion visita" id="visita" aria-labelledby="t-visita"><div class="contenedor visita__grid">
      <div>
        <p class="etiqueta">Visítanos</p>
        <h2 id="t-visita" class="barrio">${esc(D.barrio)}<span>${esc(D.ciudad)}</span></h2>
        <a class="enlace" href="${mapa}" ${ext}>Ver en Google Maps →</a>
      </div>
      <dl class="horario">${D.horario.map((h) => `<div><dt>${esc(h.dias)}</dt><dd>${esc(h.horas)}</dd></div>`).join("")}</dl>
    </div></section>

    <section class="final" aria-labelledby="t-final"><div class="contenedor">
      <h2 id="t-final" class="final__titulo">¿Ya almorzaste?</h2>
      <a class="boton boton--grande" href="${wa()}" ${ext}>${icoWa} Pedir por WhatsApp</a>
    </div></section>
  </main>

  <footer class="pie"><div class="contenedor pie__fila">
    <span class="marca">${esc(D.nombre)}</span>
    <span>${esc(D.barrio)}, ${esc(D.ciudad)}</span>
    <span>© ${new Date().getFullYear()}</span>
    <a href="creditos.html">Créditos de fotos</a>
    ${D.demo ? `<a href="${esc(D.demo.enlace)}" ${ext}>${esc(D.demo.texto)}</a>` : ""}
  </div></footer>

  <a class="barra-movil" href="${wa()}" ${ext}>${icoWa} Pedir a domicilio</a>`;

  // Filtros de la carta
  const botones = document.querySelectorAll(".filtro");
  botones.forEach((b) => b.addEventListener("click", () => {
    botones.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const f = b.dataset.filtro;
    document.querySelectorAll(".plato").forEach((p) => { p.hidden = f !== "Todo" && p.dataset.categoria !== f; });
  }));

  requestAnimationFrame(() => document.body.classList.add("listo"));
})();
