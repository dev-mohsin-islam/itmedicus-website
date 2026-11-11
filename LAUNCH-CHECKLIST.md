# Launch checklist — ITmedicus website

Everything below is content or configuration that could not be verified from the
supplied blueprint. The site is built and working; these items must be confirmed by
ITmedicus before the site is published publicly.

Work down the list and either confirm the item or send a correction. Most are a
one-line edit in `src/content.mjs` followed by `node build.mjs`.

---

## 1. Blocking — confirm before any public launch

| # | Item | Where | Current state |
| --- | --- | --- | --- |
| 1.1 | **Legal entity name** | `site.legalName`, footer copyright | Uses `ITmedicus`. Blueprint flags that the exact legal name is unconfirmed. |
| 1.2 | **Registered / public office address** | `site.address`, contact page, footer | `F: 8/B, H:31, Eastern Housing, Basherpul, Demra, Dhaka` — taken from the existing website and flagged in the blueprint as needing confirmation. |
| 1.3 | **Telephone number — hidden by request** | `site.whatsapp`, `site.whatsappHref` | The phone number is **not published anywhere on the site**, including the structured data. Enquiries route through WhatsApp (`wa.me/8801856250187`) or email. Confirm the WhatsApp number is the right one for customer chat, and note that the number is still visible inside the `wa.me` link — unavoidable for WhatsApp to work. |
| 1.4 | **Enquiry email** | `site.email`, `site.supportEmail` | Both set to `info@itmedicus.com`. Confirm a monitored inbox, and whether product support should have a separate address. |
| 1.5 | **Privacy policy and terms of use** | `/privacy/`, `/terms/` | Drafted as a structured starting point, with a visible "Draft for review" notice on both pages. **Must be reviewed by legal counsel**, then that notice removed (search `legal-note` in `src/pages/legal.mjs`). |
| 1.6 | **Domain** | `site.origin` | Assumes `https://itmedicus.com`. Change once if the launch domain differs, then rebuild so canonical URLs, sitemap and OG tags follow. |
| 1.7 | **Office hours** | `src/pages/contact.mjs` | Placeholder pattern: Sunday–Thursday 10:00–18:00, Friday–Saturday closed. |
| 1.8 | **Logo files** | `src/assets/img/`, `assets/source/` | The header and footer use the official wordmark, extracted from the artwork published on the product sites. Please confirm (a) that this is the approved current logo and (b) that the site may use it. **Request the vector master** (SVG/AI/EPS) — the current source is a 342 × 58 raster on a green field, which is fine on screen but not for print, signage or very high-DPI displays. See README → Brand assets for the one-file replacement. |
| 1.9 | **Product logos** | `assets/source/products/`, `src/assets/img/products/` | Seven app icons supplied by the client and now in use (Patient Aid, DIMS, DIMS Vet, PDM, Pharma Plus, SkinVD, Med Dictionary). Remaining gaps: **mDoctor Agent** has no artwork (shows a monogram), and **Patient Aid** was supplied at 96 × 96, which is soft at the 62 px product-page size — a 512 px version would fix it. |
| 1.9a | **"Pharma Plus" naming** | `src/content.mjs` | The blueprint listed a product called *DIMS Plus*; the supplied artwork and name list call it **Pharma Plus**. The product has been renamed and its URL is now `/products/pharma-plus/` (the old `/products/dims-plus/` no longer exists). **Confirm this is the same product**, and confirm the description — the copy currently positions it as a medicine reference for pharmacy teams, which is an inference from the name and logo, not from supplied text. |
| 1.10 | **Brand palette and type** | `base.css` `:root` | The site uses **deep pine / bone / clay** with **Newsreader + Public Sans**, at the client's request — this deliberately replaces the navy `#12304A` and teal `#0E9A9A` suggested in the blueprint. Confirm the new direction is approved so it is not "corrected" back later. Changing the palette is a ~20-value edit in one block; contrast has been verified at AA. |
| 1.11 | **Logo colour on the new palette** | `tools/logo.py` | The wordmark is tinted to site ink (`#14231E`) and white. If the brand guidelines specify a fixed logo colour, set `INK` in `tools/logo.py` and re-run it. |

## 1b. Added from the live product sites

| # | Item | Where | Current state |
| --- | --- | --- | --- |
| 1b.1 | **Premium tiers** | `pricing` on DIMS, PDM, Patient Aid in `src/content.mjs` | Feature lists for DIMS and PDM were taken from the products' own premium pages. **Pricing is deliberately not published** — the public pages still show 2022 prices, so quoting them would likely be wrong. Add a pricing table once current plans are confirmed. |
| 1b.2 | **Patient Aid premium** | same | No public premium page could be reached, so its tier is described generically ("additional health content and tools"). Send the current premium feature list. |
| 1b.3 | **Direct Play Store links** | `storeUrl` per product | DIMS, PDM, Patient Aid and DIMS Vet now link to their own store listings (package IDs taken from the products' own site links). Pharmacy Plus, SkinVD, Med Dictionary and mDoctor Agent have no confirmed package ID and still point at the developer profile. |
| 1b.4 | **Legal name** | `site.legalName` | Set to **ITmedicus Solutions**, which is how the company names itself on the DIMS and PDM about pages. It is used in the footer and as the structured-data `legalName` / `alternateName`, so searching either "ITmedicus" or "ITmedicus Solutions" matches. Confirm the registered entity name. |
| 1b.5 | **DIMS Gateway** | pharmaceuticals service copy | The pharmaceutical service now mentions DIMS Gateway registration (a company maintaining its own product data) — taken from the DIMS pharmaceuticals page. Confirm you want this promoted on the corporate site. |

| 1.3a | **WhatsApp button** | `whatsappFab()` in `src/layout.mjs` | A floating chat button appears on every page, plus a WhatsApp block on the contact page, footer and product sidebars. If you would rather it appear only on the contact page, remove the `${whatsappFab()}` call from `doc()`. |

## 2. Product accuracy

The product copy is written from the blueprint's one-line descriptions plus the
feature themes it lists. It deliberately avoids specifics it cannot support.

- [x] **Per-product platform lists** (`platforms` in each product). Corrected by the
      product team on 10 November 2026 — **iOS is not available** for Patient Aid,
      SkinVD, DIMS Vet or Med Dictionary. Current list: DIMS — Android, iOS, Web,
      Windows; PDM — Android, iOS; Patient Aid — Android; DIMS Plus — Android;
      DIMS Vet — Android; SkinVD — Android; Med Dictionary — Android; mDoctor Agent —
      Android, Web. Store buttons are generated from this list, so a product only
      links to a store it is actually published on.
- [ ] **iOS store links** — DIMS and PDM are the two products with an iOS build, and
      neither page has an App Store URL yet (the page says the listing link is
      available from the product team). Send both URLs and they will be added to the
      product pages and to the `stores` object in `src/content.mjs`.
- [ ] **Per-product feature bullets** (`features`). Each list is a thematic starting
      point; verify every line against the current released version and delete
      anything retired.
- [ ] **DIMS Plus** — the blueprint asks for the exact differences from DIMS to be
      confirmed by the product owner. The current copy describes it as a streamlined
      entry point and makes no specific claims.
- [ ] **SkinVD** — blueprint flags AI features as unconfirmed. No AI capability is
      claimed anywhere in the current copy. If AI features exist, add them and add the
      corresponding disclaimer to the product page.
- [ ] **mDoctor Agent** — intended users described as pharmaceutical field and medical
      affairs teams; confirm this matches the current offering.
- [ ] **Clinical disclaimers** — shown automatically on DIMS, PDM, DIMS Vet, DIMS Plus
      and SkinVD (`clinical: true`). Have them reviewed, and confirm the same wording
      is used inside the apps themselves.

## 3. Store links

- [ ] The **Google Play** and **Microsoft Store** buttons currently point to the
      publisher profiles (both URLs supplied in the blueprint), not to individual app
      listings. Replace them with direct listing URLs per product as soon as they are
      confirmed — the blueprint explicitly asks for direct listings where available.
- [ ] Add **Apple App Store** links and badges if iOS listings exist; iOS is currently
      named as a platform without a store link.
- [ ] Confirm which products are genuinely published on Microsoft Store before linking
      any product page to it.

## 4. Claims and metrics

- [x] **App statistics published** — supplied 11 Nov 2026 and now shown on the DIMS
      and Patient Aid product pages, the homepage strip, and in structured data
      (`aggregateRating` + `interactionStatistic`):

      | App | Downloads | Rating | Reviews |
      | --- | --- | --- | --- |
      | DIMS | 7M+ | 4.6 | 150k+ |
      | Patient Aid | 3M+ | 4.5 | 150k+ |

      4.5 was supplied as "4.5+"; it is published as **4.5** because a rating is a
      single value, not a range.
- [ ] **Keep them current.** Each store page states "Google Play, as of November
      2026". Update `stats` in `src/content.mjs` (and the `asOf` date) whenever the
      figures move — stale numbers are worse than none. Suggested cadence: quarterly.
- [ ] **Confirm the source and permission.** These figures are assumed to come from
      the Google Play listings; confirm before launch, and confirm the review counts
      are total reviews rather than ratings.


- [x] No download counts, ratings, user numbers or customer names are published.
      The homepage proof strip uses only facts visible in the blueprint: founding year,
      product count, platform range and audience range.
- [ ] If you want metrics on the site later, publish them with a source and an
      "as of" date, and assign an owner to keep them current. Do **not** convert the
      DIMS Google Play figure into a company-wide total.

## 5. Integrations

- [ ] **Contact form endpoint** — set `FORM_ENDPOINT` in `src/assets/main.js`. Without
      it the form falls back to opening the visitor's email client with the message
      pre-filled. Add server-side spam protection when you wire it.
- [ ] **Analytics** — none is installed. If you add one, choose a privacy-conscious
      configuration, update the privacy policy's cookies section, and add a consent
      mechanism where the law requires it.
- [ ] **Social profiles** — footer links to LinkedIn, the ITmedicus Facebook page and
      the ITmedicus YouTube channel. Product pages do not link to product-specific
      Facebook or YouTube channels; add them if desired.
- [ ] **Careers** — the page currently shows an honest "no vacancies" state. Add roles
      to the `openings` array at the top of `src/pages/careers.mjs`; the page switches
      from empty state to a live list automatically.

## 6. Quality checks already completed

- [x] All 23 routes render; no console errors, no failed requests.
- [x] No horizontal overflow at 1440 px, 820 px or 390 px.
- [x] Exactly one `<h1>` per page; every image and inline icon has an accessible
      treatment (decorative graphics are `aria-hidden`).
- [x] Skip link, keyboard focus states, `prefers-reduced-motion` respected.
- [x] With reduced motion enabled, all entrances and counters are disabled and every
      section remains fully visible (verified in the browser, not assumed).
- [x] Official logo loads in the header (ink) and footer (white); favicons and app
      mark generated from the same master.
- [x] Product filter works with keyboard and announces its result count.
- [x] Titles, descriptions, canonicals, Open Graph, Twitter cards, JSON-LD, sitemap
      and robots.txt generated for every page.
- [x] 404 page with recovery links.
- [x] Social share image rendered at 1200 × 630.

## 7. Recommended at launch

- [ ] Re-test the contact form against the real endpoint, including a failure case.
- [ ] Run a Lighthouse pass on the deployed host (performance depends on hosting,
      compression and cache headers, not on the markup).
- [ ] Check the site on a mid-range Android device, not just a desktop browser.
- [ ] Set up 301 redirects from the most-visited URLs of the old site.
- [ ] Submit `sitemap.xml` to Google Search Console and Bing Webmaster Tools.
- [ ] Add the Google Business Profile and app store developer pages to the same
      verified address used on this site.
