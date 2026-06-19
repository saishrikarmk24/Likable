/**
 * Utility functions shared across modules
 */

const Utils = {
  /** Check if user prefers reduced motion */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /** Check if device is touch-enabled (mobile) */
  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  /** Debounce function calls */
  debounce(fn, delay = 150) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  /** Throttle function calls */
  throttle(fn, limit = 100) {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => { inThrottle = false; }, limit);
      }
    };
  },

  /** Clamp value between min and max */
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  /** Linear interpolation */
  lerp(start, end, factor) {
    return start + (end - start) * factor;
  },

  /** Format number with suffix */
  formatNumber(num, suffix = '') {
    if (num >= 1000000) return (num / 1000000).toFixed(0) + 'M' + suffix;
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K' + suffix;
    return num + suffix;
  },

  /** Check if element is in viewport */
  isInViewport(el, offset = 0) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
      rect.bottom >= offset
    );
  },

  /** Fetch with timeout */
  async fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { method: 'HEAD', signal: controller.signal });
      clearTimeout(id);
      return response.ok;
    } catch {
      clearTimeout(id);
      return false;
    }
  },

  /** Trap focus inside modal for accessibility */
  trapFocus(element) {
    const focusable = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handler = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    element.addEventListener('keydown', handler);
    first?.focus();
    return () => element.removeEventListener('keydown', handler);
  }
};
