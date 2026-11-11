# ITmedicus — corporate website

A complete, production-ready corporate website for ITmedicus: healthcare technology,
medical applications and pharmaceutical digital solutions.

Built from the approved content and design blueprint (10 November 2026). Every page,
component and piece of copy in the project root is generated from the files in `src/` — no
framework, no runtime dependencies, no build tooling to install.

---

## Quick start

```bash
node build.mjs        # generate the site into the project root
node serve.mjs        # preview at http://localhost:5180
```

Or with npm:

```bash
npm run dev           # build, then serve
npm run build         # build only
```

Requires Node 18 or newer. There is nothing to `npm install` — the generator uses
only Node's standard library.

A server is already running at **http://localhost:5180** if the preview was started
for you. Internal links are page-relative, so the build also works unchanged when
deployed under a subdirectory — but full in-site navigation needs a server, because
each route is a directory containing an `index.html`.

---

## Where the site lives

`node build.mjs` writes the finished site to the **project root**, so `index.html`
sits at the top level and the folder can be uploaded or zipped as-is:

```
index.html  about/  products/  services/  …  assets/  sitemap.xml  robots.txt
build.mjs  serve.mjs  src/  tools/  qa/       ← tooling and sources
```

The build only ever deletes its own output (the page folders, `assets/`,
`sitemap.xml`, `robots.txt`, `404.html`) and refuses to clean if anything looks
unexpected, because the same folder holds `src/` and `tools/`. The preview server
refuses to serve `src/`, `tools/`, `qa/` or the build scripts, so a local preview
never exposes source.

---

## What is in the box

| Area | Detail |
| --- | --- |
| Pages | 23 routes: home, about, product directory, 8 product pages, services, industries, insights index, 4 articles, careers, contact, privacy, terms, 404 |
| Design system | 3 CSS layers (`base`, `components`, `pages`) plus a separate `animations` layer, CSS custom properties, fluid type and spacing scales |
| Brand | Official ITmedicus wordmark (ink + white), app mark, favicon set — derived from the published artwork by `tools/logo.py` |
| Behaviour | ~400 lines of dependency-free JavaScript, all progressive enhancement |
| Assets | Inline SVG icon set (42 icons), inline SVG logo, generated favicon, generated 1200 × 630 social image |
| SEO | Per-page titles, descriptions, canonicals, Open Graph and Twitter metadata, JSON-LD (Organization, ItemList, SoftwareApplication, FAQPage, BlogPosting, ContactPage), `sitemap.xml`, `robots.txt` |
| Accessibility | Semantic landmarks, skip link, one `<h1>` per page, visible focus states, keyboard-operable navigation and filters, `aria-live` filter counts, native `<details>` accordions, AA-contrast palette, `prefers-reduced-motion` support |

---

## Structure

```
build.mjs                 static site generator (zero dependencies)
serve.mjs                 local preview server
src/
  content.mjs             ← all copy, products, services, industries, articles
  layout.mjs              header, footer, icon set, shared components, <head>
  pages/                  one module per page type
  assets/
    base.css              tokens, reset, typography, layout primitives
    components.css        header, footer, buttons, cards, forms, accordions
    pages.css             hero, product, services, article, contact patterns
    animations.css        entrance choreography, hover, scroll and page transitions
    main.js               nav, scroll progress, reveal, counters, tilt, filters, form
    img/                  logo variants, favicons, app mark, social card
  og/og-card.html         source for the share image
assets/source/            master brand artwork, as downloaded
index.html, about/, …      generated output — never edit by hand
assets/                   generated css, js and images
tools/
  qa.mjs                  headless-browser QA: every route, console errors, overflow, screenshots
  audit.mjs               static audit: links, metadata, headings, JSON-LD, sitemap
  mobile-audit.mjs        phone audit at 360/390/414 px: tap targets, input zoom, tiny text
  interact.mjs            23 UI, motion and reduced-motion checks against the built site
  contrast.mjs            WCAG AA audit across twelve pages
  form-check.mjs          14 checks against the contact form
  og.mjs                  re-renders the social share image
  logo.py                 derives the logo, app mark and favicons from the source artwork
  theme-migrate.py        record of the navy/teal -> pine/clay token migration
```

---

## Editing content

Almost everything lives in `src/content.mjs`. Edit, then run `node build.mjs`.

- **Contact details, tagline, founding year** → the `site` object at the top.
- **Products** → the `products` array. Each entry drives the card, the product page,
  the mega-menu, the footer list and the JSON-LD. Add an entry and all of it follows.
- **Services / industries / insights** → their arrays. Industries reference products
  and services by `slug`, so links stay valid automatically.
- **Navigation** → the `nav` array.

Nothing else needs touching for a routine content change.

### Adding a product

Each product accepts a few optional fields: `logo` (app artwork), `logoPlate`
(put illustration-style artwork on a light tile), `storeUrl` (direct store listing)
and `pricing` (`free` / `premium` lists, rendered as the Free-and-premium section).

Append to `products` in `src/content.mjs` with a unique `slug`, then rebuild. The
product page is created at `/products/<slug>/`, appears in the directory filters via
`audiences`, and is picked up by the sitemap. Set `featured: true` to show it on the
homepage (the homepage shows up to six).

### Adding an article

Append to `insights` with `slug`, `category`, `date`, `readTime`, `title`, `excerpt`,
`author` and a `body` array of blocks (`h2`, `h3`, `p`, `ul`, `quote`). The table of
contents, share links, related posts and Article JSON-LD are generated from it.

---

## Design system

The palette is **deep pine, warmed bone and a single clay accent**. It deliberately
departs from the navy-and-teal combination the blueprint suggested — that pairing is
the default look of healthcare software, and the brief asked for something more
distinctive. Green keeps the healthcare association but acts as a structural colour
rather than a highlight; the bone backgrounds stop it reading as "medical mint".

| Token | Value | Use |
| --- | --- | --- |
| Pine 900 | `#0C2A22` | Dark panels, footer, feature cards |
| Pine 800 | `#123A2F` | Primary actions, app-mark ground |
| Sage 700 | `#245544` | Accent text, links, emphasis |
| Sage 100 | `#DFEAE2` | Icon chips, soft fills |
| Bone 100 | `#F5F1E8` | Alternating section background |
| Bone 50 | `#FBF9F4` | Page wash |
| Clay | `#C4703A` | Single warm highlight — notices, one product accent |
| Ink | `#14231E` | Headings and body ink |

**Type** pairs **Newsreader** (a journal serif, 400–700, optical sizing) for display
with **Public Sans** (a neutral grotesque) for text. The serif is what changes the
site's character most: headings are set at 600 rather than 800, with tighter leading
and looser tracking, and the hero's emphasis is carried by a true italic instead of a
heavy colour block. Both families load from Google Fonts with system fallbacks
(`Iowan Old Style` / `Palatino` for the serif), so the layout holds if the fonts fail.

Content max width is 1240 px, radii run 11–26 px, shadows stay deliberately shallow.
Palette and type are defined once, in `:root` in `base.css`; changing those ~20 values
re-themes every page.

The recurring visual motifs are a dot "data lattice", a clinical pulse line, and a
thin numbered kicker — repeated across hero, panels, footers and cards so the pages
read as one system rather than a set of templates.

Contrast is verified rather than eyeballed: `node tools/contrast.mjs` walks every text
element on twelve pages, resolves the effective background (compositing alpha layers
and approximating gradient stops) and fails anything below WCAG AA. It currently
reports **0 issues**.

---

## Brand assets

The header and footer use the **official ITmedicus wordmark**, taken from the
company's own published artwork rather than redrawn. The only published version is a
flat raster on a green field, so `tools/logo.py` isolates it:

1. reads `assets/source/about-itmedicus.png` (the master, as downloaded),
2. separates the letterforms from the green background by colour distance, keeping
   antialiased edges as partial alpha,
3. re-tints the result to site ink and to white,
4. trims it and writes every deliverable size.

```bash
python tools/logo.py      # regenerates everything below
```

| File | Use |
| --- | --- |
| `itmedicus-logo.png` (342 × 58) | Header, mobile drawer, light backgrounds |
| `itmedicus-logo-white.png` | Footer, social share card, dark backgrounds |
| `app-mark-512.png` | App mark / structured-data `logo` |
| `favicon-32.png`, `favicon-16.png`, `apple-touch-icon.png` | The `IT` monogram on brand navy |

**Replacing it with a vector.** If ITmedicus supplies the wordmark as SVG (or AI/EPS),
drop it in `src/assets/img/` and point `.brandlogo` at it — nothing else needs to
change. A vector master is worth requesting: it keeps the mark crisp at any size and
is what a printer or signage supplier will ask for.

### Product artwork

Seven of the eight products now carry their real app icon, supplied by the client
and stored in `assets/source/products/`. They arrive at different sizes (96–512 px),
some with transparent corners and one flattened onto white, so `tools/app-icons.py`
normalises them:

- crops to the visible artwork and drops stray transparent margins,
- composites each onto a square canvas at a uniform optical size,
- exports 320 px PNGs to `src/assets/img/products/`.

```bash
python tools/app-icons.py     # regenerate after replacing any source icon
```

Two rendering details make a mixed set look deliberate:

- **Full-bleed square icons** (Patient Aid, PDM, Pharma Plus, SkinVD) sit directly on
  the card.
- **Illustration-style marks** (DIMS, DIMS Vet, Med Dictionary) sit on a light tile,
  flagged with `logoPlate: true` in `content.mjs`, so they match the square icons'
  visual weight instead of floating.

A product without artwork (currently **mDoctor Agent**) falls back to a monogram tile
rather than a line icon, so nothing looks unfinished. Drop a file in
`assets/source/products/`, add `logo:` to that product, and re-run the script.

---

## Motion

Motion is a separate, additive layer (`animations.css`) so it can be tuned or removed
without touching layout. Everything respects `prefers-reduced-motion` — with that
preference set, all entrances, counters and parallax are disabled and content is
simply present.

| Where | What happens |
| --- | --- |
| Page load (hero, page heroes, product heroes, articles) | Elements rise and fade in a short staggered sequence rather than all at once |
| Hero composition | The pulse line draws itself; the interface cards drift slowly, offset from each other |
| Header | Logo settles slightly on scroll; nav links sweep an underline from the left; the mega-menu columns rise in sequence |
| Buttons | A light sweep crosses the fill on hover; the arrow nudges forward |
| Product cards | Subtle 3D tilt toward the pointer with a highlight that follows the cursor |
| Proof strip | The three counts tick up once, when the strip scrolls into view |
| Product page panel | Dashed rings drift slowly behind the icon |
| Scrolling | Sections reveal on entry, paired panels slide in from the side, grid children stagger |
| Page-to-page | Cross-document view transitions fade between pages (Chrome/Edge; ignored elsewhere) |

Tilt and spotlight are disabled on touch devices (`hover: hover` / `pointer: fine`),
and the counters keep their final value in the accessibility tree so a screen reader
never reads an intermediate number.

---

## Mobile

Most visitors arrive on a phone, so phone behaviour is measured rather than assumed.
`tools/mobile-audit.mjs` loads seven pages at 360, 390 and 414 px and checks
horizontal overflow, tap-target sizes (24 px floor), text-entry font sizes (below
16 px makes iOS zoom the viewport on focus) and text smaller than 11 px.

It found four real problems, all fixed:

| Problem | Fix |
| --- | --- |
| Form inputs at 15 px → iOS zoomed the page on focus | 16 px on phones |
| Footer, breadcrumb and sidebar links 16–21 px tall | vertical padding to clear 24 px |
| Small caps labels at 10–11 px | raised to 11.8 px on phones |
| No contact action in the mobile header at all | compact **Contact Us** button beside the menu |

Current state: **0 findings across 21 page/width combinations.**

## Search

- **One Organization + WebSite graph** on every page, keyed by `@id`, with
  `alternateName` ("ITmedicus Solutions"), `areaServed`, `knowsAbout` and `sameAs`,
  so the company resolves as one entity rather than 23 unrelated pages.
- **BreadcrumbList** generated alongside every visible breadcrumb.
- **SoftwareApplication** per product, including `isAccessibleForFree` and `Offer`
  entries for the free and premium tiers.
- **FAQPage** on the services and contact pages, answering the questions people
  actually search for ("is DIMS free", "do you work outside Bangladesh").
- **Page-specific titles and descriptions** tuned to search-snippet lengths, with
  product names written the way people search them ("DIMS App — …").
- **Internal linking** from articles into the product pages.
- `tools/audit.mjs` fails the build review on broken links, missing metadata,
  heading jumps, duplicate ids, invalid JSON-LD, or a sitemap that disagrees with
  the file tree — so the SEO work cannot quietly regress.

---

## Contact

The phone number is intentionally **not published**. Visitors reach the company by
email, the contact form, or a floating WhatsApp button present on every page
(`wa.me/8801856250187`). The number lives only inside that link.

To change it, edit `site.whatsapp` / `site.whatsappHref` in `src/content.mjs`.

## Contact form

The form validates on the client (required fields, email format, consent) and shows
inline errors plus an `aria-live` status message.

With no backend configured it degrades to a pre-filled `mailto:` — nothing is
silently discarded. To post to a real endpoint, set `FORM_ENDPOINT` at the top of
`src/assets/main.js`:

```js
var FORM_ENDPOINT = 'https://formspree.io/f/your-id';
```

Any service that accepts a `POST` of `FormData` works (Formspree, a serverless
function, your own API). Add server-side spam protection there; the client-side
checks are for usability, not security.

---

## Deployment

The project root is a plain static site — `index.html` sits at the top. Upload it to any static host (Netlify, Cloudflare
Pages, S3 + CloudFront, nginx).

0. **Upload the site, not the workspace.** Because the build sits beside the source,
   upload only: `index.html`, `404.html`, `sitemap.xml`, `robots.txt`, `assets/` and
   the page folders (`about/ careers/ contact/ industries/ insights/ privacy/
   products/ services/ terms/`). Leave `src/`, `tools/`, `qa/`, `build.mjs`,
   `serve.mjs` and the markdown files off the server — they are not needed to serve
   the site, and `src/assets/source/` contains the brand masters.
1. **Trailing slashes.** Every route is a directory with an `index.html`, so URLs end
   in `/`. Keep that behaviour; configure permanent redirects from any legacy URLs.
2. **404 page.** Point the host's not-found handler at `404.html`.
3. **Canonical host.** All absolute URLs and the sitemap use `https://itmedicus.com`.
   If the launch domain differs, change `site.origin` in `src/content.mjs` and rebuild.
4. **Cache headers.** Assets can be cached long-term; HTML should revalidate. If you
   enable long caching, add a content hash to asset paths first.
5. **HTTPS.** Required for the form, analytics and any future integrations.

---

## QA

```bash
node tools/qa.mjs          # all routes: console, overflow, headings, screenshots
node tools/interact.mjs    # drives the real UI: menu, filters, form validation
node tools/contrast.mjs    # WCAG AA contrast audit
node tools/mobile-audit.mjs  # phone ergonomics at three widths
node tools/audit.mjs         # static SEO / link / schema audit
node tools/form-check.mjs    # contact form behaviour
```

`qa.mjs` launches headless Chrome, visits all 23 routes, and reports: console errors,
failed requests, horizontal overflow (desktop and mobile), missing/duplicate `<h1>`,
unreplaced template values, and images without `alt`. It writes full-page screenshots
at 1440 px and 390 px into `qa/`.

`interact.mjs` performs 21 scripted checks against the built site: mobile drawer
open/close and focus handling, mega-menu keyboard access and pointer-hover animation,
product filter behaviour and its announced count, contact-form validation (empty,
invalid email, successful submit), sticky header and scroll progress, FAQ disclosures,
logo loading, count-up values, card tilt, reduced-motion fallback, and asset
resolution from disk.

`contrast.mjs` walks every element that carries its own text, resolves the effective
background and fails anything under AA. It found four genuine failures in the dark
panels and footer small print; all are fixed.

Last run: **0 routes with issues, 0 console errors, 0 overflow at 390 px and 1440 px;
22/22 interaction checks passed; 0 contrast issues across 12 pages.**

---

## Before launch

This build is complete and internally consistent, but several facts in it are
inherited from the blueprint and marked for confirmation. See
[LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md) — in particular the legal entity name,
the current office address and phone number, per-product platform and feature
accuracy, direct store-listing URLs, and legal review of the privacy policy and
terms.
#   i t m e d i c u s - w e b s i t e 
 
 