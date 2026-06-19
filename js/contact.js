/**
 * Contact form — minimal validation
 */

const Contact = {
  form: null,

  init() {
    this.form = document.getElementById('contact-form');
    if (!this.form) return;

    this.form.addEventListener('submit', (e) => this.submit(e));
    this.form.querySelectorAll('input, textarea').forEach((f) => {
      f.addEventListener('input', () => this.clear(f));
    });
  },

  submit(e) {
    e.preventDefault();

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    let ok = true;

    if (!name.value.trim()) { this.err(name, 'Please enter your name'); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { this.err(email, 'Enter a valid email'); ok = false; }
    if (!message.value.trim() || message.value.trim().length < 10) { this.err(message, 'Tell me about your project'); ok = false; }
    if (!ok) return;

    const btn = this.form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Send Message';
      this.form.reset();
      const okEl = document.getElementById('form-ok');
      if (okEl) { okEl.hidden = false; setTimeout(() => { okEl.hidden = true; }, 4000); }
    }, 1200);
  },

  err(field, msg) {
    field.classList.add('error');
    const el = document.getElementById(field.id + '-error');
    if (el) el.textContent = msg;
  },

  clear(field) {
    field.classList.remove('error');
    const el = document.getElementById(field.id + '-error');
    if (el) el.textContent = '';
  }
};
