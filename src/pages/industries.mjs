import { industries, products, services, site } from '../content.mjs';
import { icon, btn, breadcrumbs, ctaBanner, doc } from '../layout.mjs';

export function industriesPage() {
  const productBySlug = Object.fromEntries(products.map((p) => [p.slug, p]));
  const serviceBySlug = Object.fromEntries(services.map((s) => [s.slug, s]));

  const rows = industries
    .map(
      (ind) => `<article class="ind-row" id="${ind.slug}">
        <div class="ind-head">
          <span class="it-icon">${icon(ind.icon)}</span>
          <div>
            <h2>${ind.name}</h2>
            <p>${ind.summary}</p>
          </div>
        </div>
        <div class="ind-links">
          <div class="ind-link-group">
            <p>Relevant products</p>
            <ul>
              ${ind.products
                .map(
                  (slug) =>
                    `<li><a href="/products/${slug}/">${productBySlug[slug].name} ${icon('arrow-up-right')}</a></li>`
                )
                .join('')}
            </ul>
          </div>
          <div class="ind-link-group">
            <p>Relevant services</p>
            <ul>
              ${ind.services
                .map(
                  (slug) =>
                    `<li><a href="/services/#${slug}">${serviceBySlug[slug].name} ${icon('arrow-up-right')}</a></li>`
                )
                .join('')}
            </ul>
          </div>
        </div>
      </article>`
    )
    .join('');

  const body = `
    <section class="page-hero">
      <div class="shell">
        ${breadcrumbs([{ label: 'Industries' }])}
        <div class="page-hero-inner" style="margin-top:1.6rem">
          <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>Industries</p>
          <h1>Digital tools for the people who make healthcare happen.</h1>
          <p class="page-hero-lead">Healthcare is not a single market. Each audience below has a different working day, a different constraint and a different definition of a good tool. Find yours, then follow the links to the products and services built for it.</p>
        </div>
      </div>
    </section>

    <section class="section" aria-label="Audiences we serve">
      <div class="shell">
        ${rows}
      </div>
    </section>

    <section class="section bg-sage">
      <div class="shell">
        <div class="audience-note reveal">
          <div>
            <h2 style="font-size:clamp(1.4rem,1.2rem + .8vw,1.8rem);margin-bottom:.6rem">One company, several audiences.</h2>
            <p style="font-size:.97rem;line-height:1.7;color:var(--body);max-width:58ch">Not every product is intended for every audience. A clinical reference tool built for professionals is not a patient information service, and we are deliberate about keeping that distinction clear — in the products themselves and in how we describe them.</p>
          </div>
          <div class="audience-note-actions">
            ${btn({ href: '/products/', label: 'Browse all products' })}
            ${btn({ href: '/contact/', label: 'Ask which fits', variant: 'secondary', iconName: 'arrow-up-right' })}
          </div>
        </div>
      </div>
    </section>

    ${ctaBanner({
      title: 'Working in a setting we have not listed?',
      text: `${site.name} has delivered software across clinical, commercial and public-facing contexts. If your organisation sits between categories, tell us about it.`,
      primary: { href: '/contact/', label: 'Start a Conversation' },
      secondary: { href: '/services/', label: 'Our services' },
    })}
  `;

  return doc({
    title: 'Industries We Serve | Healthcare Technology | ITmedicus',
    description:
      'ITmedicus builds digital tools for doctors, hospitals and diagnostic centres, pharmaceutical companies, pharmacies, veterinary professionals and the public.',
    path: '/industries/',
    body,
  });
}
