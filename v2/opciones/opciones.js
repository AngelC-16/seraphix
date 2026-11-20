/* Seraphix · cinco opciones de animación para el logo del inicio (sin librerías). */
(() => {
  "use strict";
  const L = window.SX_LOGO;
  const NS = "http://www.w3.org/2000/svg";
  const [VX, VY, VW, VH] = L.vb;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const movil = matchMedia("(max-width: 700px)").matches;

  // ---------- utilidades ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const eio = (x) => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const eout = (x) => 1 - Math.pow(1 - x, 3);
  const azar = (s) => { let x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  let gid = 0;
  const DESTELLO = { x: 6747.1, y: -1050 };
  const GUIA = "M0 -950 C 2097 -1230 4870 -1215 6747.1 -1050";

  function logoSVG(colores) {
    const s = document.createElementNS(NS, "svg");
    s.setAttribute("viewBox", `${VX} ${VY} ${VW} ${VH}`);
    s.setAttribute("aria-hidden", "true");
    const id = "oro" + gid++;
    s.innerHTML = `<defs><linearGradient id="${id}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#a8741a"/><stop offset="1" stop-color="#ffe29a"/></linearGradient></defs>`;
    const p = L.trazos.map((t, i) => {
      const el = document.createElementNS(NS, "path");
      el.setAttribute("d", t.d);
      let f = t.f.startsWith("url") ? `url(#${id})` : t.f;
      if (colores) f = colores(i, f);
      el.setAttribute("fill", f);
      s.appendChild(el);
      return el;
    });
    s._estela = p[0]; s._destello = p[1]; s._letras = p.slice(2);
    return s;
  }
  // Recorte izquierda→derecha (para la estela)
  function recorte(svg, el) {
    const id = "clip" + gid++;
    const cp = document.createElementNS(NS, "clipPath");
    cp.setAttribute("id", id);
    const r = document.createElementNS(NS, "rect");
    r.setAttribute("x", VX); r.setAttribute("y", VY); r.setAttribute("height", VH); r.setAttribute("width", 0);
    cp.appendChild(r);
    svg.querySelector("defs").appendChild(cp);
    el.setAttribute("clip-path", `url(#${id})`);
    return (ancho) => r.setAttribute("width", Math.max(0, ancho));
  }
  const escalaEn = (el, cx, cy, k) => el.setAttribute("transform", `translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`);
  // Destello que aparece con un pulso
  function pulsoDestello(el, t, a) {
    el.style.opacity = seg(t, a, a + 150);
    const k = t < a ? 0 : 1 + 1.2 * (1 - eout(seg(t, a, a + 650)));
    escalaEn(el, DESTELLO.x, DESTELLO.y, Math.max(k, .001));
  }
  // Brillo metálico que barre el logo (copia blanca enmascarada)
  function brillo(marca) {
    const s = logoSVG(() => "#fff6dc");
    s.classList.add("capa");
    s.style.opacity = 0;
    marca.appendChild(s);
    return (t, a, b) => {
      const k = seg(t, a, b);
      const x = -25 + 150 * eio(k);
      const m = `linear-gradient(105deg, transparent ${x - 12}%, #000 ${x}%, transparent ${x + 12}%)`;
      s.style.webkitMaskImage = m; s.style.maskImage = m;
      s.style.opacity = k > 0 && k < 1 ? .55 : 0;
    };
  }

  // ---------- las cinco opciones ----------
  const OPS = [
    {
      nombre: "La estela",
      desc: "Un destello de cuatro puntas cruza como cometa y deja la estela dorada; luego las letras se dibujan a mano y se llenan de color.",
      D: 3500,
      montar({ marca }) {
        const s = logoSVG();
        marca.appendChild(s);
        const anchoEstela = recorte(s, s._estela);
        const guia = document.createElementNS(NS, "path");
        guia.setAttribute("d", GUIA); guia.setAttribute("fill", "none");
        s.appendChild(guia);
        const largo = guia.getTotalLength();
        // cometa: halo + destello
        const g = document.createElementNS(NS, "g");
        const hid = "halo" + gid++;
        s.querySelector("defs").insertAdjacentHTML("beforeend",
          `<radialGradient id="${hid}"><stop offset="0" stop-color="#fffbe9"/><stop offset=".25" stop-color="#ffe29a" stop-opacity=".8"/><stop offset="1" stop-color="#d4a64a" stop-opacity="0"/></radialGradient>`);
        g.innerHTML = `<circle r="260" fill="url(#${hid})"/><g transform="translate(${-DESTELLO.x} ${-DESTELLO.y})"><path d="${L.trazos[1].d}" fill="#fffbe9"/></g>`;
        s.appendChild(g);
        s._letras.forEach((p, i) => {
          p.setAttribute("pathLength", "1");
          p.setAttribute("stroke", i === 7 ? "#d4a64a" : "#f4efe4");
          p.setAttribute("stroke-width", "22");
          p.style.strokeDasharray = "1 1.01";
        });
        return (t) => {
          const c = eio(seg(t, 0, 1500));
          const pt = guia.getPointAtLength(largo * c);
          g.setAttribute("transform", `translate(${pt.x} ${pt.y}) scale(${.55 + .45 * Math.sin(c * Math.PI)})`);
          g.style.opacity = t < 1500 ? seg(t, 0, 120) : 1 - seg(t, 1500, 1750);
          anchoEstela(t < 1500 ? pt.x - VX + 40 : VW);
          pulsoDestello(s._destello, t, 1450);
          s._letras.forEach((p, i) => {
            const a = 900 + i * 110;
            p.style.strokeDashoffset = 1.01 * (1 - eio(seg(t, a, a + 850)));
            p.style.fillOpacity = seg(t, 2250 + i * 50, 2950);
            p.style.strokeOpacity = 1 - seg(t, 2800, 3200);
          });
        };
      },
    },
    {
      nombre: "Brasas de serafín",
      desc: "Chispas de fuego suben desde abajo, se enfrían en oro y se juntan hasta formar el logo, que termina nítido.",
      D: 3600,
      montar({ esc, marca }) {
        const s = logoSVG();
        s.style.opacity = 0;
        marca.appendChild(s);
        const cv = document.createElement("canvas");
        cv.className = "lienzo lienzo--frente";
        esc.appendChild(cv);
        const dpr = Math.min(devicePixelRatio || 1, movil ? 1.5 : 2);
        const W = Math.round(esc.clientWidth * dpr), H = Math.round(esc.clientHeight * dpr);
        cv.width = W; cv.height = H;
        const ctx = cv.getContext("2d");
        // rasterizar el logo dentro de su caja
        const mx = marca.offsetLeft * dpr, my = marca.offsetTop * dpr;
        const mw = Math.round(marca.clientWidth * dpr), mh = Math.round(marca.clientHeight * dpr);
        const off = document.createElement("canvas");
        off.width = mw; off.height = mh;
        const o = off.getContext("2d");
        const k = mw / VW;
        o.setTransform(k, 0, 0, k, -VX * k, -VY * k);
        L.trazos.forEach((t) => { o.fillStyle = t.f.startsWith("url") ? "#d4a64a" : t.f; o.fill(new Path2D(t.d)); });
        const datos = o.getImageData(0, 0, mw, mh).data;
        let llenos = 0;
        for (let i = 3; i < datos.length; i += 4) if (datos[i] > 128) llenos++;
        const meta = movil ? 900 : 1700;
        const paso = Math.max(2, Math.ceil(Math.sqrt(llenos / meta)));
        const P = [];
        let n = 0;
        for (let y = 0; y < mh; y += paso) for (let x = 0; x < mw; x += paso) {
          const j = (y * mw + x) * 4;
          if (datos[j + 3] <= 128) continue;
          const tx = mx + x, ty = my + y, r = azar(++n), r2 = azar(n + .5), r3 = azar(n + .25);
          P.push({
            tx, ty, c: [datos[j], datos[j + 1], datos[j + 2]],
            sx: clamp(tx + (r - .5) * W * .5, 0, W), sy: H + r2 * H * .35,
            del: r3 * 650 + (tx / W) * 300, dur: 1300 + r * 500,
            amp: (8 + r2 * 22) * dpr, fr: 140 + r3 * 120, ph: r * 6.28,
          });
        }
        const chispas = Array.from({ length: movil ? 50 : 110 }, (_, i) => {
          const r = azar(i + 900), r2 = azar(i + 900.5);
          return { x: r * W, y: H + r2 * 60 * dpr, v: (.25 + r2 * .35) * dpr, del: r * 1600, ph: r2 * 6.28, vida: 1400 + r * 900 };
        });
        const tam = 1.3 * dpr * Math.max(1, paso / (2.6 * dpr));
        return (t) => {
          ctx.clearRect(0, 0, W, H);
          ctx.globalCompositeOperation = "lighter";
          for (const c of chispas) {
            const v = seg(t, c.del, c.del + c.vida);
            if (v <= 0 || v >= 1) continue;
            const y = c.y - (t - c.del) * c.v;
            const x = c.x + Math.sin(t / 200 + c.ph) * 14 * dpr;
            ctx.fillStyle = `rgba(255,${120 + 60 * v | 0},40,${(1 - v) * .8})`;
            ctx.fillRect(x, y, 1.6 * dpr, 1.6 * dpr);
          }
          for (const p of P) {
            const v = seg(t, p.del, p.del + p.dur);
            if (v <= 0) continue;
            const e = eio(v);
            const x = p.sx + (p.tx - p.sx) * e + Math.sin(t / p.fr + p.ph) * p.amp * (1 - e);
            const y = p.sy + (p.ty - p.sy) * e;
            const q = v * v;
            const rC = 255 + (p.c[0] - 255) * q, gC = 130 + (p.c[1] - 130) * q, bC = 30 + (p.c[2] - 30) * q;
            const a = v < 1 ? .55 + .45 * Math.sin(t / 55 + p.ph) * (1 - v) : 1;
            ctx.fillStyle = `rgba(${rC | 0},${gC | 0},${bC | 0},${a})`;
            const z = tam * (1 + (1 - v) * .9);
            ctx.fillRect(x - z / 2, y - z / 2, z, z);
          }
          cv.style.opacity = 1 - seg(t, 2750, 3150);
          s.style.opacity = seg(t, 2700, 3100);
        };
      },
    },
    {
      nombre: "Revelado por luz",
      desc: "El logo empieza apagado; un haz de luz lo recorre y lo enciende en oro, y al final pasa un brillo de metal pulido.",
      D: 3600,
      montar({ marca }) {
        const base = logoSVG((i) => (i === 0 || i === 1 ? "#2b2213" : "#1e1b16"));
        const top = logoSVG();
        top.classList.add("capa");
        marca.append(base, top);
        const sheen = brillo(marca);
        const haz = document.createElement("div");
        haz.className = "haz";
        marca.appendChild(haz);
        return (t) => {
          const lx = -20 + 140 * eio(seg(t, 150, 1950));
          const r = 11 + 190 * eio(seg(t, 1750, 2650));
          const m = `radial-gradient(ellipse ${r}% ${r * 3.6}% at ${lx}% 55%, #000 55%, transparent 100%)`;
          top.style.webkitMaskImage = m; top.style.maskImage = m;
          haz.style.left = lx + "%";
          haz.style.opacity = seg(t, 0, 300) * (1 - seg(t, 1900, 2600));
          base.style.opacity = 1 - seg(t, 2500, 2900);
          sheen(t, 2600, 3400);
        };
      },
    },
    {
      nombre: "Decodificado",
      desc: "Las letras cambian rápido como si se descifrara un código hasta quedar SERAPHIX; después la estela se traza encima.",
      D: 3600,
      montar({ marca }) {
        const s = logoSVG();
        marca.appendChild(s);
        const anchoEstela = recorte(s, s._estela);
        // caja de las letras en px
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        s._letras.forEach((p) => { const b = p.getBBox(); x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height); });
        const k = marca.clientWidth / VW;
        const caja = { l: (x0 - VX) * k, t: (y0 - VY) * k, w: (x1 - x0) * k, h: (y1 - y0) * k };
        const txt = document.createElement("div");
        txt.className = "scramble";
        const META = "SERAPHIX", POOL = "ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789#%&*+<>/";
        const sp = [...META].map((ch, i) => { const e = document.createElement("span"); e.textContent = ch; if (i === 7) e.classList.add("x"); txt.appendChild(e); return e; });
        Object.assign(txt.style, { left: caja.l + "px", width: caja.w + "px", fontSize: caja.h * 1.32 + "px", height: caja.h + "px", top: caja.t + "px" });
        sp.forEach((e) => { e.style.width = caja.w / 8 + "px"; e.style.lineHeight = caja.h + "px"; });
        marca.appendChild(txt);
        return (t) => {
          sp.forEach((e, i) => {
            const fin = 450 + i * 190;
            if (t < fin) {
              e.classList.remove("ok");
              e.textContent = POOL[Math.floor(azar(Math.floor(t / 55) * 13 + i) * POOL.length)];
              e.style.opacity = seg(t, i * 55, i * 55 + 220);
            } else { e.classList.add("ok"); e.textContent = META[i]; e.style.opacity = 1; }
          });
          txt.style.opacity = 1 - seg(t, 2150, 2550);
          s._letras.forEach((p) => (p.style.opacity = seg(t, 2150, 2550)));
          anchoEstela(eio(seg(t, 2300, 3050)) * (VW + 40));
          pulsoDestello(s._destello, t, 3000);
        };
      },
    },
    {
      nombre: "Oro fundido",
      desc: "Un fondo de oro líquido se mueve, el logo emerge desenfocado y se enfoca; el oro se apaga para dejar el logo protagonista.",
      D: 3800,
      montar({ esc, marca }) {
        const s = logoSVG();
        marca.appendChild(s);
        const sheen = brillo(marca);
        const cv = document.createElement("canvas");
        cv.className = "lienzo";
        esc.prepend(cv);
        const gl = cv.getContext("webgl", { antialias: false, preserveDrawingBuffer: true });
        let pinta = null;
        if (gl) {
          const esc2 = .5;
          cv.width = Math.max(2, Math.round(esc.clientWidth * esc2)); cv.height = Math.max(2, Math.round(esc.clientHeight * esc2));
          const vs = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
          const fs = `precision mediump float;uniform vec2 r;uniform float t;uniform float a;
          float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
          float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
          float fb(vec2 p){float v=0.,s=.5;for(int k=0;k<5;k++){v+=s*n(p);p*=2.03;s*=.5;}return v;}
          void main(){vec2 uv=gl_FragCoord.xy/r.y;float tt=t*.12;
          vec2 q=vec2(fb(uv*1.6+tt),fb(uv*1.6+vec2(5.2,1.3)-tt*.8));
          float f=fb(uv*1.6+2.6*q+vec2(tt*.4,-tt*.3));
          vec3 c=mix(vec3(.03,.025,.02),vec3(.62,.42,.09),smoothstep(.30,.66,f));
          c=mix(c,vec3(1.,.88,.58),smoothstep(.62,.86,f)*.85);
          vec2 cu=gl_FragCoord.xy/r-.5;c*=1.-dot(cu,cu)*1.3;
          gl_FragColor=vec4(c*a,1.);}`;
          const sh = (tipo, src) => { const o = gl.createShader(tipo); gl.shaderSource(o, src); gl.compileShader(o); return o; };
          const pr = gl.createProgram();
          gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs));
          gl.linkProgram(pr);
          if (gl.getProgramParameter(pr, gl.LINK_STATUS)) {
            gl.useProgram(pr);
            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
            const lp = gl.getAttribLocation(pr, "p");
            gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0);
            const ur = gl.getUniformLocation(pr, "r"), ut = gl.getUniformLocation(pr, "t"), ua = gl.getUniformLocation(pr, "a");
            gl.viewport(0, 0, cv.width, cv.height);
            pinta = (t) => {
              gl.uniform2f(ur, cv.width, cv.height);
              gl.uniform1f(ut, t / 1000 + 3);
              gl.uniform1f(ua, 1 - .8 * eio(seg(t, 1400, 3400)));
              gl.drawArrays(gl.TRIANGLES, 0, 3);
            };
          }
        }
        if (!pinta) { cv.remove(); esc.classList.add("sin-gl"); }
        return (t) => {
          if (pinta) pinta(t);
          const e = eout(seg(t, 600, 2300));
          s.style.opacity = e;
          s.style.filter = e < 1 ? `blur(${(1 - e) * 16}px)` : "none";
          s.style.transform = `scale(${1.08 - .08 * e})`;
          sheen(t, 2500, 3400);
        };
      },
    },
  ];

  // ---------- motor ----------
  const esc = document.getElementById("escenario");
  const tabs = [...document.querySelectorAll(".pestanas button")];
  const tituloEl = document.getElementById("op-titulo"), descEl = document.getElementById("op-desc");
  let raf = 0, t0 = 0, actual = -1, pintar = null, D = 0, transcurrido = 0;

  function montar(i) {
    cancelAnimationFrame(raf);
    actual = i;
    const op = OPS[i];
    tabs.forEach((b, j) => { b.setAttribute("aria-selected", j === i); b.tabIndex = j === i ? 0 : -1; });
    tituloEl.textContent = `Opción ${i + 1} · ${op.nombre}`;
    descEl.textContent = op.desc;
    esc.className = "escenario";
    esc.innerHTML = `<div class="marca"></div><p class="titular">Más clientes para tu negocio, <span class="oro">por WhatsApp.</span></p>`;
    const marca = esc.querySelector(".marca"), tit = esc.querySelector(".titular");
    const f = op.montar({ esc, marca });
    D = op.D;
    pintar = (t) => {
      f(t);
      const k = eout(seg(t, D - 650, D));
      tit.style.opacity = k;
      tit.style.transform = `translateY(${(1 - k) * 16}px)`;
    };
    if (reduce) { pintar(D); return; }
    pintar(0);
    t0 = performance.now();
    const bucle = (now) => {
      const t = now - t0;
      transcurrido = t;
      pintar(Math.min(t, D));
      if (t < D) raf = requestAnimationFrame(bucle);
    };
    raf = requestAnimationFrame(bucle);
  }

  tabs.forEach((b, i) => {
    b.addEventListener("click", () => { history.replaceState(null, "", "#" + (i + 1)); montar(i); });
    b.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const j = (i + (e.key === "ArrowRight" ? 1 : 4)) % 5;
      tabs[j].focus(); tabs[j].click();
    });
  });
  document.getElementById("repetir").addEventListener("click", () => montar(actual));
  // pausa si la pestaña del navegador no está visible
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (transcurrido < D && !reduce) {
      t0 = performance.now() - transcurrido;
      const bucle = (now) => { const t = now - t0; transcurrido = t; pintar(Math.min(t, D)); if (t < D) raf = requestAnimationFrame(bucle); };
      raf = requestAnimationFrame(bucle);
    }
  });
  let rz;
  addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => montar(actual), 250); });

  addEventListener("hashchange", () => { const j = clamp((parseInt(location.hash.slice(1), 10) || 1) - 1, 0, 4); if (j !== actual) montar(j); });
  // Para pruebas: congelar en un instante concreto.
  window.__congelar = (t) => { cancelAnimationFrame(raf); transcurrido = D; pintar(Math.min(t, D)); };

  const ini = clamp((parseInt(location.hash.slice(1), 10) || 1) - 1, 0, 4);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => montar(ini));
})();
