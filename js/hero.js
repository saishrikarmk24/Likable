/**
 * Hero — Three.js immersive background + entrance animations
 */

const Hero = {
  canvas: null,
  scene: null,
  camera: null,
  renderer: null,
  particles: null,
  shapes: [],
  mouse: { x: 0, y: 0 },

  init() {
    this.canvas = document.getElementById('hero-canvas');
    if (!this.canvas || typeof THREE === 'undefined') return;
    if (Utils.prefersReducedMotion()) return;

    this.build();
    this.bind();
    this.loop();

    window.addEventListener('loaderComplete', () => this.enter());
    if (!document.body.classList.contains('loading')) this.enter();
  },

  build() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 200);
    this.camera.position.z = 25;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    const count = Utils.isTouchDevice() ? 300 : 700;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    this.particles = new THREE.Points(geo, new THREE.PointsMaterial({
      size: 0.06,
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    }));
    this.scene.add(this.particles);

    // Wireframe rings for depth
    [new THREE.TorusGeometry(4, 0.03, 8, 64), new THREE.RingGeometry(6, 6.05, 64)].forEach((g, i) => {
      const mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 0.06, wireframe: i === 0
      }));
      mesh.position.set((i - 0.5) * 14, i * 3 - 2, -8);
      mesh.userData.speed = 0.0008 + i * 0.0004;
      this.shapes.push(mesh);
      this.scene.add(mesh);
    });
  },

  bind() {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / innerWidth - 0.5) * 2;
      this.mouse.y = (e.clientY / innerHeight - 0.5) * 2;
    });
    window.addEventListener('resize', Utils.debounce(() => {
      if (!this.renderer) return;
      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(innerWidth, innerHeight);
    }, 200));
  },

  loop() {
    requestAnimationFrame(() => this.loop());

    if (this.particles) {
      this.particles.rotation.y += 0.0004 + this.mouse.x * 0.0003;
      this.particles.rotation.x += this.mouse.y * 0.0002;
    }

    this.shapes.forEach((s) => {
      s.rotation.x += s.userData.speed;
      s.rotation.z += s.userData.speed * 0.5;
    });

    this.camera.position.x = Utils.lerp(this.camera.position.x, this.mouse.x * 1.5, 0.04);
    this.camera.position.y = Utils.lerp(this.camera.position.y, -this.mouse.y * 1.5, 0.04);
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  },

  enter() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.to('.hero-tag', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, delay: 0.2 })
      .to('.hero-line', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, stagger: 0.12 }, '-=0.6')
      .to('.hero-actions', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9 }, '-=0.5')
      .from('.hero-scroll', { opacity: 0, y: 20, duration: 0.8 }, '-=0.3');

    if (typeof SplitType !== 'undefined') {
      document.querySelectorAll('.hero-line').forEach((line) => {
        const split = new SplitType(line, { types: 'chars' });
        gsap.from(split.chars, {
          opacity: 0, y: 100, rotateX: -40, stagger: 0.02, duration: 1.2,
          ease: 'power4.out', delay: 0.4
        });
      });
    }
  }
};
