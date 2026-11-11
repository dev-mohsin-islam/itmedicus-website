import { products } from '../content.mjs';
import { btn, doc } from '../layout.mjs';

export function notFoundPage() {
  const body = `
    <section class="notfound">
      <div class="shell">
        <p class="nf-code" aria-hidden="true">404</p>
        <h1 style="margin-bottom:.8rem">This page has moved, or never existed.</h1>
        <p class="lead" style="max-width:52ch;margin-inline:auto">The address may be mistyped, or the page may have been renamed while the site was rebuilt. The links below cover almost everything people look for here.</p>
        <div class="nf-actions">
          ${btn({ href: '/', label: 'Back to home' })}
          ${btn({ href: '/contact/', label: 'Contact us', variant: 'secondary', iconName: 'mail' })}
        </div>
        <div class="nf-links">
          <a href="/products/">All products</a>
          ${products.map((p) => `<a href="/products/${p.slug}/">${p.name}</a>`).join('')}
          <a href="/services/">Services</a>
          <a href="/industries/">Industries</a>
          <a href="/insights/">Insights</a>
          <a href="/careers/">Careers</a>
          <a href="/about/">About</a>
        </div>
      </div>
    </section>
  `;

  return doc({
    title: 'Page not found | ITmedicus',
    description: 'The page you requested could not be found. Browse our products, services and insights instead.',
    path: '/404.html',
    body,
  });
}
