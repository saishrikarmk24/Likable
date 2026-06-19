/**
 * App entry — navigation and module bootstrap
 */

const App = {
  nav: null,
  links: null,
  burger: null,
  lastY: 0,

  init() {
    this.nav = document.getElementById('nav');
    this.links = document.getElementById('nav-links');
    this.burger = document.getElementById('nav-burger');

    Loader.init();
    Cursor.init();

    if (Utils.prefersReducedMotion()) {
      document.getElementById('loader')?.classList.add('is-done');
      document.body.classList.remove('loading');
      this.boot();
    } else {
      window.addEventListener('loaderComplete', () => this.boot());
    }

    this.initNav();
    document.getElementById('year').textContent = new Date().getFullYear();
  },

  boot() {
    Hero.init();
    Animations.init();
    Portfolio.init();
    Contact.init();
  },

  initNav() {
    this.burger?.addEventListener('click', () => {
      const open = this.links.classList.toggle('is-open');
      this.burger.classList.toggle('is-open', open);
      this.burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    this.links?.querySelectorAll('.nav-link').forEach((a) => {
      a.addEventListener('click', () => {
        this.links.classList.remove('is-open');
        this.burger?.classList.remove('is-open');
        this.burger?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    const onScroll = Utils.throttle(() => {
      const y = window.scrollY;
      this.nav?.classList.toggle('is-scrolled', y > 40);
      this.nav?.classList.toggle('is-hidden', y > this.lastY && y > 300);
      this.lastY = y;
      this.setActive();
    }, 80);

    window.addEventListener('scroll', onScroll);
    Animations.lenis?.on('scroll', onScroll);
  },

  setActive() {
    const sections = ['hero', 'work', 'about', 'public-work', 'longform', 'contact'];
    let current = 'hero';

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 150) current = id;
    });

    const map = { hero: '#hero', work: '#work', about: '#about', 'public-work': '#public-work', longform: '#longform', contact: '#contact' };

    this.links?.querySelectorAll('.nav-link').forEach((a) => {
      a.classList.toggle('is-active', a.getAttribute('href') === map[current]);
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
