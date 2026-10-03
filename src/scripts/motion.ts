import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector<T & Element>(s);
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => [...root.querySelectorAll<T & Element>(s)];

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

/* ---------- Scroll suave (Lenis) sincronizado com o GSAP ---------- */
let lenis: Lenis | null = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // âncoras internas rolam com o Lenis
  $$<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const target = $(a.getAttribute('href')!);
      if (!target) return;
      e.preventDefault();
      lenis!.scrollTo(target, { offset: -70, duration: 1.4 });
    }),
  );
}

/* ---------- Nav: fundo ao rolar, some ao descer, volta ao subir ---------- */
const nav = $('[data-nav]');
const floatWa = $('[data-float-wa]');
let lastY = 0;
const onScroll = () => {
  const y = window.scrollY;
  nav?.classList.toggle('is-scrolled', y > 20);
  nav?.classList.toggle('is-hidden', y > 400 && y > lastY);
  floatWa?.classList.toggle('is-visible', y > window.innerHeight * 0.8);
  lastY = y;
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Contagem regressiva para o Natal ---------- */
const countdown = $('[data-countdown]');
if (countdown) {
  const units = Object.fromEntries($$('[data-unit]', countdown).map((el) => [el.dataset.unit!, el]));
  const tick = () => {
    const now = new Date();
    let xmas = new Date(now.getFullYear(), 11, 25);
    if (now > xmas) xmas = new Date(now.getFullYear() + 1, 11, 25);
    const s = Math.max(0, Math.floor((xmas.getTime() - now.getTime()) / 1000));
    const vals = { dias: Math.floor(s / 86400), horas: Math.floor(s / 3600) % 24, min: Math.floor(s / 60) % 60, seg: s % 60 };
    for (const [k, v] of Object.entries(vals)) if (units[k]) units[k].textContent = String(v).padStart(2, '0');
  };
  tick();
  setInterval(tick, 1000);
}

/* ---------- Estrelinhas piscando na seção de Natal ---------- */
const twinkles = $('[data-twinkles]');
if (twinkles) {
  for (let i = 0; i < 40; i++) {
    const s = document.createElement('span');
    const size = Math.random() * 2.5 + 1;
    Object.assign(s.style, {
      position: 'absolute',
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: '#e9d3a8',
      opacity: '0.15',
    });
    twinkles.appendChild(s);
    if (!reduced)
      gsap.to(s, { opacity: Math.random() * 0.7 + 0.3, duration: Math.random() * 2 + 1, repeat: -1, yoyo: true, delay: Math.random() * 3, ease: 'sine.inOut' });
  }
}

if (reduced) {
  // Sem animação: garante tudo visível e para por aqui.
  gsap.set('[data-hero-in], [data-reveal]', { opacity: 1 });
} else {
  /* ---------- Entrada do hero ---------- */
  document.fonts.ready.then(() => {
    const h1 = $('[data-split]');
    const split = h1 ? SplitText.create(h1, { type: 'lines,words', mask: 'lines' }) : null;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    if (split) tl.from(split.words, { yPercent: 110, duration: 1.3, stagger: 0.06 });
    tl.fromTo('[data-hero-in]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.09 }, 0.25)
      .from('[data-garment]', { opacity: 0, y: 120, rotate: (i) => (i % 2 ? 18 : -18), scale: 0.8, duration: 1.6, stagger: 0.12 }, 0.1)
      .from('[data-tag]', { opacity: 0, rotate: -40, transformOrigin: '50% 0%', duration: 1.8, ease: 'elastic.out(1, 0.45)' }, 0.9);
  });

  // selo girando sem parar
  gsap.to('[data-spin]', { rotate: 360, duration: 22, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });

  /* ---------- Parallax do hero: mouse + scroll ---------- */
  const art = $('[data-hero-art]');
  if (art) {
    const layers = $$('[data-depth]', art).map((el) => {
      const d = parseFloat(el.dataset.depth || '1');
      return { d, x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3' }), y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3' }) };
    });
    if (finePointer)
      window.addEventListener('pointermove', (e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        layers.forEach((l) => {
          l.x(nx * 22 * l.d);
          l.y(ny * 22 * l.d);
        });
      });
    $$('[data-depth]', art).forEach((el) => {
      const d = parseFloat(el.dataset.depth || '1');
      gsap.to(el.firstElementChild, { yPercent: -12 * d, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } });
    });
  }

  /* ---------- Revelação genérica ---------- */
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  });

  /* ---------- História: palavras acendem conforme o scroll ---------- */
  const story = $('[data-scrub-words]');
  if (story) {
    const words = SplitText.create(story, { type: 'words' }).words;
    gsap.fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: story, start: 'top 80%', end: 'bottom 45%', scrub: true } });
  }

  /* ---------- Linha de costura se desenhando ---------- */
  $$<SVGPathElement>('[data-thread]').forEach((path) => {
    const len = path.getTotalLength();
    // máscara: um traço sólido que cresce revelando o pesponto tracejado
    const svg = path.ownerSVGElement!;
    const id = `m${Math.random().toString(36).slice(2, 8)}`;
    const ns = 'http://www.w3.org/2000/svg';
    const mask = document.createElementNS(ns, 'mask');
    mask.id = id;
    const m = path.cloneNode() as SVGPathElement;
    m.removeAttribute('data-thread');
    m.setAttribute('stroke', '#fff');
    m.setAttribute('stroke-width', '8');
    m.setAttribute('stroke-dasharray', `${len}`);
    m.setAttribute('stroke-dashoffset', `${len}`);
    mask.appendChild(m);
    svg.prepend(mask);
    path.setAttribute('mask', `url(#${id})`);
    gsap.to(m, { attr: { 'stroke-dashoffset': 0 }, ease: 'none', scrollTrigger: { trigger: svg, start: 'top 75%', end: 'bottom 40%', scrub: true } });
  });

  /* ---------- Como funciona: scroll horizontal fixado (desktop) ---------- */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    const section = $('[data-hscroll]');
    const track = $('[data-htrack]');
    if (!section || !track) return;
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 64);
    gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
    });
  });

  /* ---------- Parallax suave (Natal) ---------- */
  $$('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || '0');
    gsap.fromTo(el, { yPercent: -speed * 100 }, { yPercent: speed * 100, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  if (finePointer) {
    /* ---------- Cards de estampa com inclinação 3D ---------- */
    $$('[data-tilt]').forEach((card) => {
      const inner = $('[data-tilt-inner]', card)!;
      const rx = gsap.quickTo(inner, 'rotationX', { duration: 0.6, ease: 'power3' });
      const ry = gsap.quickTo(inner, 'rotationY', { duration: 0.6, ease: 'power3' });
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 10);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
      });
      card.addEventListener('pointerleave', () => {
        rx(0);
        ry(0);
      });
    });

    /* ---------- Botões magnéticos ---------- */
    $$('[data-magnetic]').forEach((btn) => {
      const x = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3' });
      const y = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3' });
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        x((e.clientX - r.left - r.width / 2) * 0.25);
        y((e.clientY - r.top - r.height / 2) * 0.35);
      });
      btn.addEventListener('pointerleave', () => {
        x(0);
        y(0);
      });
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
}
