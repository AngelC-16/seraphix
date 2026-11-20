/* Seraphix v2 · animaciones (sin librerías).
 * 1. Cabecera con fondo al bajar.  2. Entrada del hero.  3. Revelado del logo por luz.
 * 4. Tramas de pixeles en los servicios.  5. Iconos del proceso.  6. Brillo de SERAPHIX al final.
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

  /* 4. Tramas de pixeles (dither ordenado de Bayer 4x4) */
  function tramas() {
    const lienzos = [...document.querySelectorAll("canvas[data-trama]")];
    if (!lienzos.length) return;
    const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
    const sat = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const caja = (u, v, x0, y0, x1, y1, r) => {
      const qx = Math.max(x0 + r - u, 0, u - (x1 - r)), qy = Math.max(y0 + r - v, 0, v - (y1 - r));
      return Math.hypot(qx, qy) - r; // distancia con signo aproximada (<0 dentro)
    };

    const escenas = {
      // Una página web dentro de un navegador, con una luz que la recorre y el botón de WhatsApp latiendo
      web(u, v, t, a) {
        const d = caja(u, v * a, .1, .12 * a, .9, .88 * a, .04);
        if (d > 0.012) return 0;
        if (d > -0.012) return 0.95;
        const vv = v;
        let i = 0.08;
        if (vv < 0.22) i = 0.32;
        if (vv < 0.22 && Math.hypot(u - .16, (vv - .17) * a) < .018) i = 0.9;
        if (vv > .3 && vv < .37 && u > .18 && u < .62) i = 0.75;
        if (vv > .42 && vv < .46 && u > .18 && u < .54) i = 0.45;
        if (vv > .5 && vv < .54 && u > .18 && u < .46) i = 0.45;
        if (vv > .62 && vv < .8 && u > .18 && u < .48) i = Math.max(i, 0.28 + 0.25 * Math.sin(u * 20 + t));
        const lx = .62 + .16 * Math.sin(t * .7), ly = .5 + .14 * Math.cos(t * .9);
        i += 0.55 * sat(1 - Math.hypot(u - lx, (vv - ly) * a) / .3);
        const pul = 0.6 + 0.4 * Math.sin(t * 3);
        if (Math.hypot(u - .78, (vv - .74) * a) < .055 + .01 * pul) i = 0.55 + 0.45 * pul;
        return i;
      },
      // Barras de ventas que suben y bajan, con la línea de la ganancia encima
      app(u, v, t, a) {
        if (u < .1 || u > .9 || v < .12 || v > .86) return 0;
        let i = 0.04;
        if (Math.abs(v - .82) < .006) i = 0.6;
        const n = 7, ancho = .8 / n, k = Math.floor((u - .1) / ancho), lu = ((u - .1) % ancho) / ancho;
        const alto = .22 + .42 * (0.5 + 0.5 * Math.sin(t * 1.1 + k * .85));
        if (lu > .18 && lu < .82 && v < .82 && v > .82 - alto) i = 0.3 + 0.6 * ((v - (.82 - alto)) / alto < .12 ? 1 : 0.55);
        const curva = .3 + .1 * Math.sin(u * 7 + t * .9) + .05 * Math.sin(u * 15 - t * 1.4);
        const dc = Math.abs(v - curva);
        if (dc < .012) i = 1; else if (dc < .05) i = Math.max(i, 0.35 * (1 - dc / .05));
        return i;
      },
      // Burbujas de chat que suben, con los tres puntos de "escribiendo"
      bot(u, v, t, a) {
        if (u < .08 || u > .92) return 0;
        let i = 0.03;
        const paso = .2, des = (t * .05) % paso;
        for (let k = -1; k < 6; k++) {
          const y = .14 + k * paso - des;
          // Las burbujas aparecen disolviéndose y dejan libre la de "escribiendo"
          const aparece = sat((.76 - (y + .12)) / .1);
          if (aparece <= 0) continue;
          const izq = (k + Math.floor(t * .05 / paso)) % 2 === 0;
          const x0 = izq ? .12 : .4, x1 = izq ? .6 : .88;
          const d = caja(u, v * a, x0, y * a, x1, (y + .12) * a, .035);
          if (d < 0) i = (izq ? 0.32 + 0.3 * (1 - (v - y) / .12) : 0.62 + 0.3 * (1 - (v - y) / .12)) * aparece;
          if (d < 0 && v > y + .04 && v < y + .06 && u > x0 + .05 && u < x1 - .12) i = (izq ? .75 : .2) * aparece;
        }
        if (v > .78 && v < .9) {
          const ok = caja(u, v * a, .12, .79 * a, .34, .89 * a, .035) < 0;
          if (ok) i = 0.3;
          for (let p = 0; p < 3; p++) {
            const s = 0.5 + 0.5 * Math.sin(t * 5 - p * .9);
            if (Math.hypot(u - (.18 + p * .05), (v - .84) * a) < .014 + .006 * s) i = .5 + .5 * s;
          }
        }
        const fade = sat(v / .12) * sat((1 - v) / .12);
        return i * fade;
      },
    };

    const estados = lienzos.map((c) => ({ c, ctx: c.getContext("2d"), img: null, visible: false, luz: null, escena: escenas[c.dataset.trama] }));
    const oscuro = [168, 116, 26], claro = [255, 226, 154];

    function medir(s) {
      const r = s.c.getBoundingClientRect();
      const celda = r.width > 520 ? 5 : 4;
      const cols = Math.max(40, Math.round(r.width / celda)), filas = Math.max(30, Math.round(r.height / celda));
      if (s.c.width !== cols || s.c.height !== filas) { s.c.width = cols; s.c.height = filas; s.img = s.ctx.createImageData(cols, filas); }
    }

    function pintar(s, t) {
      if (!s.img) medir(s);
      const { width: cols, height: filas } = s.c, px = s.img.data, a = filas / cols;
      for (let y = 0; y < filas; y++) {
        const v = y / filas;
        for (let x = 0; x < cols; x++) {
          const u = x / cols;
          let i = s.escena(u, v, t, a);
          if (s.luz) i += 0.35 * sat(1 - Math.hypot(u - s.luz.u, (v - s.luz.v) * a) / .22);
          const o = (y * cols + x) * 4;
          if (sat(i) > BAYER[(y & 3) * 4 + (x & 3)]) {
            const m = sat(i * 1.1);
            px[o] = oscuro[0] + (claro[0] - oscuro[0]) * m;
            px[o + 1] = oscuro[1] + (claro[1] - oscuro[1]) * m;
            px[o + 2] = oscuro[2] + (claro[2] - oscuro[2]) * m;
            px[o + 3] = 255;
          } else px[o + 3] = 0;
        }
      }
      s.ctx.putImageData(s.img, 0, 0);
    }

    estados.forEach((s) => { medir(s); pintar(s, 2.4); });
    if (quieto) return;

    const vistos = new IntersectionObserver((es) => {
      for (const e of es) { const s = estados.find((x) => x.c === e.target); s.visible = e.isIntersecting; }
      arrancar();
    });
    estados.forEach((s) => vistos.observe(s.c));

    if (punteroFino) {
      estados.forEach((s) => {
        s.c.parentElement.addEventListener("pointermove", (e) => {
          const r = s.c.getBoundingClientRect();
          s.luz = { u: (e.clientX - r.left) / r.width, v: (e.clientY - r.top) / r.height };
        });
        s.c.parentElement.addEventListener("pointerleave", () => { s.luz = null; });
      });
    }

    let corriendo = false, anterior = 0;
    const t0 = performance.now();
    function cuadro(ahora) {
      const activos = estados.filter((s) => s.visible);
      if (!activos.length) { corriendo = false; return; }
      if (ahora - anterior > 33) { // ~30 cuadros por segundo bastan para una trama
        anterior = ahora;
        const t = 2.4 + (ahora - t0) / 1000;
        activos.forEach((s) => pintar(s, t));
      }
      requestAnimationFrame(cuadro);
    }
    function arrancar() { if (!corriendo) { corriendo = true; requestAnimationFrame(cuadro); } }

    let espera;
    addEventListener("resize", () => { clearTimeout(espera); espera = setTimeout(() => estados.forEach((s) => { medir(s); pintar(s, 2.4); }), 150); });
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

  for (const f of [revelado, tramas, proceso, cierre]) {
    try { f(); } catch (err) { console.warn("Seraphix v2:", f.name, err); }
  }
})();
