# Portfolio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the compiled Flutter web app at shivamsharma.dev with a fast, hand-crafted static portfolio (modern dev-minimal style).

**Architecture:** Single static page (`index.html`) styled by `styles.css` (CSS custom properties, dark default + light toggle) with a small `main.js` for the toggle and scroll-reveal. Content is authored inline in the HTML from the data already extracted from the old app. Old Flutter artifacts are deleted and the stale PWA service worker is force-unregistered.

**Tech Stack:** Plain HTML5/CSS3/vanilla JS. Google Fonts (Inter, JetBrains Mono) with system fallbacks. No build step.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-13-portfolio-rebuild-design.md`
- Must keep working at their current URLs: `CNAME` (`shivamsharma.dev`), `app-ads.txt`, `beuni_musicplaye_privacy_policy.html`, `favicon.png`
- Keep meta tag: `<meta name="google-site-verification" content="MMOX-iyz2lDUu45Blb4ICnRbIq8Uq2aHwMs-Ljeg_sM" />`
- Bio copy: "8+ years of experience in mobile application development — 3 years in Android and 5+ years in Flutter. Currently working at Karnival Internet Technologies Pvt. Ltd. as a Mobile Application Developer."
- Site must work with JavaScript disabled (dark theme default, all content visible)
- No horizontal page scroll at any viewport ≥ 320px
- The frontend-design skill MUST be invoked before authoring the page UI

## Content Inventory (source of truth)

- Name/role/bio: `assets/assets/lang/en.json` (years updated per constraint above)
- Projects (10): `assets/assets/json/project_data` — icons already downloaded to `assets/img/projects/*.webp` (all except CToast, which has none → CSS monogram tile)
- Blog posts (6): `assets/assets/json/blog_data` — text-only entries (title, date, url); do NOT hotlink the dead `secureservercdn.net` images
- Social: GitHub `https://github.com/shivams1110`, LinkedIn `https://www.linkedin.com/in/shivamsharma11/`, Twitter/X `https://twitter.com/shivams_me`, Medium `https://theshivamsharma.medium.com/`, Instagram `https://www.instagram.com/official.shivam/`, Facebook `https://www.facebook.com/shivams1110`
- Resume: `https://drive.google.com/file/d/1tiOC9bgEGX8TKTTpTkTt63_Yw4y2o0ys/view?usp=sharing`
- Profile photo: copy `assets/assets/images/profile.jpg` → `assets/img/profile.jpg`

**Ordering note:** Task 1 reads content from `assets/assets/...`; Task 2 deletes that tree. Do not reorder.

---

### Task 1: Build the new site (index.html, styles.css, main.js)

**Files:**
- Create: `index.html` (replaces Flutter loader page)
- Create: `styles.css`
- Create: `main.js`
- Create: `assets/img/profile.jpg` (copied from `assets/assets/images/profile.jpg`)

**Interfaces:**
- Produces: `index.html` referencing only `styles.css`, `main.js`, `favicon.png`, `assets/img/**`. Nothing under `canvaskit/`, no `flutter*.js`, no `main.dart.js`.

- [ ] **Step 1: Invoke the frontend-design skill** and pick a concrete visual direction within "modern dev-minimal" (typography scale, palette, spacing) before writing markup.

- [ ] **Step 2: Copy the profile photo**

```bash
cp assets/assets/images/profile.jpg assets/img/profile.jpg
```

- [ ] **Step 3: Author `index.html`** with this exact skeleton (content filled from the Content Inventory):

```
<head>
  title: "Shivam Sharma — Android & Flutter Developer"
  meta description, canonical https://shivamsharma.dev/
  google-site-verification meta (verbatim from Global Constraints)
  Open Graph + Twitter card tags (og:image = assets/img/profile.jpg)
  JSON-LD Person schema (name, url, jobTitle, sameAs = 6 social URLs)
  Google Fonts: Inter 400/500/700, JetBrains Mono 400/600
  <script> service-worker unregister snippet (see Task 2 Step 1)
</head>
<body>
  nav      — "~/shivam-sharma" wordmark, anchors #about #work #blog #contact, theme toggle button
  header#top (hero) — h1 name, role line, tagline, photo, [View Work] [Resume] buttons, social icon row
  section#about — bio paragraph (exact copy from Global Constraints) + skills grid
                  (Flutter, Dart, Android, Kotlin, Java, Firebase, REST APIs, Git, CI/CD, Play Store)
  section#work  — 10 project cards: icon (webp or monogram tile for CToast), title,
                  description (proofread copy from project_data), link (Play Store / GitHub)
  section#blog  — 6 list entries: title (link to developertechie.com URL), date
  footer#contact — social links repeated as text, © year, "hand-built with plain HTML & CSS"
</body>
```

All external links get `target="_blank" rel="noopener"`.

- [ ] **Step 4: Author `styles.css`** — CSS custom properties on `:root` (dark default) and `[data-theme="light"]` overrides; responsive grid for skills/projects (`repeat(auto-fill, minmax(...))`); `max-width` content column; monospace accents for nav/headings; focus-visible styles.

- [ ] **Step 5: Author `main.js`** — theme toggle persisting to `localStorage` (respect `prefers-color-scheme` on first visit), plus `IntersectionObserver` scroll-reveal that is purely progressive (content visible without JS).

- [ ] **Step 6: Verify locally**

Run: `python3 -m http.server 4173` then check `http://localhost:4173/`
Expected: page renders; all 4 anchors navigate; every `<img>` resolves (no 404s in server log); page has no reference to `main.dart.js`.

Run: `grep -c 'main.dart\|flutter' index.html`
Expected: `0`

- [ ] **Step 7: Commit**

```bash
git add index.html styles.css main.js assets/img/
git commit -m "Rebuild portfolio as hand-crafted static site"
```

### Task 2: Kill the stale service worker + delete Flutter artifacts

**Files:**
- Modify: `flutter_service_worker.js` (replace with self-destructing stub)
- Modify: `index.html` head (unregister snippet — part of Task 1 skeleton)
- Delete: `main.dart.js`, `main.dart.js.map`, `flutter.js`, `canvaskit/`, `version.json`, `license.txt`, `assets/AssetManifest*`, `assets/FontManifest.json`, `assets/NOTICES`, `assets/LICENSE`, `assets/fonts/`, `assets/packages/`, `assets/shaders/`, `assets/assets/` (after confirming Task 1 committed), `icons/`
- Modify: `manifest.json` (minimal, pointing at favicon)

**Interfaces:**
- Consumes: Task 1's committed `index.html` (content already copied out of `assets/assets/`).

- [ ] **Step 1: Unregister snippet in `index.html`** (verify it is present from Task 1; add if missed):

```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then(function (rs) { rs.forEach(function (r) { r.unregister(); }); });
    if (window.caches) {
      caches.keys().then(function (ks) { ks.forEach(function (k) { caches.delete(k); }); });
    }
  }
</script>
```

- [ ] **Step 2: Replace `flutter_service_worker.js`** entire contents with:

```js
// Self-destructing service worker: the old Flutter PWA registered this file.
// Returning visitors fetch it, it unregisters itself and clears caches.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (ks) { return Promise.all(ks.map(function (k) { return caches.delete(k); })); })
      .then(function () { return self.registration.unregister(); })
      .then(function () { return self.clients.matchAll({ type: 'window' }); })
      .then(function (cs) { cs.forEach(function (c) { c.navigate(c.url); }); })
  );
});
```

- [ ] **Step 3: Delete Flutter artifacts**

```bash
git rm -r --quiet main.dart.js main.dart.js.map flutter.js canvaskit \
  version.json license.txt icons \
  assets/AssetManifest.json assets/AssetManifest.bin assets/AssetManifest.bin.json \
  assets/FontManifest.json assets/NOTICES assets/LICENSE \
  assets/fonts assets/packages assets/shaders assets/assets
```

- [ ] **Step 4: Rewrite `manifest.json`**

```json
{
  "name": "Shivam Sharma — Portfolio",
  "short_name": "Shivam Sharma",
  "start_url": ".",
  "display": "browser",
  "background_color": "#0d1117",
  "theme_color": "#0d1117",
  "icons": [{ "src": "favicon.png", "sizes": "16x16", "type": "image/png" }]
}
```

- [ ] **Step 5: Verify nothing references deleted files**

Run: `grep -rn 'main.dart\|canvaskit\|flutter.js' index.html main.js styles.css manifest.json; echo "exit=$?"`
Expected: no matches (`exit=1`)

Run: `python3 -m http.server 4173` — reload site, confirm renders, no 404s except none.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Remove Flutter build artifacts; self-destruct stale service worker"
```

### Task 3: Final verification pass

**Files:** none (verification only)

- [ ] **Step 1: Link inventory** — `grep -oE 'href="[^"]+"' index.html | sort -u` and confirm every external URL matches the Content Inventory exactly.

- [ ] **Step 2: Responsive check** — render at 375px, 768px, 1280px widths (browser devtools or screenshot tool); confirm no horizontal scroll, nav collapses gracefully.

- [ ] **Step 3: JS-disabled check** — load with JS off (or mentally verify: no content is hidden by default in CSS; reveal animations only apply under a `.js` class added by main.js).

- [ ] **Step 4: Repo hygiene** — `git status` clean; `du -sh .` dramatically smaller than the 6.5MB baseline.
