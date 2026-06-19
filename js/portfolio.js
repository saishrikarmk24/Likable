/**
 * Portfolio — Ghost, Public, and Long Form video showcases
 */

const Portfolio = {
  GHOST_PATH: 'assets/videos/ghost/',
  PUBLIC_PATH: 'assets/videos/public/',
  LONGFORM_PATH: 'assets/videos/longform/',
  MANIFEST: 'assets/videos-manifest.json',
  CONFIG: 'assets/videos.config.json',

  modal: null,
  player: null,
  trapCleanup: null,

  init() {
    this.modal = document.getElementById('modal');
    this.player = document.getElementById('modal-video');

    document.getElementById('modal-close')?.addEventListener('click', () => this.close());
    document.getElementById('modal-bg')?.addEventListener('click', () => this.close());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal?.classList.contains('is-open')) this.close();
    });

    this.loadAll();
  },

  async loadAll() {
    const [manifest, config] = await Promise.all([
      this.fetchJSON(this.MANIFEST),
      this.fetchJSON(this.CONFIG)
    ]);

    const ghost = await this.resolveVideos('ghost', manifest, config, 3);
    const pub = await this.resolveVideos('public', manifest, config, 3);
    const longform = await this.resolveVideos('longform', manifest, config, 1);

    this.render(document.getElementById('ghost-grid'), ghost, { ghost: true });
    this.render(document.getElementById('public-grid'), pub, { ghost: false });
    this.render(document.getElementById('longform-grid'), longform, { ghost: false, longform: true });
  },

  async fetchJSON(url) {
    try {
      const res = await fetch(url);
      return res.ok ? await res.json() : null;
    } catch { return null; }
  },

  async resolveVideos(type, manifest, config, count) {
    const paths = {
      ghost: { dir: this.GHOST_PATH, prefix: 'ghost' },
      public: { dir: this.PUBLIC_PATH, prefix: 'edit' },
      longform: { dir: this.LONGFORM_PATH, prefix: 'longform' }
    };

    const { dir, prefix } = paths[type];
    let videos = manifest?.[type]?.length ? manifest[type].slice(0, count) : [];

    if (!videos.length) {
      videos = [];
      for (let i = 1; i <= count; i++) {
        const filename = `${prefix}${i}.mp4`;
        const src = `${dir}${filename}`;
        const exists = await Utils.fetchWithTimeout(src, 3000);
        videos.push({
          src,
          title: this.titleFor(type, i),
          metric: config?.[type]?.[filename]?.metric || null,
          placeholder: !exists
        });
      }
    } else {
      videos = videos.slice(0, count).map((v, i) => ({
        ...v,
        metric: v.metric || config?.[type]?.[v.filename]?.metric || null,
        placeholder: false
      }));
    }

    return videos;
  },

  titleFor(type, i) {
    if (type === 'ghost') return `Ghost Edit ${String(i).padStart(2, '0')}`;
    if (type === 'longform') return 'Long Form Feature';
    return `Edit ${i}`;
  },

  render(container, videos, opts = {}) {
    if (!container) return;
    container.innerHTML = '';

    const playSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';

    videos.forEach((video, i) => {
      const card = document.createElement('article');
      card.className = 'vid-card';
      card.setAttribute('role', 'listitem');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Play ${video.title}`);

      const metricHtml = opts.ghost && video.metric
        ? `<span class="vid-metric">${video.metric}</span><span class="vid-label">Instagram</span>`
        : '';

      if (video.placeholder) {
        card.innerHTML = `
          <div class="vid-placeholder is-loading">Add ${video.src.split('/').pop()}</div>
          <div class="vid-overlay"><div class="vid-play">${playSvg}</div></div>
          ${metricHtml ? `<div class="vid-meta">${metricHtml}</div>` : ''}
        `;
      } else {
        card.innerHTML = `
          <video muted loop playsinline preload="none">
            <source src="${video.src}" type="video/mp4">
          </video>
          <div class="vid-overlay"><div class="vid-play">${playSvg}</div></div>
          ${metricHtml ? `<div class="vid-meta">${metricHtml}</div>` : ''}
        `;

        const vid = card.querySelector('video');
        this.lazyLoad(card, vid);
        card.addEventListener('mouseenter', () => vid.play().catch(() => {}));
        card.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
      }

      card.addEventListener('click', () => this.open(video.src, video.placeholder));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.open(video.src, video.placeholder); }
      });

      // 3D tilt on ghost cards
      if (opts.ghost && !Utils.isTouchDevice()) {
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          if (typeof gsap !== 'undefined') {
            gsap.to(card, { rotateY: x * 10, rotateX: -y * 10, duration: 0.4, ease: 'power2.out' });
          }
        });
        card.addEventListener('mouseleave', () => {
          if (typeof gsap !== 'undefined') {
            gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
          }
        });
      }

      container.appendChild(card);

      // Scroll entrance
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.to(card, {
          scrollTrigger: { trigger: card, start: 'top 90%' },
          opacity: 1, y: 0, scale: 1, duration: 0.9, delay: i * 0.1, ease: 'power3.out'
        });
      }
    });
  },

  lazyLoad(card, vid) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          vid.preload = 'metadata';
          vid.load();
          obs.unobserve(card);
        }
      });
    }, { rootMargin: '120px' });
    obs.observe(card);
  },

  open(src, placeholder) {
    if (placeholder) return;

    this.modal.removeAttribute('hidden');
    requestAnimationFrame(() => this.modal.classList.add('is-open'));

    this.player.src = src;
    this.player.play().catch(() => {});
    document.body.style.overflow = 'hidden';
    this.trapCleanup = Utils.trapFocus(this.modal);
  },

  close() {
    this.modal.classList.remove('is-open');
    this.player.pause();
    this.player.src = '';
    setTimeout(() => this.modal.setAttribute('hidden', ''), 450);
    document.body.style.overflow = '';
    this.trapCleanup?.();
    this.trapCleanup = null;
  }
};
