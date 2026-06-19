# Sai Shrikar M K — Creative Portfolio

A premium, agency-style digital experience showcasing video editing work. Built for immersion — not resumes.

Inspired by high-end creative studios and Awwwards-winning experiences. Black-dominant, cinematic, and portfolio-first.

---

## Sections

| Section | Purpose |
|---------|---------|
| **Hero** | Fullscreen 3D experience with bold typography |
| **About** | Concise intro — Likable, 10+ brands, 30M+ views |
| **Ghost Editing** | Primary showcase — 3 premium videos with optional metrics |
| **Public Work** | 3 publicly released edits |
| **Long Form** | 1 featured cinematic piece |
| **Contact** | Minimal form + social links |

Removed: testimonials, FAQ, tech stack, workflow timeline, fake statistics, service lists.

---

## Quick Start

```bash
npm run dev
```

Open **http://localhost:3000**

> Requires a local server — `file://` won't load videos correctly.

---

## Adding Videos

### Ghost Editing (3 videos)
```
assets/videos/ghost/ghost1.mp4
assets/videos/ghost/ghost2.mp4
assets/videos/ghost/ghost3.mp4
```

### Public Work (3 videos)
```
assets/videos/public/edit1.mp4
assets/videos/public/edit2.mp4
assets/videos/public/edit3.mp4
```

### Long Form (1 video)
```
assets/videos/longform/longform1.mp4
```

### Instagram Metrics (optional, ghost only)

Edit `assets/videos.config.json` — only add verified numbers:

```json
{
  "ghost": {
    "ghost1.mp4": { "metric": "4M+ Views" },
    "ghost2.mp4": { "metric": "5M+ Views" }
  }
}
```

Leave empty strings for videos without metrics. Never fabricate stats.

Then regenerate:

```bash
npm run generate-manifest
```

---

## Project Structure

```
portfolio/
├── index.html
├── css/           main, components, animations
├── js/
│   ├── main.js        App bootstrap & navigation
│   ├── loader.js      Cinematic loading screen
│   ├── hero.js        Three.js 3D background
│   ├── animations.js  GSAP + Lenis scroll
│   ├── portfolio.js   Video galleries & modal
│   ├── cursor.js      Custom cursor & magnetic UI
│   ├── contact.js     Form validation
│   └── utils.js       Shared helpers
├── assets/
│   ├── videos.config.json    Per-video metrics
│   ├── videos-manifest.json  Auto-generated index
│   └── videos/
│       ├── ghost/
│       ├── public/
│       └── longform/
└── scripts/generate-manifest.js
```

---

## Customization

- **Social links** — Update Instagram, WhatsApp, email in `index.html`
- **Contact form** — Connect to Formspree/Netlify in `js/contact.js`
- **Typography** — Syne (display) + Inter (body) via Google Fonts

---

## Deployment

**Netlify / Vercel:** Deploy root folder. Run `generate-manifest` before deploy if videos changed.

**GitHub Pages:** Enable Pages on main branch.

---

## Tech Stack

- Three.js — Hero 3D particles
- GSAP + ScrollTrigger — Scroll animations
- Lenis — Smooth scrolling
- SplitType — Text reveals
- Vanilla HTML/CSS/JS — No framework overhead

---

© Sai Shrikar M K — Likable
