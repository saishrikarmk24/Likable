/**
 * GSAP scroll animations — Lenis smooth scroll + reveals
 */

const Animations = {
  lenis: null,

  init() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    this.initLenis();
    this.initReveals();
    this.initSectionTransitions();
  },

  initLenis() {
    if (typeof Lenis === 'undefined' || Utils.prefersReducedMotion()) return;

    this.lenis = new Lenis({ duration: 1.4, smoothWheel: true });
    this.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => this.lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  },

  initReveals() {
    document.querySelectorAll('[data-reveal]').forEach((el, i) => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1,
        ease: 'power3.out',
        delay: (i % 3) * 0.05
      });
    });

    // Display headings — word split
    if (typeof SplitType !== 'undefined') {
      document.querySelectorAll('.display').forEach((heading) => {
        if (heading.closest('.hero')) return;
        const split = new SplitType(heading, { types: 'words' });
        gsap.from(split.words, {
          scrollTrigger: { trigger: heading, start: 'top 85%' },
          opacity: 0, y: 50, filter: 'blur(6px)', stagger: 0.06, duration: 0.9, ease: 'power3.out'
        });
      });
    }
  },

  initSectionTransitions() {
    // Parallax on showcase ambient glow
    const ambient = document.querySelector('.showcase-ambient');
    if (ambient) {
      gsap.to(ambient, {
        scrollTrigger: { trigger: ambient.parentElement, scrub: 1 },
        y: 100, opacity: 0.5
      });
    }

    // About section line draw
    gsap.from('.about', {
      scrollTrigger: { trigger: '.about', start: 'top 80%' },
      opacity: 0, duration: 1, ease: 'power2.out'
    });
  }
};
