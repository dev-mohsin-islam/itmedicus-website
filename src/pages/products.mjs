import { products, productFilters, site } from '../content.mjs';
import { icon, btn, breadcrumbs, ctaBanner, productCard, doc } from '../layout.mjs';

export function productsPage() {
  const body = `
    <section class="page-hero">
      <div class="shell">
        ${breadcrumbs([{ label: 'Products' }])}
        <div class="page-hero-inner" style="margin-top:1.6rem">
          <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>Product directory</p>
          <h1>Applications and software for healthcare.</h1>
          <p class="page-hero-lead">Eight digital products for medicine information, clinical reference, patient support and professional engagement. Filter by audience, or open a product for its features, platforms and support route.</p>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="directory-title">
      <div class="shell">
        <h2 id="directory-title" class="sr-only">All products</h2>

        <div class="filter-bar" data-filter-bar role="group" aria-label="Filter products by audience">
          <span class="filter-label">Filter</span>
          ${productFilters
            .map(
              (f, i) =>
                `<button class="filter-btn" type="button" data-filter="${f.id}" aria-pressed="${
                  i === 0 ? 'true' : 'false'
                }">${f.label}</button>`
            )
            .join('')}
          <span class="filter-count" data-filter-count aria-live="polite">${products.length} products</span>
        </div>

        <ul class="product-grid" data-product-list>
          ${products
            .map((p, i) => {
              const card = productCard(p, i);
              return card.replace('<li class="product-card reveal"', `<li data-audiences="${p.audiences.join(' ')}" class="product-card reveal"`);
            })
            .join('')}
        </ul>

        <p class="grid-note">Platform availability is confirmed per product and shown on each card. A specific product is not available on every platform, and feature sets can differ between releases — check the linked store listing before relying on a particular capability.</p>
      </div>
    </section>

    <section class="section bg-bone" aria-labelledby="choose-title">
      <div class="shell">
        <div class="choose-grid">
          <div class="reveal">
            <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>Not sure where to start?</p>
            <h2 class="section-title" id="choose-title">Tell us the problem, not the product.</h2>
            <p class="section-lead">If you are evaluating a digital tool for a clinical, pharmaceutical or patient-facing need, describe the workflow and we will point you to the closest fit — including the honest answer when nothing in the portfolio fits and a custom build is the better route.</p>
            <div class="page-hero-actions">
              ${btn({ href: '/contact/', label: 'Discuss your requirement' })}
              ${btn({ href: '/services/', label: 'See our services', variant: 'secondary', iconName: 'arrow-up-right' })}
            </div>
          </div>
          <ul class="choose-list reveal">
            <li><span>${icon('stethoscope')}</span><div><h3>Healthcare professionals</h3><p>Start with DIMS, PDM or SkinVD.</p></div></li>
            <li><span>${icon('heart-pulse')}</span><div><h3>Patients &amp; the public</h3><p>Start with Patient Aid or Med Dictionary.</p></div></li>
            <li><span>${icon('molecule')}</span><div><h3>Pharmaceutical teams</h3><p>Start with mDoctor Agent or a custom platform.</p></div></li>
            <li><span>${icon('paw')}</span><div><h3>Veterinary practice</h3><p>Start with DIMS Vet.</p></div></li>
          </ul>
        </div>
      </div>
    </section>

    ${ctaBanner({
      title: 'Looking for something that is not in the catalogue?',
      text: 'A large part of our work is purpose-built software. Describe what your organisation needs and we will tell you what it would take.',
      primary: { href: '/contact/', label: 'Talk to Our Team' },
      secondary: { href: '/services/', label: 'Custom software' },
    })}
  `;

  return doc({
    title: 'Healthcare Apps & Software Products | ITmedicus',
    description:
      'Explore the ITmedicus product directory: DIMS, Patient Aid, PDM, DIMS Vet, Pharma Plus, SkinVD, mDoctor Agent and Med Dictionary, with features and platforms.',
    path: '/products/',
    body,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'ITmedicus products',
      itemListElement: products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.name,
        url: `https://itmedicus.com/products/${p.slug}/`,
        description: p.summary,
      })),
    },
  });
}
