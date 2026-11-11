import {
  site,
  products,
  services,
  industries,
  insights,
  proofPoints,
  differentiators,
  stores,
} from '../content.mjs';
import {
  icon,
  btn,
  sectionHead,
  productCard,
  serviceCard,
  ctaBanner,
  doc,
} from '../layout.mjs';

/* Illustrative interface composition for the hero.
   Decorative: hidden from assistive technology, and labelled as a preview. */
function heroVisual() {
  const rows = [
    { name: 'Amlodipine 5 mg', sub: 'Tablet · Calcium channel blocker', chip: 'CCB', hi: true, ava: 'A' },
    { name: 'Metformin 500 mg', sub: 'Tablet · Biguanide', chip: 'Endo', ava: 'M' },
    { name: 'Omeprazole 20 mg', sub: 'Capsule · Proton pump inhibitor', chip: 'GI', ava: 'O' },
    { name: 'Ceftriaxone 1 g', sub: 'Injection · Cephalosporin', chip: 'Abx', ava: 'C' },
  ];

  return `<div class="hero-visual" aria-hidden="true">
      <div class="hv-arc">
        <svg viewBox="0 0 500 500" fill="none">
          <circle cx="330" cy="240" r="150" stroke="#2e6b55" stroke-opacity=".18" stroke-dasharray="2 6"/>
          <circle cx="330" cy="240" r="215" stroke="#123a2f" stroke-opacity=".12" stroke-dasharray="2 8"/>
          <path d="M60 330 C 130 330, 140 250, 200 250 S 280 330, 360 330" stroke="#2e6b55" stroke-opacity=".22" stroke-width="1.5"/>
        </svg>
      </div>

      <div class="hv-card hv-desktop">
        <div class="mock">
          <div class="mock-bar">
            <span class="mock-dot"></span><span class="mock-dot"></span><span class="mock-dot mock-dot--live"></span>
            <span class="mock-bar-title">DIMS</span>
            <span class="mock-pill">Offline ready</span>
          </div>
          <div class="mock-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>
            <span>amlodipine</span><span class="mock-caret"></span>
          </div>
          <div class="mock-rows">
            ${rows
              .map(
                (r) => `<div class="mock-row${r.hi ? ' mock-row--hi' : ''}">
                <span class="mock-ava">${r.ava}</span>
                <span class="mock-rowmain">
                  <span class="mock-name">${r.name}</span>
                  <span class="mock-sub">${r.sub}</span>
                </span>
                <span class="mock-chip">${r.chip}</span>
              </div>`
              )
              .join('')}
          </div>
        </div>
      </div>

      <div class="hv-card hv-phone">
        <div class="phone-notch"></div>
        <div class="phone-screen">
          <div class="phone-head">
            <p class="phone-head-k">DIMS · Medicine</p>
            <p class="phone-head-t">Amlodipine 5 mg</p>
          </div>
          <div class="phone-body">
            <div class="phone-tile phone-tile--clay"><b>Indications</b><span>Hypertension · angina</span></div>
            <div class="phone-tile"><b>Dosage</b><span>5 mg once daily</span></div>
            <div class="phone-tile"><b>Class</b><span>Calcium channel blocker</span></div>
            <div class="phone-meta">
              <span>Tablet</span><span>5 mg</span><span>Generic</span>
            </div>
          </div>
        </div>
      </div>

      <span class="hv-chip hv-chip--a">${icon('check')}Since 2011</span>
      <span class="hv-chip hv-chip--b">${icon('layers')}Android · iOS · Web · Windows</span>

      <p class="hv-caption">Illustrative interface preview — DIMS</p>
    </div>`;
}

/* Animated nodes over the hero artwork — decorative, never announced. */
function heroNodes() {
  const dots = [
    [118, 96, 2.6, 0.0], [246, 210, 2.0, -1.1], [372, 118, 3.2, -2.2],
    [520, 268, 2.2, -0.6], [664, 92, 2.4, -3.1], [812, 232, 3.0, -1.7],
    [1046, 120, 2.6, -2.6], [1188, 292, 2.2, -0.9], [1310, 154, 3.0, -3.6],
    [210, 392, 2.4, -1.4], [402, 470, 2.0, -2.8], [702, 430, 2.6, -0.4],
    [980, 470, 2.2, -2.0], [1236, 486, 2.8, -1.2], [86, 548, 2.2, -3.4],
  ];

  return `<div class="hero-nodes" aria-hidden="true">
      <svg viewBox="0 0 1440 640" preserveAspectRatio="xMidYMid slice" focusable="false">
        ${dots
          .map(
            ([cx, cy, r, delay], i) => `<g class="hn-drift hn-drift--${(i % 3) + 1}">
          <circle class="hn" cx="${cx}" cy="${cy}" r="${r}" style="animation-delay:${delay}s"/>
          <circle class="hn-halo" cx="${cx}" cy="${cy}" r="${r * 3.4}" style="animation-delay:${delay}s"/>
        </g>`
          )
          .join('')}
      </svg>
    </div>`;
}

function hero() {
  return `<section class="hero" aria-labelledby="hero-title">
      ${heroNodes()}
      <div class="shell hero-inner">
        <div class="hero-copy">
          <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>Healthcare technology · Digital innovation</p>
          <h1 id="hero-title">Building digital solutions for <span class="accent">better healthcare.</span></h1>
          <p class="hero-lead">${site.name} develops healthcare applications, professional software and digital solutions that help connect medical knowledge, healthcare professionals, pharmaceutical organisations and the people they serve.</p>
          <div class="hero-actions">
            ${btn({ href: '/products/', label: 'Explore Our Products' })}
            ${btn({ href: '/contact/', label: 'Discuss Your Project', variant: 'secondary', iconName: 'arrow-up-right' })}
          </div>
          <ul class="hero-trust">
            <li>${icon('target')}Building for healthcare since ${site.founded}</li>
            <li>${icon('globe')}Dhaka, Bangladesh</li>
          </ul>
        </div>
        ${heroVisual()}
      </div>
    </section>`;
}

function proofStrip() {
  return `<section class="section section--tight" aria-labelledby="proof-title">
      <div class="shell">
        <div class="section-head reveal" style="margin-bottom:2.2rem">
          <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>Why teams work with us</p>
          <h2 class="section-title" id="proof-title" style="font-size:clamp(1.4rem,1.2rem + .8vw,1.85rem)">Technology built for the healthcare ecosystem.</h2>
        </div>
        <div class="proof-strip reveal">
          ${proofPoints
            .map((p) => {
              // "10M+" animates as 0 → 10 plus its suffix; "4.6" keeps one decimal.
              const parts = /^(\d+(?:\.\d+)?)(.*)$/.exec(p.value);
              const numeric = parts ? parts[1] : '';
              const suffix = parts ? parts[2] : '';
              const decimals = numeric.includes('.') ? 1 : 0;
              const animatable = numeric.replace('.', '').length <= 2 ? numeric : '';

              return `<div class="proof-item">
              <p class="proof-value">
                <span class="sr-only">${p.value}</span>
                <span data-count="${animatable}" data-suffix="${suffix}" data-decimals="${decimals}" aria-hidden="true">${p.value}</span>
              </p>
              <p class="proof-label">${p.label}</p>
            </div>`;
            })
            .join('')}
        </div>
      </div>
    </section>`;
}

function aboutPreview() {
  return `<section class="section" aria-labelledby="about-preview-title">
      <div class="shell split">
        <div class="media-panel reveal">
          <div class="mp-lattice" aria-hidden="true"></div>
          <div class="mp-top">
            <span class="mp-badge">${icon('sparkle')}Since ${site.founded}</span>
            <p class="mp-quote">“Practical healthcare technology, designed around real-world needs.”</p>
          </div>
          <div class="mp-rows">
            <div class="mp-row"><span class="mp-k">Focus</span><span class="mp-v">Healthcare & pharmaceutical technology</span></div>
            <div class="mp-row"><span class="mp-k">Build</span><span class="mp-v">Mobile apps, web platforms, desktop software</span></div>
            <div class="mp-row"><span class="mp-k">Serves</span><span class="mp-v">Professionals, organisations and the public</span></div>
          </div>
        </div>
        <div class="reveal">
          ${sectionHead({
            kicker: 'About ITmedicus',
            title: 'Healthcare challenges need thoughtful technology.',
            lead: 'At ITmedicus, we believe technology can make healthcare information more accessible and professional workflows more efficient. We create digital products and software shaped by the needs of healthcare professionals, pharmaceutical organisations and everyday users.',
          })}
          <p style="font-size:1rem;line-height:1.72;margin-bottom:1.8rem">
            From medical reference applications to purpose-built business systems, our focus is on useful technology that solves real problems — supported long after the first release.
          </p>
          ${btn({ href: '/about/', label: 'Learn More About ITmedicus', variant: 'secondary' })}
        </div>
      </div>
    </section>`;
}

function featuredProducts() {
  const featured = products.filter((p) => p.featured);
  return `<section class="section bg-bone" aria-labelledby="products-title">
      <div class="shell">
        <div class="sec-head reveal">
          <div class="section-head">
            <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>Our products</p>
            <h2 class="section-title" id="products-title">Digital tools for every corner of healthcare.</h2>
            <p class="section-lead">Explore applications developed for different needs across healthcare — from medicine information and patient support to clinical guidance and professional workflows.</p>
          </div>
          <a class="link-underline sec-head-link" href="/products/">View all products ${icon('arrow-right', 'ico')}</a>
        </div>
        <ul class="product-grid">
          ${featured.map((p, i) => productCard(p, i)).join('')}
        </ul>
        <div class="section-foot">
          ${btn({ href: '/products/', label: 'Explore the full product directory', variant: 'secondary' })}
        </div>
      </div>
    </section>`;
}

function servicesSection() {
  return `<section class="section" aria-labelledby="services-title">
      <div class="shell">
        <div class="sec-head reveal">
          <div class="section-head">
            <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>Services</p>
            <h2 class="section-title" id="services-title">Technology and digital services for healthcare organisations.</h2>
            <p class="section-lead">From custom software to healthcare applications and pharmaceutical digital platforms, we help organisations turn operational needs into useful digital experiences.</p>
          </div>
          <a class="link-underline sec-head-link" href="/services/">Explore our services ${icon('arrow-right', 'ico')}</a>
        </div>
        <ul class="cols-3" style="gap:1.15rem">
          ${services.map((s, i) => serviceCard(s, i)).join('')}
        </ul>
      </div>
    </section>`;
}

function whySection() {
  return `<section class="section bg-sage" aria-labelledby="why-title">
      <div class="shell split split--wide-right">
        <div class="reveal">
          <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>Why ITmedicus</p>
          <h2 class="section-title" id="why-title">A healthcare-focused technology partner.</h2>
          <p class="section-lead" style="margin-bottom:1.8rem">We combine an understanding of clinical and commercial workflows with the engineering discipline to ship software that holds up in daily use.</p>
          ${btn({ href: '/about/', label: 'How we work', variant: 'secondary' })}
        </div>
        <div class="reveal">
          ${differentiators
            .map(
              (d) => `<div class="diff-item">
              <span class="diff-icon">${icon(d.icon)}</span>
              <div>
                <h3>${d.title}</h3>
                <p>${d.text}</p>
              </div>
            </div>`
            )
            .join('')}
        </div>
      </div>
    </section>`;
}

function industriesSection() {
  return `<section class="section" aria-labelledby="industries-title">
      <div class="shell">
        <div class="sec-head reveal">
          <div class="section-head">
            <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>Industries</p>
            <h2 class="section-title" id="industries-title">Supporting the people and organisations behind healthcare.</h2>
            <p class="section-lead">Different audiences need different tools. Find the products and services built for yours.</p>
          </div>
          <a class="link-underline sec-head-link" href="/industries/">See industries ${icon('arrow-right', 'ico')}</a>
        </div>
        <div class="industry-grid">
          ${industries
            .map(
              (ind) => `<a class="industry-tile reveal" href="/industries/#${ind.slug}">
              ${icon('arrow-up-right', 'ico it-arrow')}
              <span class="it-icon">${icon(ind.icon)}</span>
              <h3>${ind.name}</h3>
              <p>${ind.summary}</p>
            </a>`
            )
            .join('')}
        </div>
      </div>
    </section>`;
}

function insightsSection() {
  return `<section class="section bg-bone" aria-labelledby="insights-title">
      <div class="shell">
        <div class="sec-head reveal">
          <div class="section-head">
            <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>Insights</p>
            <h2 class="section-title" id="insights-title">Ideas, updates and developments from ITmedicus.</h2>
            <p class="section-lead">Discover product announcements, feature updates, healthcare technology perspectives, company news and stories from our work.</p>
          </div>
          <a class="link-underline sec-head-link" href="/insights/">Visit Insights ${icon('arrow-right', 'ico')}</a>
        </div>
        <div class="post-grid">
          ${insights
            .slice(0, 3)
            .map(
              (a, i) => `<article class="insight-card reveal" style="--i:${i}">
              <div class="ic-meta">
                <span class="ic-tag">${a.category}</span>
                <time datetime="${a.date}">${new Date(a.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</time>
              </div>
              <h3 class="ic-title"><a href="/insights/${a.slug}/">${a.title}</a></h3>
              <p class="ic-excerpt">${a.excerpt}</p>
              <div class="ic-foot">
                <span>${a.readTime}</span>
                ${icon('arrow-right')}
              </div>
            </article>`
            )
            .join('')}
        </div>
      </div>
    </section>`;
}

function storeStrip() {
  return `<section class="section section--tight" aria-labelledby="store-title">
      <div class="shell">
        <div class="store-strip reveal">
          <div>
            <p class="kicker" style="margin-bottom:.7rem"><span class="kicker-rule" aria-hidden="true"></span>Get the apps</p>
            <h2 id="store-title" style="font-size:clamp(1.35rem,1.15rem + .8vw,1.75rem);margin-bottom:.5rem">Our applications are published on the major app stores.</h2>
            <p style="font-size:.94rem;color:var(--body);max-width:52ch">Each product page lists the platforms currently supported. Direct store listings are linked from the product pages where available.</p>
          </div>
          <div class="store-links">
            <a class="store-btn" href="${stores.googlePlay.href}" target="_blank" rel="noopener">
              ${icon('download')}
              <span><small>Available on</small>Google Play</span>
            </a>
            <a class="store-btn" href="${stores.microsoft.href}" target="_blank" rel="noopener">
              ${icon('download')}
              <span><small>Available on</small>Microsoft Store</span>
            </a>
          </div>
        </div>
      </div>
    </section>`;
}

export function homePage() {
  const body = [
    hero(),
    proofStrip(),
    aboutPreview(),
    featuredProducts(),
    servicesSection(),
    whySection(),
    industriesSection(),
    insightsSection(),
    storeStrip(),
    ctaBanner(),
  ].join('\n');

  return doc({
    title: 'ITmedicus | Healthcare Technology & Digital Solutions',
    description:
      'ITmedicus builds healthcare apps, professional software and digital platforms for doctors, pharmaceutical organisations and the public.',
    path: '/',
    body,
    bodyClass: 'page-home',
  });
}
