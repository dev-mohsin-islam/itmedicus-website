import { site, social, stores } from '../content.mjs';
import { icon, btn, breadcrumbs, doc } from '../layout.mjs';

const supportFaqs = [
  {
    q: 'How do I get support for one of your apps?',
    a: 'Email us with the product name, the platform (Android, iOS, Windows or web), the app version and a short description of the issue. Messages sent to the product support address are routed to the team responsible for that app.',
  },
  {
    q: 'Are the ITmedicus apps free?',
    a: 'The core features of DIMS, PDM and Patient Aid are free to use. Those three apps also offer an optional premium plan that adds clinical content, guidelines, laboratory reference values or daily data updates. Premium is never required to use the basic reference.',
  },
  {
    q: 'Do you work with clients outside Bangladesh?',
    a: 'Yes. We are based in Dhaka and provide on-site support in Bangladesh, but software development, maintenance and support are delivered remotely to clients worldwide.',
  },
  {
    q: 'Can you maintain software that another company built?',
    a: 'Yes, under an agreed maintenance contract. We start with a review of the codebase, hosting and dependencies so the scope and the support level are understood before work begins.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: supportFaqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export function contactPage() {
  const body = `
    <section class="page-hero">
      <div class="shell">
        ${breadcrumbs([{ label: 'Contact' }])}
        <div class="page-hero-inner" style="margin-top:1.6rem">
          <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>Contact</p>
          <h1>Let’s talk about your next healthcare technology project.</h1>
          <p class="page-hero-lead">Whether you are exploring a software project, need product information or want to discuss a partnership, send us a message. Our team will direct your enquiry to the appropriate contact.</p>
        </div>
      </div>
    </section>

    <div class="shell contact-layout">
      <div class="form-card">
        <h2>Send us a message</h2>
        <p>Fields marked with a requirement must be completed. We reply to business enquiries by email, usually within a few working days.</p>

        <form class="form" data-contact-form novalidate
          action="mailto:info@itmedicus.com?subject=Website%20enquiry" method="post" enctype="text/plain">
          <div class="form-row">
            <div class="field">
              <label for="name">Full name <span class="req">*</span></label>
              <input class="input" type="text" id="name" name="name" autocomplete="name" required aria-describedby="name-error">
              <span class="field-error" id="name-error">This field is required.</span>
            </div>
            <div class="field">
              <label for="email">Work email <span class="req">*</span></label>
              <input class="input" type="email" id="email" name="email" autocomplete="email" required aria-describedby="email-error" placeholder="name@company.com">
              <span class="field-error" id="email-error">Please enter a valid email address.</span>
            </div>
          </div>

          <div class="form-row">
            <div class="field">
              <label for="organisation">Organisation / designation <span class="opt">optional</span></label>
              <input class="input" type="text" id="organisation" name="organisation" autocomplete="organization">
            </div>
            <div class="field">
              <label for="phone">Phone number <span class="opt">optional</span></label>
              <input class="input" type="tel" id="phone" name="phone" autocomplete="tel" inputmode="tel" placeholder="+880 1XXX-XXXXXX">
            </div>
          </div>

          <div class="form-row">
            <div class="field">
              <label for="enquiryType">Enquiry type</label>
              <select class="select" id="enquiryType" name="enquiryType">
                <option value="Business enquiry">Business enquiry</option>
                <option value="Product support">Product support</option>
                <option value="Partnership">Partnership</option>
                <option value="Career">Career</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="field">
              <label for="subject">Subject</label>
              <input class="input" type="text" id="subject" name="subject" placeholder="A short summary of your enquiry">
            </div>
          </div>

          <div class="field">
            <label for="message">Message <span class="req">*</span></label>
            <textarea class="textarea" id="message" name="message" required aria-describedby="message-error" placeholder="Describe what you need, who it is for, and any timeline or platform constraints."></textarea>
            <span class="field-error" id="message-error">This field is required.</span>
          </div>

          <div class="field">
            <label class="check" for="consent">
              <input type="checkbox" id="consent" name="consent" required aria-describedby="consent-error">
              <span>I agree that ${site.name} may use the details I have provided to respond to this enquiry, in line with the <a href="/privacy/">Privacy Policy</a>. <span class="req">*</span></span>
            </label>
            <span class="field-error" id="consent-error">Please accept the privacy notice to continue.</span>
          </div>

          <div class="form-status" data-form-status></div>

          <div>
            <button class="btn btn--primary btn--lg" type="submit">
              Send message
              ${icon('arrow-right', 'ico btn-ico')}
            </button>
          </div>

          <noscript>
            <p class="form-note" style="margin-bottom:1rem">
              JavaScript is disabled in this browser, so the form cannot validate your details.
              You can still send this message directly to
              <a href="mailto:info@itmedicus.com">info@itmedicus.com</a> or call
              <a href="tel:+8801856250187">+880 1856-250187</a>.
            </p>
          </noscript>

          <p class="form-note">This site is protected against automated submissions. Please do not send patient-identifiable information or clinical records through this form — contact us first and we will arrange a secure channel.</p>
        </form>
      </div>

      <aside class="contact-side" aria-label="Contact details">
        <div class="contact-block">
          <h3><span class="cb-icon">${icon('mail')}</span>Email us</h3>
          <ul>
            <li><a href="mailto:${site.email}">${site.email}</a><br><span style="font-size:.82rem;color:var(--muted)">General and business enquiries</span></li>
            <li><a href="mailto:${site.supportEmail}?subject=Product%20support">Open a product support request ${icon('external')}</a><br><span style="font-size:.82rem;color:var(--muted)">Include the product name, platform and app version</span></li>
          </ul>
        </div>

        <div class="contact-block">
          <h3><span class="cb-icon">${icon('phone-call')}</span>Call us</h3>
          <p style="margin-bottom:.7rem"><a href="tel:${site.phoneHref}" style="font-size:1.02rem;font-weight:600">${site.phone}</a></p>
          <div class="hours"><span>Sunday – Thursday</span><span>10:00 – 18:00</span></div>
          <div class="hours"><span>Friday – Saturday</span><span>Closed</span></div>
        </div>

        <div class="contact-block">
          <h3><span class="cb-icon">${icon('pin')}</span>Office</h3>
          <address>
            ${site.address.line1}<br>
            ${site.address.line2}<br>
            ${site.address.city}, ${site.address.country}
          </address>
        </div>

        <div class="contact-block">
          <h3><span class="cb-icon">${icon('layers')}</span>Product support</h3>
          <ul>
            <li><a href="/products/">Product directory</a></li>
            <li><a href="${stores.googlePlay.href}" target="_blank" rel="noopener">Google Play listings ${icon('external')}</a></li>
            <li><a href="${stores.microsoft.href}" target="_blank" rel="noopener">Microsoft Store profile ${icon('external')}</a></li>
          </ul>
        </div>

        <div class="contact-block">
          <h3><span class="cb-icon">${icon('globe')}</span>Follow ${site.name}</h3>
          <ul>
            ${social
              .map(
                (s) =>
                  `<li><a href="${s.href}" target="_blank" rel="noopener">${s.label} ${icon('external')}</a></li>`
              )
              .join('')}
          </ul>
        </div>
      </aside>
    </div>

    <section class="section" aria-labelledby="support-faq-title">
      <div class="shell split">
        <div class="reveal">
          <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>Before you write</p>
          <h2 class="section-title" id="support-faq-title">Support questions we answer most.</h2>
          <p class="section-lead">Four questions that come up often. Anything else, use the form above or email us directly — a person reads every message.</p>
        </div>
        <div class="reveal">
          ${supportFaqs
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

    <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>

    <section class="section bg-bone">
      <div class="shell">
        <div class="contact-map reveal">
          <div class="cm-copy">
            <p class="kicker" style="margin-bottom:.6rem"><span class="kicker-rule" aria-hidden="true"></span>Finding us</p>
            <h2 style="font-size:clamp(1.35rem,1.15rem + .8vw,1.75rem);margin-bottom:.6rem">Demra, Dhaka.</h2>
            <p style="font-size:.94rem;line-height:1.68;color:var(--body);max-width:46ch">Our office is in Eastern Housing, Basherpul. If you are visiting, please arrange an appointment by email first so the right people are available.</p>
            ${btn({ href: `mailto:${site.email}?subject=Visit%20request`, label: 'Arrange a visit', variant: 'secondary' })}
          </div>
          <div class="cm-grid" aria-hidden="true">
            <svg viewBox="0 0 320 220" fill="none">
              <defs>
                <pattern id="mapdots" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="1.5" cy="1.5" r="1.2" fill="rgba(18, 58, 47,.16)"/>
                </pattern>
              </defs>
              <rect width="320" height="220" fill="url(#mapdots)"/>
              <path d="M0 150 L90 150 L110 122 L210 122 L230 150 L320 150" stroke="#d3c9b6" stroke-width="7" stroke-linejoin="round"/>
              <path d="M0 150 L90 150 L110 122 L210 122 L230 150 L320 150" stroke="#fff" stroke-width="3" stroke-dasharray="10 8"/>
              <path d="M150 0 L150 220" stroke="#d3c9b6" stroke-width="5"/>
              <path d="M150 0 L150 220" stroke="#fff" stroke-width="2" stroke-dasharray="8 9"/>
              <circle cx="160" cy="118" r="26" fill="#2e6b55" fill-opacity=".12"/>
              <circle cx="160" cy="118" r="9" fill="#2e6b55"/>
              <circle cx="160" cy="118" r="3" fill="#fff"/>
              <rect x="196" y="76" width="86" height="26" rx="13" fill="#fff" stroke="#e3dccd"/>
              <text x="239" y="93" text-anchor="middle" font-family="Public Sans, sans-serif" font-size="10" font-weight="700" fill="#123a2f">Basherpul</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  `;

  return doc({
    title: 'Contact ITmedicus | Healthcare Technology Solutions',
    description:
      'Contact ITmedicus about healthcare software projects, product information, partnerships or support. Email info@itmedicus.com or send a message through the enquiry form.',
    path: '/contact/',
    body,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact ITmedicus',
      url: 'https://itmedicus.com/contact/',
      mainEntity: {
        '@type': 'Organization',
        name: site.name,
        email: site.email,
        telephone: site.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: site.address.line1 + ', ' + site.address.line2,
          addressLocality: site.address.city,
          addressCountry: 'BD',
        },
      },
    },
  });
}
