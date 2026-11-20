/* Seraphix v2 · animaciones (sin librerías).
 * 1. Cabecera con fondo al bajar.  2. Entrada del hero.  3. Revelado del logo por luz.
 * 4. Dibujos de líneas en los servicios.  5. Iconos del proceso.  6. Brillo de SERAPHIX al final.
 * Con "reducir movimiento" todo queda quieto y visible. */
(() => {
  "use strict";
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const punteroFino = matchMedia("(hover: hover) and (pointer: fine)").matches;


  /* 1. Cabecera */
  const cabecera = document.querySelector(".cabecera");
  const fondoCabecera = () => cabecera.classList.toggle("con-fondo", scrollY > 24);
  addEventListener("scroll", fondoCabecera, { passive: true });
  fondoCabecera();

  /* 2. La entrada del hero es solo CSS (no depende de este script) */
  const hero = document.querySelector(".hero");

  /* 2b. Botón flotante de WhatsApp: oculto mientras el hero o un botón dorado están a la vista */
  (function botonFlotante() {
    const wa = document.querySelector(".wa-flotante");
    if (!wa || !("IntersectionObserver" in window)) return;
    const vistos = new Set();
    const obs = new IntersectionObserver((es) => {
      for (const e of es) {
        const grande = e.target === hero ? e.intersectionRatio >= 0.15 : e.isIntersecting;
        if (grande && e.isIntersecting) vistos.add(e.target); else vistos.delete(e.target);
      }
      wa.classList.toggle("oculto", vistos.size > 0);
    }, { threshold: [0, 0.15, 1] });
    obs.observe(hero);
    document.querySelectorAll(".boton--oro").forEach((b) => { if (!wa.contains(b)) obs.observe(b); });
  })();

  /* 3. Revelado por luz: un haz enciende el logo en oro, luego pasa un brillo metálico (~3,6 s y se detiene) */
  function revelado() {
    const marca = document.querySelector(".hero__marca");
    if (quieto || !marca) return;
    const oro = marca.querySelector(".hero__logo-quieto");
    const base = marca.querySelector(".hero__logo-base");
    const brillo = marca.querySelector(".hero__logo-brillo");
    const haz = marca.querySelector(".hero__haz");
    const aura = marca.querySelector(".hero__aura");
    const clamp = (v) => Math.min(1, Math.max(0, v));
    const seg = (t, a, b) => clamp((t - a) / (b - a));
    const eio = (x) => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const eout = (x) => 1 - Math.pow(1 - x, 3);
    const mascara = (el, m) => { el.style.webkitMaskImage = m; el.style.maskImage = m; };
    const D = 3600;
    let t0 = 0;

    function pintar(t) {
      const lx = -20 + 140 * eio(seg(t, 150, 1950));
      const r = 11 + 190 * eio(seg(t, 1750, 2650));
      mascara(oro, `radial-gradient(ellipse ${r}% ${r * 3.6}% at ${lx}% 55%, #000 55%, transparent 100%)`);
      haz.style.left = lx + "%";
      haz.style.opacity = seg(t, 0, 300) * (1 - seg(t, 1900, 2600));
      base.style.opacity = 1 - seg(t, 2500, 2900);
      const k = seg(t, 2600, 3400), x = -25 + 150 * eio(k);
      mascara(brillo, `linear-gradient(105deg, transparent ${x - 12}%, #000 ${x}%, transparent ${x + 12}%)`);
      brillo.style.opacity = k > 0 && k < 1 ? .9 : 0;
      aura.style.opacity = .95 * eout(seg(t, 300, 2200)) - .4 * eio(seg(t, 2400, 3500));
    }

    function terminar() {
      marca.classList.remove("revelando");
      mascara(oro, ""); mascara(brillo, "");
      for (const el of [base, brillo, haz, aura]) el.style.opacity = "";
    }

    function cuadro(ahora) {
      const t = ahora - t0;
      if (t >= D) { terminar(); return; }
      pintar(t);
      requestAnimationFrame(cuadro);
    }

    marca.classList.add("revelando");
    pintar(0);
    requestAnimationFrame((ahora) => { t0 = ahora; requestAnimationFrame(cuadro); });
    // Si la pestaña se oculta a mitad, no tiene sentido seguir: dejar el estado final
    document.addEventListener("visibilitychange", () => { if (document.hidden) { t0 = -1e9; } }, { once: true });
  }

  /* 4. Dibujos de los servicios: se trazan una sola vez cuando llegan a la pantalla (el resto es CSS) */
  function dibujos() {
    const vis = [...document.querySelectorAll(".servicio__visual")];
    if (!vis.length) return;
    if (quieto || !("IntersectionObserver" in window)) { vis.forEach((v) => v.classList.add("dibujado")); return; }
    const obs = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) { e.target.classList.add("dibujado"); obs.unobserve(e.target); }
    }, { threshold: 0.45 });
    vis.forEach((v) => obs.observe(v));
  }

  /* 5. Iconos del proceso: de puntos sueltos a su forma, uno tras otro, una vez */
  function proceso() {
    const pasos = [...document.querySelectorAll(".proceso li")];
    if (!pasos.length) return;
    if (quieto) { pasos.forEach((p) => p.classList.add("formado")); return; }
    if (!punteroFino) {
      // En el celular (línea de tiempo) cada icono se forma cuando su paso llega al centro de la pantalla
      const uno = new IntersectionObserver((es) => {
        for (const e of es) if (e.isIntersecting) { e.target.classList.add("formado"); uno.unobserve(e.target); }
      }, { rootMargin: "0px 0px -30% 0px", threshold: 0.6 });
      pasos.forEach((p) => uno.observe(p));
      return;
    }
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      pasos.forEach((p, i) => setTimeout(() => p.classList.add("formado"), 250 + i * 450));
    }, { threshold: 0.35 });
    obs.observe(pasos[0].parentElement);
    // Al pasar el puntero, el icono se deshace y se vuelve a formar
    pasos.forEach((p) => p.addEventListener("pointerenter", () => {
      if (!p.classList.contains("formado")) return;
      p.classList.remove("formado"); void p.offsetWidth;
      setTimeout(() => p.classList.add("formado"), 180);
    }));
  }

  /* 6. El brillo de SERAPHIX: barre una vez al aparecer y luego sigue al puntero */
  function cierre() {
    const palabra = document.querySelector(".final__palabra");
    const final = document.querySelector(".final");
    if (!palabra || quieto) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const t0 = performance.now();
      const barrer = (ahora) => {
        const k = Math.min((ahora - t0) / 1800, 1), e2 = 1 - Math.pow(1 - k, 3);
        palabra.style.setProperty("--x", (-10 + e2 * 60).toFixed(1) + "%");
        if (k < 1) requestAnimationFrame(barrer);
      };
      requestAnimationFrame(barrer);
    }, { threshold: 0.3 });
    obs.observe(palabra);
    if (punteroFino) {
      final.addEventListener("pointermove", (e) => {
        const r = palabra.getBoundingClientRect();
        palabra.style.setProperty("--x", (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%");
      });
    } else {
      // En el celular, el brillo recorre la palabra al deslizar (solo mientras está en pantalla)
      let enVista = false, pendiente = false;
      new IntersectionObserver(([e]) => { enVista = e.isIntersecting; }).observe(palabra);
      addEventListener("scroll", () => {
        if (!enVista || pendiente) return;
        pendiente = true;
        requestAnimationFrame(() => {
          pendiente = false;
          const r = palabra.getBoundingClientRect();
          const k = 1 - Math.min(Math.max(r.top / innerHeight, 0), 1);
          palabra.style.setProperty("--x", (5 + k * 90).toFixed(1) + "%");
        });
      }, { passive: true });
    }
  }

  for (const f of [revelado, dibujos, proceso, cierre]) {
    try { f(); } catch (err) { console.warn("Seraphix v2:", f.name, err); }
  }
})();
