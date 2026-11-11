import { site, values, process, differentiators } from '../content.mjs';
import { icon, btn, sectionHead, breadcrumbs, ctaBanner, doc } from '../layout.mjs';

export function aboutPage() {
  const body = `
    <section class="page-hero">
      <div class="shell">
        ${breadcrumbs([{ label: 'About' }])}
        <div class="page-hero-inner" style="margin-top:1.6rem">
          <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>About ITmedicus</p>
          <h1>Technology with a healthcare purpose.</h1>
          <p class="page-hero-lead">ITmedicus is a healthcare technology company focused on developing digital applications, software and technology-enabled services for healthcare professionals, pharmaceutical organisations and the wider community.</p>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="story-title">
      <div class="shell split">
        <div class="reveal">
          <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>Our story</p>
          <h2 class="section-title" id="story-title">Since ${site.founded}, at the intersection of IT and healthcare.</h2>
          <div class="prose" style="max-width:none;font-size:1rem">
            <p>Since ${site.founded}, ITmedicus has worked at the intersection of information technology and healthcare. Our work has evolved from healthcare information applications into a broader portfolio of mobile apps, professional software and digital solutions.</p>
            <p>We continue to focus on practical technology that helps people access information, manage workflows and connect with digital healthcare services — for clinicians at the point of care, for organisations running operations, and for the public looking for clearer answers.</p>
          </div>
        </div>
        <div class="media-panel reveal">
          <div class="mp-lattice" aria-hidden="true"></div>
          <div class="mp-top">
            <span class="mp-badge">${icon('sparkle')}${site.founded} — today</span>
            <p class="mp-quote">“Useful technology, shaped by the people who use it.”</p>
          </div>
          <div class="mp-rows">
            <div class="mp-row"><span class="mp-k">Started with</span><span class="mp-v">ICT in healthcare and mobile applications</span></div>
            <div class="mp-row"><span class="mp-k">Grew into</span><span class="mp-v">Professional software and digital platforms</span></div>
            <div class="mp-row"><span class="mp-k">Today</span><span class="mp-v">A product portfolio plus custom delivery</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="mv-title">
      <div class="shell">
        <h2 id="mv-title" class="sr-only">Mission and vision</h2>
        <div class="mv-grid">
          <article class="mv-card mv-card--dark reveal">
            <div class="mp-lattice" aria-hidden="true"></div>
            <span class="mv-icon">${icon('target')}</span>
            <h3>Our mission</h3>
            <p>To create useful, accessible and dependable digital solutions that support better healthcare information, professional workflows and healthcare experiences.</p>
          </article>
          <article class="mv-card reveal">
            <span class="mv-icon">${icon('eye')}</span>
            <h3>Our vision</h3>
            <p>To be a trusted healthcare technology partner, recognised for meaningful digital products and software that contribute to a more connected healthcare ecosystem.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section bg-bone" aria-labelledby="values-title">
      <div class="shell">
        ${sectionHead({
          kicker: 'Our values',
          title: 'Five principles that decide how we build.',
          lead: 'These are not posters on a wall — they are the tests we apply when a project has to choose between what is easiest and what is right.',
        })}
        <div class="cols-2" style="gap:0 clamp(1.5rem,4vw,3rem)">
          ${values
            .map(
              (v, i) => `<div class="value-item reveal" style="--i:${i}">
              <span class="value-num">${String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>${v.title}</h3>
                <p>${v.text}</p>
              </div>
            </div>`
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="work-title">
      <div class="shell">
        <div class="sec-head reveal">
          <div class="section-head">
            <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>How we work</p>
            <h2 class="section-title" id="work-title">A delivery process built on evidence, not assumptions.</h2>
            <p class="section-lead">Every engagement follows the same five stages. The depth changes with the project; the sequence does not.</p>
          </div>
        </div>
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

    <section class="section bg-sage" aria-labelledby="diff-title">
      <div class="shell split split--wide-right">
        <div class="reveal">
          <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>What it means in practice</p>
          <h2 class="section-title" id="diff-title">A partner, not a vendor.</h2>
          <p class="section-lead" style="margin-bottom:1.8rem">We stay involved after launch, because healthcare software is judged by how it behaves in month six, not in the demo.</p>
          ${btn({ href: '/contact/', label: 'Start a Conversation' })}
        </div>
        <div class="reveal">
          ${differentiators
            .map(
              (d) => `<div class="diff-item">
              <span class="diff-icon">${icon(d.icon)}</span>
              <div><h3>${d.title}</h3><p>${d.text}</p></div>
            </div>`
            )
            .join('')}
        </div>
      </div>
    </section>

    ${ctaBanner()}
  `;

  return doc({
    title: 'About ITmedicus | Healthcare Technology Company',
    description:
      'ITmedicus is a healthcare technology company building digital applications, professional software and services for the healthcare and pharmaceutical ecosystem.',
    path: '/about/',
    body,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About ITmedicus',
      url: 'https://itmedicus.com/about/',
      mainEntity: { '@type': 'Organization', name: site.name, foundingDate: String(site.founded) },
    },
  });
}
