/**
 * Loading screen — cinematic counter with particles
 */

const Loader = {
  el: null,
  countEl: null,
  line: null,
  canvas: null,
  ctx: null,
  particles: [],
  progress: 0,

  init() {
    this.el = document.getElementById('loader');
    this.countEl = document.getElementById('loader-count');
    this.line = this.el?.querySelector('.loader-line');
    this.canvas = document.getElementById('loader-canvas');

    if (!this.el) return;
    document.body.classList.add('loading');

    if (this.canvas && !Utils.prefersReducedMotion()) {
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.spawnParticles();
      this.draw();
      window.addEventListener('resize', () => this.resize());
    }

    this.run();
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  spawnParticles() {
    const n = Math.min(60, Math.floor(window.innerWidth / 25));
    this.particles = Array.from({ length: n }, () => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.4 + 0.1
    }));
  },

  draw() {
    if (!this.ctx || this.el.classList.contains('is-done')) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255,255,255,${p.a})`;
      this.ctx.fill();
    });
    requestAnimationFrame(() => this.draw());
  },

  run() {
    let target = 0;

    const tick = () => {
      target = Math.min(target + Math.random() * 8 + 2, 100);
      this.progress = Utils.lerp(this.progress, target, 0.08);
      const n = Math.round(this.progress);

      if (this.countEl) this.countEl.textContent = n;
      if (this.line) this.line.style.setProperty('--progress', this.progress / 100);

      if (n < 99) requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener('load', () => {
      this.progress = 100;
      if (this.countEl) this.countEl.textContent = '100';
      if (this.line) this.line.style.setProperty('--progress', '1');
      setTimeout(() => this.finish(), 500);
    });

    setTimeout(() => {
      if (!this.el.classList.contains('is-done')) this.finish();
    }, 5000);
  },

  finish() {
    if (typeof gsap !== 'undefined') {
      gsap.to(this.el, {
        opacity: 0,
        duration: 0.9,
        ease: 'power3.inOut',
        onComplete: () => {
          this.el.classList.add('is-done');
          document.body.classList.remove('loading');
          window.dispatchEvent(new CustomEvent('loaderComplete'));
        }
      });
    } else {
      this.el.classList.add('is-done');
      document.body.classList.remove('loading');
      window.dispatchEvent(new CustomEvent('loaderComplete'));
    }
  }
};
