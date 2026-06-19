/**
 * Custom cursor + magnetic elements
 */

const Cursor = {
  el: null,
  dot: null,
  ring: null,
  mx: 0, my: 0, rx: 0, ry: 0,

  init() {
    if (Utils.isTouchDevice() || Utils.prefersReducedMotion()) return;

    this.el = document.getElementById('cursor');
    this.dot = this.el?.querySelector('.cursor-dot');
    this.ring = this.el?.querySelector('.cursor-ring');
    if (!this.el) return;

    document.body.classList.add('is-desktop');

    document.addEventListener('mousemove', (e) => {
      this.mx = e.clientX; this.my = e.clientY;
      if (this.dot) { this.dot.style.left = `${e.clientX}px`; this.dot.style.top = `${e.clientY}px`; }
    });

    const loop = () => {
      this.rx = Utils.lerp(this.rx, this.mx, 0.12);
      this.ry = Utils.lerp(this.ry, this.my, 0.12);
      if (this.ring) { this.ring.style.left = `${this.rx}px`; this.ring.style.top = `${this.ry}px`; }
      requestAnimationFrame(loop);
    };
    loop();

    const targets = 'a, button, [data-magnetic], .vid-card';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(targets)) this.el.classList.add('is-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(targets)) this.el.classList.remove('is-hover');
    });

    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.25;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }
};
