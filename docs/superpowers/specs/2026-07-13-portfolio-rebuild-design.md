# Portfolio Rebuild — Design Spec

**Date:** 2026-07-13
**Site:** shivamsharma.dev (GitHub Pages, repo `shivams1110.github.io`)

## Goal

Replace the compiled Flutter web app (~2MB JS, slow load, no SEO) with a
hand-crafted static portfolio in a "modern dev-minimal" style: a clean,
professional single page with developer touches (monospace accents,
code-comment headings, dark theme).

## Approach

Plain HTML/CSS/JS, no build step, no framework. Files:

- `index.html` — single page, all content inline
- `styles.css` — theme via CSS custom properties; dark default, light toggle
- `main.js` — theme toggle, scroll reveal, small niceties; site works with JS disabled
- `assets/img/` — profile photo + project icons (downloaded locally if the
  original URLs still resolve; otherwise monogram tiles rendered in CSS)

Fonts: Inter + JetBrains Mono via Google Fonts, with system-stack fallbacks.

## Page structure

1. **Nav** — `~/shivam-sharma` wordmark; anchors: about · work · blog · contact; theme toggle.
2. **Hero** — name, "Android & Flutter Developer", short tagline, profile photo,
   buttons *View Work* and *Resume* (Google Drive link), social icons
   (GitHub, LinkedIn, Twitter/X, Medium, Instagram, Facebook).
3. **About** — updated bio: 8+ years in mobile application development
   (3 years Android, 5+ years Flutter), currently at Karnival Internet
   Technologies Pvt. Ltd. Skills grid: Flutter, Dart, Android, Kotlin, Java,
   Firebase, REST APIs, Git, CI/CD, Play Store publishing.
4. **Work** — cards for all 10 projects from the old site's `project_data`
   (Dentmark, Tirth Yatra, Fortune Group, Eastman Tools, GNA University,
   Royalways, Monte Carlo Retail, Election Eye, Status Downloader, CToast),
   each with description and Play Store/GitHub link.
5. **Blog** — the 6 developertechie.com posts as a text list (title, date,
   external link). No images (old CDN is likely dead).
6. **Footer** — social links, copyright, "hand-built with plain HTML/CSS".

## Content decisions

- Bio years updated from "5+ years" (written ~2023) to "8+ years"; Karnival
  remains the current company (user-confirmed).
- All copy lightly proofread (grammar) but factually unchanged.

## Housekeeping

- **Keep:** `CNAME`, `app-ads.txt`, `beuni_musicplaye_privacy_policy.html`
  (linked from Play Store), `favicon.png`, Google site-verification meta tag,
  profile photos.
- **Delete:** `main.dart.js`, `main.dart.js.map`, `flutter.js`,
  `canvaskit/`, `assets/` Flutter runtime files (fonts, manifests, shaders),
  `version.json`, `license.txt`, `icons/` (replaced), `manifest.json`
  (replaced with a minimal one or dropped).
- **Service worker:** the old site registered `flutter_service_worker.js` as a
  PWA service worker in visitors' browsers. Replace it with a self-destructing
  stub (unregisters itself and clears caches) and add an unregister snippet in
  the new `index.html`, so returning visitors get the new site, not the cached
  Flutter app.
- **SEO:** title, meta description, canonical URL, Open Graph/Twitter cards,
  JSON-LD `Person` schema.

## Error handling / robustness

- Project icons stored locally — no hotlinking, no broken images. Missing
  icon ⇒ CSS monogram tile fallback.
- Site fully functional without JavaScript (theme toggle degrades to dark).
- Responsive from 320px up; wide content never causes horizontal page scroll.

## Testing / verification

- Serve locally (`python3 -m http.server`), verify rendering, anchors, links.
- Check responsive layout at phone/tablet/desktop widths.
- Validate no references to deleted Flutter files remain.
