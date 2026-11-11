import { site } from '../content.mjs';
import { icon, btn, breadcrumbs, ctaBanner, doc, sectionHead } from '../layout.mjs';

const openings = []; // Publish only active vacancies here.

export function careersPage() {
  const roles = openings.length
    ? openings
        .map(
          (r) => `<article class="role-row">
            <div>
              <h3>${r.title}</h3>
              <p class="role-meta">${r.location} · ${r.type} · ${r.department}</p>
              <p class="role-desc">${r.summary}</p>
            </div>
            ${btn({ href: `mailto:${site.email}?subject=${encodeURIComponent('Application — ' + r.title)}`, label: 'Apply', variant: 'secondary' })}
          </article>`
        )
        .join('')
    : `<div class="empty-state reveal">
        <span class="empty-icon">${icon('briefcase')}</span>
        <h3>No vacancies are published right now.</h3>
        <p>We only list genuinely active roles here, so this page stays empty until a position opens. If you would like to be considered for future work, send a CV and a short note about what you would like to build.</p>
        ${btn({
          href: `mailto:${site.email}?subject=${encodeURIComponent('Speculative application — careers')}`,
          label: 'Send a speculative application',
          iconName: 'arrow-up-right',
        })}
      </div>`;

  const body = `
    <section class="page-hero">
      <div class="shell">
        ${breadcrumbs([{ label: 'Careers' }])}
        <div class="page-hero-inner" style="margin-top:1.6rem">
          <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>Careers</p>
          <h1>Build technology that matters.</h1>
          <p class="page-hero-lead">At ${site.name}, we bring technology and healthcare together. We welcome people who care about building useful products, solving problems and learning continuously.</p>
          <div class="page-hero-actions">
            ${btn({ href: '#openings', label: 'View open positions' })}
            ${btn({
              href: `mailto:${site.email}?subject=${encodeURIComponent('Speculative application — careers')}`,
              label: 'Send your CV',
              variant: 'secondary',
              iconName: 'mail',
            })}
          </div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="culture-title">
      <div class="shell split">
        <div class="reveal">
          <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>Working here</p>
          <h2 class="section-title" id="culture-title">Small teams, real products, direct feedback.</h2>
          <div class="prose" style="max-width:none;font-size:1rem">
            <p>Our teams work close to the products they build and the people who use them. That means fewer layers between a decision and its consequence, and much more direct feedback from clinicians, pharmacists and patients.</p>
            <p>We look for people who are comfortable with the ambiguity of healthcare domain work: reading carefully, asking a second question, and preferring a correct slow answer over a confident wrong one.</p>
          </div>
        </div>
        <div class="reveal">
          ${[
            { t: 'Products you can point to', d: 'Applications used by healthcare professionals and the public, not internal tools with no audience.', i: 'sparkle' },
            { t: 'Healthcare domain depth', d: 'You will learn how clinical and pharmaceutical work actually happens, and why the details matter.', i: 'stethoscope' },
            { t: 'Craft over churn', d: 'We would rather ship fewer things that hold up than a stream of features nobody asked for.', i: 'shield' },
            { t: 'Room to grow', d: 'People move between products and services, and pick up skills the work requires.', i: 'refresh' },
          ]
            .map(
              (x) => `<div class="diff-item">
              <span class="diff-icon">${icon(x.i)}</span>
              <div><h3>${x.t}</h3><p>${x.d}</p></div>
            </div>`
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="section bg-bone" id="openings" aria-labelledby="openings-title">
      <div class="shell">
        ${sectionHead({
          kicker: 'Open positions',
          title: 'Current opportunities.',
          lead: 'Every role listed here is active. If nothing is listed, there is no open vacancy — but a speculative application is always welcome.',
        })}
        ${roles}
        <div class="career-cta reveal" style="margin-top:2.5rem">
          <div>
            <h2 style="font-size:clamp(1.3rem,1.15rem + .6vw,1.6rem);margin-bottom:.6rem">How to apply</h2>
            <p style="font-size:.95rem;line-height:1.68;color:var(--body)">Send a CV and a short note about the kind of work you want to do. Please state the role, your location and your availability. We read every application, and we reply when there is a real fit — even if that takes a little time.</p>
          </div>
          <div style="display:grid;gap:.6rem">
            ${btn({
              href: `mailto:${site.email}?subject=${encodeURIComponent('Application — careers')}`,
              label: 'Email your application',
              cls: 'btn--block',
            })}
            <a class="link-underline" href="/contact/?type=career" style="justify-self:center">Or use the contact form ${icon('arrow-right', 'ico')}</a>
          </div>
        </div>
      </div>
    </section>

    ${ctaBanner({
      title: 'Not seeing your role?',
      text: 'Tell us what you do and what you would like to work on. Good people are worth a conversation even without a listed vacancy.',
      primary: { href: `mailto:${site.email}?subject=Speculative%20application`, label: 'Get in touch' },
      secondary: { href: '/about/', label: 'About ITmedicus' },
    })}
  `;

  return doc({
    title: 'Careers at ITmedicus | Build Technology That Matters',
    description:
      'Work on healthcare technology that matters. Explore current opportunities at ITmedicus or send a speculative application.',
    path: '/careers/',
    body,
  });
}
