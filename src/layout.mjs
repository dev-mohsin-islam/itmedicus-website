import { site, social, stores, nav, products } from './content.mjs';

/* ------------------------------------------------------------------ *
 * Icons — 24×24 stroke set, drawn inline so there are no network requests
 * ------------------------------------------------------------------ */

const PATHS = {
  capsule:
    '<rect x="2.8" y="9.2" width="18.4" height="5.6" rx="2.8" transform="rotate(-45 12 12)"/><path d="M8.6 8.6l6.8 6.8"/>',
  'heart-pulse':
    '<path d="M20.3 5.7a4.9 4.9 0 0 0-7 0L12 7l-1.3-1.3a4.9 4.9 0 1 0-7 7L12 21l8.3-8.3a4.9 4.9 0 0 0 0-7z"/><path d="M3.5 12.4h3.2l1.6-2.8 2.2 5 1.7-2.9h3.3"/>',
  stethoscope:
    '<path d="M5 3v5a4 4 0 0 0 8 0V3"/><path d="M9 12v3.5a4.5 4.5 0 0 0 9 0V13"/><circle cx="18" cy="10.5" r="2.2"/>',
  paw: '<circle cx="7" cy="7.5" r="1.9"/><circle cx="12" cy="5.5" r="1.9"/><circle cx="17" cy="7.5" r="1.9"/><path d="M12 11c-3 0-5.4 2.4-5.4 5.1 0 2 1.6 3.4 3.4 2.7 1.3-.5 2.7-.5 4 0 1.8.7 3.4-.7 3.4-2.7C17.4 13.4 15 11 12 11z"/>',
  layers:
    '<path d="M12 3l8.5 4.6L12 12.2 3.5 7.6 12 3z"/><path d="M3.5 12.2L12 16.8l8.5-4.6"/><path d="M3.5 16.4L12 21l8.5-4.6"/>',
  skin: '<path d="M4 8.5c2.7-3 5.3-3 8-1.5s5.3 1.5 8-1.5"/><path d="M4 13c2.7-3 5.3-3 8-1.5s5.3 1.5 8-1.5"/><path d="M4 17.5c2.7-3 5.3-3 8-1.5s5.3 1.5 8-1.5"/>',
  link: '<path d="M10 13.5a4 4 0 0 0 5.7 0l2.8-2.8A4 4 0 0 0 12.8 5l-1.6 1.6"/><path d="M14 10.5a4 4 0 0 0-5.7 0L5.5 13.3A4 4 0 0 0 11.2 19l1.6-1.6"/>',
  book: '<path d="M4 4.8A2 2 0 0 1 6 3h5v18H6a2 2 0 0 1-2-1.8V4.8z"/><path d="M13 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 1.8h-5"/><path d="M7 8h2M7 12h2M16 8h2"/>',
  code: '<path d="M8.5 17L3.5 12l5-5"/><path d="M15.5 7l5 5-5 5"/><path d="M13.5 4l-3 16"/>',
  prescription:
    '<path d="M6 3h7a4.5 4.5 0 0 1 0 9H6z"/><path d="M6 12v9"/><path d="M13 12l6 9"/><path d="M16.5 4.5h4"/>',
  molecule:
    '<circle cx="12" cy="12" r="2.4"/><circle cx="5" cy="5.5" r="2"/><circle cx="19" cy="5.5" r="2"/><circle cx="5" cy="18.5" r="2"/><circle cx="19" cy="18.5" r="2"/><path d="M10.4 10.4L6.4 6.9M13.6 10.4l4-3.5M10.4 13.6l-4 3.5M13.6 13.6l4 3.5"/>',
  phone:
    '<rect x="6.5" y="2.5" width="11" height="19" rx="2.6"/><path d="M10.5 5.5h3"/><path d="M12 18.4h.01"/>',
  dashboard:
    '<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="4.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="10.5" width="7.5" height="10.5" rx="2"/>',
  support:
    '<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="2.5" y="13" width="4" height="6" rx="2"/><rect x="17.5" y="13" width="4" height="6" rx="2"/><path d="M19.5 19v.5a2.5 2.5 0 0 1-2.5 2.5h-3"/>',
  user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
  refresh:
    '<path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v4.5h-4.5"/>',
  handshake:
    '<path d="M3 10.5l3.5-3.5 3 3"/><path d="M21 10.5L17.5 7l-3 3"/><path d="M6.5 10l3.2 3.2a2 2 0 0 0 2.8 0l.5-.5 2.5 2.5a1.8 1.8 0 0 0 2.5-2.5L14 8.8"/><path d="M9.7 13.2l1.8 1.8M7.9 15l1.8 1.8"/>',
  hospital:
    '<path d="M4 21V6.5L12 3l8 3.5V21"/><path d="M2.5 21h19"/><path d="M12 8v6M9 11h6"/><path d="M9.5 21v-3.5h5V21"/>',
  pharmacy:
    '<path d="M3.5 9.5h17l-1.4 10a1.8 1.8 0 0 1-1.8 1.5H6.7a1.8 1.8 0 0 1-1.8-1.5z"/><path d="M8 9.5V6a4 4 0 0 1 8 0v3.5"/><path d="M12 13.5v4M10 15.5h4"/>',
  'arrow-right': '<path d="M4 12h15"/><path d="M13 6l6 6-6 6"/>',
  'arrow-up-right': '<path d="M7 17L17 7"/><path d="M8.5 7H17v8.5"/>',
  check: '<path d="M4.5 12.5l5 5L20 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  mail: '<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>',
  'phone-call':
    '<path d="M6.2 3.5h2.6l1.6 4-2 1.4a11 11 0 0 0 6.7 6.7l1.4-2 4 1.6v2.6a2.2 2.2 0 0 1-2.4 2.2A16.5 16.5 0 0 1 4 6a2.2 2.2 0 0 1 2.2-2.5z"/>',
  pin: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
  menu: '<path d="M3.5 7h17M3.5 12h17M3.5 17h17"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  shield: '<path d="M12 3l7.5 3v6c0 4.4-3.1 7.9-7.5 9-4.4-1.1-7.5-4.6-7.5-9V6z"/><path d="M8.8 12.2l2.2 2.2 4.2-4.4"/>',
  sparkle:
    '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M18 16.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
  external: '<path d="M14 4h6v6"/><path d="M20 4l-8.5 8.5"/><path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V7.5A1.5 1.5 0 0 1 5 6h4.5"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  whatsapp:
    '<path d="M12.04 2.1a9.9 9.9 0 0 0-8.5 14.96L2.1 22l5.06-1.4a9.9 9.9 0 1 0 4.88-18.5zm0 1.8a8.1 8.1 0 0 1 0 16.2 8 8 0 0 1-4.1-1.12l-.3-.18-3 .83.82-2.92-.19-.3A8.1 8.1 0 0 1 12.04 3.9zm-3.3 3.9c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.23.9 2.42 1.03 2.59.13.17 1.75 2.8 4.32 3.8 2.14.85 2.58.68 3.04.64.47-.04 1.5-.62 1.72-1.21.21-.6.21-1.1.15-1.21-.06-.11-.24-.17-.5-.3-.26-.13-1.5-.74-1.73-.83-.23-.08-.4-.12-.57.13-.17.25-.66.83-.81.99-.15.17-.3.19-.55.07-.26-.13-1.1-.41-2.1-1.3-.78-.7-1.3-1.55-1.45-1.81-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.46.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.55-1.4-.76-1.9-.2-.5-.4-.43-.55-.44h-.5z"/>',
  alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17.2h.01"/>',
  download: '<path d="M12 3.5v11"/><path d="M7.5 10l4.5 4.5 4.5-4.5"/><path d="M4 20.5h16"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5a13 13 0 0 1 0 17 13 13 0 0 1 0-17z"/>',
  briefcase:
    '<rect x="2.8" y="7.5" width="18.4" height="12.5" rx="2.4"/><path d="M8.5 7.5V5.6A1.6 1.6 0 0 1 10.1 4h3.8a1.6 1.6 0 0 1 1.6 1.6v1.9"/><path d="M2.8 13h18.4"/>',
  users:
    '<circle cx="9" cy="8.5" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.6a3.2 3.2 0 0 1 0 6.2"/><path d="M18.2 20a5.6 5.6 0 0 0-2.7-4.5"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
};

// Brand glyphs are drawn as solid shapes, not strokes.
const FILLED = new Set(['whatsapp']);

export function icon(name, cls = 'ico') {
  const body = PATHS[name] || PATHS.sparkle;
  const paint = FILLED.has(name)
    ? 'fill="currentColor" stroke="none"'
    : 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';
  return `<svg class="${cls}" viewBox="0 0 24 24" ${paint} aria-hidden="true" focusable="false">${body}</svg>`;
}

const SOCIAL_PATHS = {
  linkedin:
    '<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM2.9 21h4.2V9.5H2.9zM9.4 9.5h4v1.6a4.4 4.4 0 0 1 3.9-2c4 0 4.7 2.5 4.7 5.8V21h-4.2v-5.4c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9V21H9.4z"/>',
  facebook:
    '<path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.6V3.6A21 21 0 0 0 14.3 3.5c-2.4 0-4 1.4-4 4.1v2.3H7.6V13h2.7v8z"/>',
  youtube:
    '<path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15.1V8.9l5.2 3.1z"/>',
};

function socialIcon(name) {
  return `<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">${SOCIAL_PATHS[name] || ''}</svg>`;
}

/* ------------------------------------------------------------------ *
 * Brand
 *
 * The official ITmedicus wordmark is used in the header and footer.
 * `tools/logo.py` derives both variants (ink and white) from the published
 * source artwork, so there is a single source of truth for the mark.
 * ------------------------------------------------------------------ */

export function brand(variant = 'ink') {
  const src = variant === 'white' ? '/assets/img/itmedicus-logo-white.png' : '/assets/img/itmedicus-logo.png';
  return `<a class="brand" href="/" aria-label="${site.name} — home">
      <img class="brandlogo" src="${src}" width="342" height="58" alt="" decoding="async">
    </a>`;
}

/* ------------------------------------------------------------------ *
 * Header
 * ------------------------------------------------------------------ */

const productGroups = [
  { title: 'Medicine & reference', slugs: ['dims', 'pharma-plus', 'med-dictionary'] },
  { title: 'Clinical & patient', slugs: ['pdm', 'patient-aid', 'skinvd'] },
  { title: 'Practice & industry', slugs: ['dims-vet', 'mdoctor-agent'] },
];

function megaMenu() {
  const cols = productGroups
    .map((g) => {
      const items = g.slugs
        .map((slug) => {
          const p = products.find((x) => x.slug === slug);
          if (!p) return '';
          return `<li><a href="/products/${p.slug}/">
            <span class="mm-name">${p.name}</span>
            <span class="mm-desc">${p.tagline}</span>
          </a></li>`;
        })
        .join('');
      return `<div class="mm-col"><p class="mm-title">${g.title}</p><ul>${items}</ul></div>`;
    })
    .join('');

  return `<div class="megamenu" id="mega-menu">
      <div class="mm-grid">
        ${cols}
        <div class="mm-promo">
          <p class="mm-promo-kicker">Product directory</p>
          <p class="mm-promo-title">Eight products across medicine, clinical practice and patient care.</p>
          <a class="mm-promo-link" href="/products/">Browse all products ${icon('arrow-right')}</a>
        </div>
      </div>
    </div>`;
}

export function header(current = '/') {
  const isActive = (href) => {
    if (href === '/') return current === '/';
    return current.startsWith(href);
  };

  const navLinks = nav
    .map((item) => {
      if (item.menu) {
        return `<li class="nav-item has-menu">
            <a class="nav-link" href="${item.href}"${isActive(item.href) ? ' aria-current="page"' : ''}>
              ${item.label}
              <svg class="chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5L6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
            ${megaMenu()}
          </li>`;
      }
      return `<li class="nav-item"><a class="nav-link${isActive(item.href) ? ' is-active' : ''}" href="${item.href}"${
        isActive(item.href) ? ' aria-current="page"' : ''
      }>${item.label}</a></li>`;
    })
    .join('');

  return `<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header" id="site-header">
    <div class="shell header-inner">
      ${brand()}
      <nav class="primary-nav" aria-label="Primary">
        <ul class="nav-list">${navLinks}</ul>
      </nav>
      <div class="header-actions">
        <a class="btn btn--primary btn--sm header-cta" href="/contact/">Contact Us</a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open menu">
          <span class="menu-toggle-bars" aria-hidden="true"><i></i><i></i><i></i></span>
        </button>
      </div>
    </div>
    <div class="scroll-progress" aria-hidden="true"><span></span></div>
  </header>
  <div class="mobile-nav" id="mobile-nav" hidden>
    <div class="mobile-nav-head">
      ${brand()}
      <button class="menu-close" type="button" aria-label="Close menu">${icon('close')}</button>
    </div>
    <nav class="mobile-nav-body" aria-label="Mobile">
      <ul class="mobile-list">
        <li><a href="/"${current === '/' ? ' aria-current="page"' : ''}>Home</a></li>
        ${nav
          .map((i) => `<li><a href="${i.href}"${isActive(i.href) ? ' aria-current="page"' : ''}>${i.label}</a></li>`)
          .join('')}
      </ul>
      <p class="mobile-label">Products</p>
      <ul class="mobile-products">
        ${products.map((p) => `<li><a href="/products/${p.slug}/">${p.name}<span>${p.kicker}</span></a></li>`).join('')}
      </ul>
    </nav>
    <div class="mobile-nav-foot">
      <a class="btn btn--primary btn--block" href="/contact/">Contact Us</a>
      <div class="mobile-contact">
        <a href="mailto:${site.email}">${site.email}</a>
        <a href="${site.whatsappHref}" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </div>
  </div>`;
}

/* ------------------------------------------------------------------ *
 * Footer
 * ------------------------------------------------------------------ */

export function footer() {
  const year = new Date().getFullYear();
  return `<footer class="site-footer">
    <div class="footer-glow" aria-hidden="true"></div>
    <div class="shell">
      <div class="footer-top">
        <div class="footer-brand">
          ${brand('white')}
          <p class="footer-desc">${site.description}</p>
          <ul class="social-list">
            ${social
              .map(
                (s) =>
                  `<li><a href="${s.href}" aria-label="${site.name} on ${s.label}" rel="noopener" target="_blank">${socialIcon(
                    s.icon
                  )}<span>${s.label}</span></a></li>`
              )
              .join('')}
          </ul>
        </div>
        <div class="footer-col">
          <h2 class="footer-title">Company</h2>
          <ul class="footer-links">
            <li><a href="/about/">About Us</a></li>
            <li><a href="/services/">Services</a></li>
            <li><a href="/industries/">Industries</a></li>
            <li><a href="/insights/">Insights</a></li>
            <li><a href="/careers/">Careers</a></li>
            <li><a href="/contact/">Contact</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h2 class="footer-title">Products</h2>
          <ul class="footer-links">
            ${products
              .slice(0, 6)
              .map((p) => `<li><a href="/products/${p.slug}/">${p.name}</a></li>`)
              .join('')}
            <li><a href="/products/">All products</a></li>
          </ul>
        </div>
        <div class="footer-col footer-col--contact">
          <h2 class="footer-title">Get in touch</h2>
          <ul class="footer-contact">
            <li>${icon('mail')}<a href="mailto:${site.email}">${site.email}</a></li>
            <li>${icon('whatsapp')}<a href="${site.whatsappHref}" target="_blank" rel="noopener">WhatsApp us</a></li>
            <li>${icon('pin')}<address>${site.address.line1}<br>${site.address.line2}<br>${site.address.city}, ${
              site.address.country
            }</address></li>
          </ul>
          <div class="footer-stores">
            <p class="footer-store-label">Find our apps</p>
            <a href="${stores.googlePlay.href}" target="_blank" rel="noopener">${stores.googlePlay.label} ${icon('external')}</a>
            <a href="${stores.microsoft.href}" target="_blank" rel="noopener">${stores.microsoft.label} ${icon('external')}</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copy">© ${year} ${site.legalName}. All rights reserved.</p>
        <ul class="footer-legal">
          <li><a href="/privacy/">Privacy Policy</a></li>
          <li><a href="/terms/">Terms of Use</a></li>
          <li><a href="/contact/">Product Support</a></li>
        </ul>
        <p class="footer-note">Healthcare technology since ${site.founded} · Dhaka, Bangladesh · clients worldwide</p>
      </div>
    </div>
  </footer>`;
}

/* ------------------------------------------------------------------ *
 * Building blocks
 * ------------------------------------------------------------------ */

export function btn({ href, label, variant = 'primary', iconName = 'arrow-right', cls = '', attr = '' }) {
  return `<a class="btn btn--${variant}${cls ? ' ' + cls : ''}" href="${href}" ${attr}>${label}${
    iconName ? icon(iconName, 'ico btn-ico') : ''
  }</a>`;
}

export function sectionHead({ kicker, title, lead, align = 'left', id = '', level = 2 }) {
  return `<div class="section-head${align === 'center' ? ' section-head--center' : ''} reveal">
      ${kicker ? `<p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>${kicker}</p>` : ''}
      <h${level} class="section-title"${id ? ` id="${id}"` : ''}>${title}</h${level}>
      ${lead ? `<p class="section-lead">${lead}</p>` : ''}
    </div>`;
}

export function breadcrumbs(items) {
  const trail = [{ href: '/', label: 'Home' }, ...items];
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${site.origin}${item.href}` } : {}),
    })),
  };

  return `<nav class="crumbs" aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        ${items
          .map((i, idx) =>
            idx === items.length - 1
              ? `<li><span aria-current="page">${i.label}</span></li>`
              : `<li><a href="${i.href}">${i.label}</a></li>`
          )
          .join('')}
      </ol>
    </nav>
    <script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

export function ctaBanner({
  title = 'Have a healthcare technology project in mind?',
  text = 'Tell us about your goals. Our team can help you explore the right digital approach for your organisation.',
  primary = { href: '/contact/', label: 'Start a Conversation' },
  secondary = { href: '/products/', label: 'Explore Products' },
} = {}) {
  return `<section class="cta-band" aria-labelledby="cta-band-title">
      <div class="cta-band-lattice" aria-hidden="true"></div>
      <div class="shell cta-band-inner">
        <div class="cta-band-copy reveal">
          <p class="kicker kicker--light"><span class="kicker-rule" aria-hidden="true"></span>Next step</p>
          <h2 class="cta-band-title" id="cta-band-title">${title}</h2>
          <p class="cta-band-text">${text}</p>
        </div>
        <div class="cta-band-actions reveal">
          ${btn({ href: primary.href, label: primary.label })}
          ${btn({ href: secondary.href, label: secondary.label, variant: 'ghost-light', iconName: 'arrow-up-right' })}
        </div>
      </div>
    </section>`;
}

/** Fallback mark for a product whose artwork has not been supplied yet. */
export function monogram(name) {
  return name
    .split(/\s+/)
    .map((w) => w.replace(/[^A-Za-z]/g, '')[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function productMark(p, cls = 'pc-icon') {
  if (p.logo) {
    const plate = p.logoPlate ? ` ${cls}--plate` : '';
    return `<span class="${cls} ${cls}--logo${plate}"><img src="${p.logo}" alt="" width="46" height="46" decoding="async"></span>`;
  }
  return `<span class="${cls} ${cls}--mono" aria-hidden="true">${monogram(p.name)}</span>`;
}

export function productCard(p, index = 0) {
  return `<li class="product-card reveal" style="--a1:${p.accent[0]};--a2:${p.accent[1]};--i:${index}">
      <a class="product-card-link" href="/products/${p.slug}/">
        <div class="pc-top">
          ${productMark(p, 'pc-icon')}
          <span class="pc-kicker">${p.kicker}</span>
        </div>
        <h3 class="pc-name">${p.name}</h3>
        <p class="pc-tagline">${p.tagline}</p>
        <ul class="pc-platforms">
          ${p.platforms.map((pl) => `<li>${pl}</li>`).join('')}
        </ul>
        <span class="pc-more">Learn more ${icon('arrow-right', 'ico pc-arrow')}</span>
      </a>
    </li>`;
}

export function serviceCard(s, index = 0) {
  return `<li class="service-card reveal" style="--i:${index}">
      <span class="sc-icon">${icon(s.icon)}</span>
      <h3 class="sc-title"><a href="/services/#${s.slug}">${s.name}</a></h3>
      <p class="sc-text">${s.summary}</p>
      <span class="sc-link" aria-hidden="true">View service ${icon('arrow-right')}</span>
    </li>`;
}

export function disclaimer(text) {
  return `<div class="disclaimer">
      <span class="disclaimer-icon">${icon('alert')}</span>
      <p>${text}</p>
    </div>`;
}

export const CLINICAL_DISCLAIMER =
  'This application is an informational and educational reference tool. It does not replace professional judgement, clinical training, official prescribing information or the advice of a qualified healthcare professional, and it should not be used as the sole basis for a clinical decision.';

/* ------------------------------------------------------------------ *
 * Document shell
 * ------------------------------------------------------------------ */

/**
 * One Organization + WebSite graph on every page. Search engines use the @id
 * to merge the entity across pages instead of treating each page separately.
 */
export function siteGraph() {
  const org = {
    '@type': 'Organization',
    '@id': `${site.origin}/#organization`,
    name: site.name,
    alternateName: [site.legalName, 'ITmedicus Solutions'],
    legalName: site.legalName,
    url: site.origin,
    logo: {
      '@type': 'ImageObject',
      url: `${site.origin}/assets/img/app-mark-512.png`,
      width: 512,
      height: 512,
    },
    description: site.description,
    foundingDate: String(site.founded),
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${site.address.line1}, ${site.address.line2}`,
      addressLocality: site.address.city,
      addressCountry: 'BD',
    },
    areaServed: [
      { '@type': 'Country', name: 'Bangladesh' },
      { '@type': 'Place', name: 'Worldwide' },
    ],
    knowsAbout: [
      'Healthcare software',
      'Medical reference applications',
      'Pharmaceutical digital solutions',
      'Custom software development',
      'Software maintenance and support',
    ],
    sameAs: social.map((s) => s.href),
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${site.origin}/#website`,
    url: site.origin,
    name: site.name,
    inLanguage: 'en',
    publisher: { '@id': `${site.origin}/#organization` },
  };

  return `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [org, website],
  })}</script>`;
}

/**
 * Persistent WhatsApp action. The number stays inside the link, never on screen.
 */
export function whatsappFab() {
  return `<a class="wa-float" href="${site.whatsappHref}" target="_blank" rel="noopener"
      aria-label="Chat with ${site.name} on WhatsApp">
      ${icon('whatsapp', 'ico wa-float-icon')}
      <span class="wa-float-tip" aria-hidden="true">Chat on WhatsApp</span>
    </a>`;
}

export function doc({ title, description, path, body, bodyClass = '', jsonLd = null, ogType = 'website' }) {
  const canonical = `https://itmedicus.com${path}`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#123a2f">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="https://itmedicus.com/assets/img/og-default.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="ITmedicus — Building digital solutions for better healthcare.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://itmedicus.com/assets/img/og-default.png">
<link rel="icon" href="/assets/img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="/assets/img/favicon-16.png" sizes="16x16" type="image/png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400..700&family=Public+Sans:wght@300..700&display=swap">
<link rel="stylesheet" href="/assets/css/base.css">
<link rel="stylesheet" href="/assets/css/components.css">
<link rel="stylesheet" href="/assets/css/pages.css">
<link rel="stylesheet" href="/assets/css/animations.css">
<script>document.documentElement.classList.add('js');</script>
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
${siteGraph()}
</head>
<body class="${bodyClass}">
${header(path)}
<main id="main">
${body}
</main>
${footer()}
${whatsappFab()}
<script src="/assets/js/main.js" defer></script>
</body>
</html>`;

  /*
   * Rewrite root-relative internal links to page-relative ones so the same
   * build works when served from a domain root, from a subdirectory, or
   * opened straight from disk. Absolute URLs (canonical, OG, social) and
   * in-page anchors are untouched.
   */
  const segments = path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  if (segments.length && segments[segments.length - 1].includes('.')) segments.pop();
  const prefix = segments.length ? '../'.repeat(segments.length) : './';

  return html.replace(/(href|src)="\/(?!\/)([^"]*)"/g, (_, attr, rest) => `${attr}="${prefix}${rest}"`);
}
