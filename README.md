# Stackly – PankajUX India

Marketing homepage for Stackly, built with plain HTML, CSS and vanilla JavaScript.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Homepage markup and content |
| `services.html` | Services page: capabilities, engagement models, process |
| `about.html` | About page: story, values, stats, culture, process |
| `blog.html` | Blog index with featured article and category filters |
| `contact.html` | Contact page with enquiry form, offices and FAQ |
| `404.html` | Not-found page with helpful navigation |
| `css/home.css` | Homepage styles, theme tokens, responsive breakpoints |
| `css/pages.css` | Interior page styles (loaded after `home.css`) |
| `js/home.js` | Header, mobile menu, counters, filters, form validation |
| `js/pages.js` | Blog filters, blog newsletter and contact form validation |
| `register.html` | Account registration page (split-panel layout) |
| `login.html` | Sign-in page sharing the registration layout |
| `css/style.css` | Auth page styles for registration and sign-in |
| `js/script.js` | Auth validation, password toggles and Google placeholders |
| `images/` | Homepage photography plus `team-hero.jpg` used by the auth pages |

The homepage, interior pages and the auth pages are intentionally decoupled:
each page loads only the stylesheets and scripts it needs. Interior pages reuse
the shared tokens and components from `home.css` and add page-specific layout
in `css/pages.css`. All content pages use the same transparent, sticky header
from `home.css`, which overlays the hero and turns solid white once scrolled.
Registration and sign-in share the split-panel layout in
`css/style.css` and the validation logic in `js/script.js`.

## Page sections

1. Sticky header / navigation
2. Hero with statistics bar
3. Services grid
4. Software solutions introduction
5. Why choose us
6. Process timeline
7. Who we are / about
8. Industries served
9. Filterable project gallery
10. Articles / insights
11. CTA banner
12. Footer with newsletter

## Local preview

Open `index.html` directly in a browser, or serve the folder:

```powershell
# from this directory
python -m http.server 5500
# then open http://localhost:5500/
```

## Interactions

- Sticky, condensed header on scroll
- Accessible mobile menu (Esc to close, body scroll lock)
- Scroll-reveal animations with reduced-motion fallback
- Animated statistics counters triggered on first view
- Project gallery category filters
- Newsletter email validation with inline error/success states
- Scroll-spy navigation highlighting and back-to-top button
- Registration and sign-in validation with inline messages
- Show/hide password toggles and Google OAuth placeholders

## Responsive breakpoints

Verified with no horizontal overflow at 1440, 1024, 920, 820, 768, 390, 360
and 320 px. Registration and sign-in pages were additionally checked at 1440,
768, 390, 360 and 320 px, including form and top-nav fit.

## Notes

- Images are high-resolution Unsplash placeholders. Replace files in
  `images/` with final assets while keeping the same filenames.
- All images below the fold use `loading="lazy"`. Full-page screenshots taken
  without scrolling may show empty areas.
- The year figures are consistent as of 2026: `Since 2012` and `14+ years`.
