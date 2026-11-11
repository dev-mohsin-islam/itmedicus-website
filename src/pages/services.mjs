import { services, process, faqs, industries } from '../content.mjs';
import { icon, btn, breadcrumbs, ctaBanner, doc, sectionHead } from '../layout.mjs';

export function servicesPage() {
  const body = `
    <section class="page-hero">
      <div class="shell">
        ${breadcrumbs([{ label: 'Services' }])}
        <div class="page-hero-inner" style="margin-top:1.6rem">
          <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>Services</p>
          <h1>Digital solutions designed around healthcare.</h1>
          <p class="page-hero-lead">From custom software to healthcare applications and pharmaceutical digital platforms, ITmedicus helps organisations and individual clients turn operational needs into useful digital experiences.</p>
          <div class="page-hero-actions">
            ${btn({ href: '/contact/', label: 'Discuss Your Project' })}
            ${btn({ href: '/products/', label: 'See the product portfolio', variant: 'secondary', iconName: 'arrow-up-right' })}
          </div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="svc-title">
      <div class="shell">
        <h2 id="svc-title" class="sr-only">Services</h2>
        <div class="svc-list">
          ${services
            .map(
              (s, i) => `<article class="svc-row" id="${s.slug}">
              <div class="svc-num">${String(i + 1).padStart(2, '0')}</div>
              <div class="svc-main">
                <span class="svc-icon-lg">${icon(s.icon)}</span>
                <h2>${s.name}</h2>
                <p>${s.detail}</p>
                <div class="svc-cta">${btn({ href: '/contact/', label: s.cta, variant: 'secondary' })}</div>
              </div>
              <div class="svc-side">
                <p class="svc-side-label">Typical scope</p>
                ${s.deliverables
                  .map((d) => `<p class="svc-deliverable">${icon('check')}<span>${d}</span></p>`)
                  .join('')}
              </div>
            </article>`
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="section bg-sage" aria-labelledby="process-title">
      <div class="shell">
        ${sectionHead({
          kicker: 'Engagement process',
          title: 'How an engagement runs.',
          lead: 'Discovery, scope and delivery are agreed before code is written, so that expectations and effort stay aligned throughout the work.',
        })}
        <div class="process">
          ${process
            .map(
              (p, i) => `<div class="process-step reveal" style="--i:${i}">
              <span class="process-num">${p.step}</span>
              <h3>${p.title}</h3>
              <p>${p.text}</p>
            </div>`
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="section bg-bone" aria-labelledby="audience-title">
      <div class="shell split split--wide-right">
        <div class="reveal">
          <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>Who we build for</p>
          <h2 class="section-title" id="audience-title">Services shaped by the audience they serve.</h2>
          <p class="section-lead" style="margin-bottom:1.8rem">A hospital, a pharmaceutical field team and a patient-facing app have different constraints. We plan around the audience from the first conversation.</p>
          <a class="link-underline" href="/industries/">Explore industries ${icon('arrow-right', 'ico')}</a>
        </div>
        <div class="industry-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">
          ${industries
            .slice(0, 4)
            .map(
              (ind) => `<a class="industry-tile reveal" href="/industries/#${ind.slug}">
              <span class="it-icon">${icon(ind.icon)}</span>
              <h3>${ind.name}</h3>
              <p>${ind.summary}</p>
            </a>`
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="faq-title">
      <div class="shell split">
        <div class="reveal">
          <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>Common questions</p>
          <h2 class="section-title" id="faq-title">Before you get in touch.</h2>
          <p class="section-lead">A few questions we are asked most often. If yours is not here, send it — we answer it directly rather than pointing you at a brochure.</p>
          <div class="page-hero-actions">
            ${btn({ href: '/contact/', label: 'Ask a question', variant: 'secondary' })}
          </div>
        </div>
        <div class="reveal">
          ${faqs
            .map(
              (f, i) => `<details class="acc-item"${i === 0 ? ' open' : ''}>
              <summary class="acc-summary">${f.q}<span class="acc-mark">${icon('plus')}</span></summary>
              <div class="acc-panel">${f.a}</div>
            </details>`
            )
            .join('')}
        </div>
      </div>
    </section>

    ${ctaBanner({
      title: 'Tell us what needs to work better.',
      text: 'A short description of the workflow, the users and the constraint is enough to start a useful conversation.',
      primary: { href: '/contact/', label: 'Start a Conversation' },
      secondary: { href: '/products/', label: 'Explore Products' },
    })}
  `;

  return doc({
    title: 'Healthcare Software Development & Digital Solutions | ITmedicus',
    description:
      'Custom healthcare software, doctor and prescription systems, pharmaceutical digital solutions, healthcare mobile apps, web platforms and product support from ITmedicus.',
    path: '/services/',
    body,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  });
}
