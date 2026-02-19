# Atomic Agility Website

Static marketing site for Atomic Agility, built with folder-based routes suitable for GitHub Pages.

## Structure
- `index.html`
- `styles.css`
- `assets/site.js`
- `assets/favicon.ico`
- `assets/logo.png`
- `about/index.html`
- `services/index.html`
- `resources/index.html`
- `contact/index.html`
- `CNAME`

## Local preview
Because this site uses clean folder URLs, preview it with a local static server from the repo root.

Example:

```bash
python3 -m http.server 8080
```

Then open:
- <http://localhost:8080/>
- <http://localhost:8080/about/>
- <http://localhost:8080/services/>
- <http://localhost:8080/resources/>
- <http://localhost:8080/contact/>

## Deployment notes
- This repository is configured for custom-domain GitHub Pages deployment via `CNAME`.
- Contact form submissions are handled by Formspree from `contact/index.html`.

Contact email configured: `john@atomicagility.us`
