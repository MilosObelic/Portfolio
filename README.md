# Stefan Crnobrnja — stefanc.website

Fully self-owned personal site: hand-written HTML/CSS/JS, **no** frameworks,
build steps, CDNs, external fonts or trackers. Designed to be self-hosted on a
Raspberry Pi 4B — see [DEPLOY.md](DEPLOY.md).

All content, images and icons are original — nothing remains from the template
this site replaced.

## Structure

```
website/
├── index.html            # home: intro, profile card, about, skills, contact
├── cv.html               # education, experience, BTH coursework (printable)
├── projects.html         # project cards (currently: this site + placeholder)
├── 404.html              # not-found page (nginx + GitHub Pages both use it)
├── favicon.svg           # "SC" mark (primary icon)
├── favicon.ico           # "SC" mark (legacy fallback)
├── apple-touch-icon.png  # "SC" mark (iOS home screen)
├── robots.txt            # allow all + sitemap pointer
├── sitemap.xml           # page list for search engines
├── DEPLOY.md             # Raspberry Pi hosting guide
└── assets/
    ├── css/style.css     # all styling (incl. print stylesheet), variables at top
    ├── js/main.js        # language toggle, footer year, print button
    └── img/              # site-thumb.svg, og-image.png (link previews)
```

The CV page has a "Print / Save as PDF" button — the print stylesheet turns the
site into a clean light-on-white document automatically.

## Editing content

- **Two languages:** every translatable text exists twice, side by side:

  ```html
  <span class="en">English text</span><span class="sv">Svensk text</span>
  ```

  The EN/SV buttons in the nav switch between them (choice is remembered in
  the browser via localStorage; first visit follows the browser language).

- **Colors/spacing:** change the CSS variables at the top of
  `assets/css/style.css` (`--accent`, `--bg`, etc.) to re-theme the whole site.

- **Adding a project:** copy the `<article class="proj-card">…</article>` block
  in `projects.html`, swap the image, title, texts and chips. Put a screenshot
  in `assets/img/` (16:9 crops look best).

- **Testing locally:** just open `index.html` in a browser, or run
  `python -m http.server` inside this folder and visit `http://localhost:8000`.
