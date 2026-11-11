import { products, site, stores } from '../content.mjs';
import {
  icon,
  btn,
  breadcrumbs,
  ctaBanner,
  disclaimer,
  CLINICAL_DISCLAIMER,
  doc,
  productCard,
  productMark,
  monogram,
} from '../layout.mjs';

function relatedFor(product) {
  return products.filter((p) => p.slug !== product.slug && p.audiences.some((a) => product.audiences.includes(a))).slice(0, 3);
}

export function productPage(product) {
  const related = relatedFor(product);
  const accent = `--a1:${product.accent[0]};--a2:${product.accent[1]}`;
  // Store buttons are driven by the product's own platform list, so a product
  // never advertises a store it is not published on.
  const hasAndroid = product.platforms.includes('Android');
  const hasIOS = product.platforms.includes('iOS');
  const hasWindows = product.platforms.includes('Windows');

  const body = `
    <section class="pd-hero" style="${accent}">
      <div class="shell">
        ${breadcrumbs([{ label: 'Products', href: '/products/' }, { label: product.name }])}
        <div class="pd-hero-inner" style="margin-top:1.5rem">
          <div>
            <div class="pd-title">
              ${productMark(product, 'pd-appicon')}
              <div>
                <p class="pd-kicker">${product.kicker}</p>
                <h1>${product.name}</h1>
              </div>
            </div>
            <p class="pd-lead">${product.hero.intro}</p>
            <dl class="pd-meta">
              <div class="pd-meta-item">
                <dt class="pd-meta-k">Built for</dt>
                <dd class="pd-meta-v">${product.audienceLabel}</dd>
              </div>
              <div class="pd-meta-item">
                <dt class="pd-meta-k">Platforms</dt>
                <dd class="pd-meta-v">${product.platforms.join(' · ')}</dd>
              </div>
              <div class="pd-meta-item">
                <dt class="pd-meta-k">Category</dt>
                <dd class="pd-meta-v">${product.kicker}</dd>
              </div>
            </dl>
            <div class="pd-actions">
              ${
                hasAndroid
                  ? `<a class="btn btn--primary" href="${product.storeUrl || stores.googlePlay.href}" target="_blank" rel="noopener">
                ${icon('download', 'ico btn-ico')}Get the app
              </a>`
                  : ''
              }
              ${btn({ href: '/contact/', label: 'Contact product support', variant: 'secondary', iconName: 'mail' })}
            </div>
          </div>
          <div class="pd-visual">
            <div class="pd-visual-inner">
              <svg class="pd-arcs" viewBox="0 0 400 400" fill="none" aria-hidden="true">
                <circle cx="200" cy="200" r="92" stroke="rgba(255,255,255,.22)" stroke-dasharray="2 7"/>
                <circle cx="200" cy="200" r="140" stroke="rgba(255,255,255,.14)" stroke-dasharray="2 9"/>
                <circle cx="200" cy="200" r="190" stroke="rgba(255,255,255,.09)" stroke-dasharray="2 11"/>
                <path d="M40 250h48l16-38 20 70 18-44h52" stroke="rgba(255,255,255,.35)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="pd-logo-tile">
                ${
                  product.logo
                    ? `<img src="${product.logo}" alt="" width="320" height="320" decoding="async">`
                    : `<span class="pd-tile-mono" aria-hidden="true">${monogram(product.name)}</span>`
                }
              </span>
              <div class="pd-visual-foot">
                <span class="pd-vf-name">${product.name}</span>
                <span class="pd-vf-meta">${product.kicker}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="detail-title">
      <div class="shell pd-layout">
        <div>
          <h2 id="detail-title" class="sr-only">${product.name} in detail</h2>

          <div class="pd-section">
            <h2>Who it is for</h2>
            <ul class="check-list">
              ${product.forWhom
                .map((w) => `<li>${icon('check')}<span>${w}</span></li>`)
                .join('')}
            </ul>
          </div>

          <div class="pd-section">
            <h2>What it helps you do</h2>
            <div class="benefit-grid">
              ${product.benefits
                .map(
                  (b, i) => `<div class="benefit">
                  <span class="benefit-num">${String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>${b.title}</h3>
                    <p>${b.text}</p>
                  </div>
                </div>`
                )
                .join('')}
            </div>
          </div>

          <div class="pd-section">
            <h2>Key features</h2>
            <ul class="check-list">
              ${product.features
                .map((f) => `<li>${icon('check')}<span>${f}</span></li>`)
                .join('')}
            </ul>
            <p class="grid-note">Features listed reflect the current published description of the product. Availability can differ by platform and release version.</p>
          </div>

          ${
            product.pricing
              ? `<div class="pd-section" id="plans">
            <h2>Free and premium</h2>
            <p class="plan-summary">${product.pricing.summary}</p>
            <div class="plan-grid">
              <div class="plan plan--free">
                <p class="plan-tag">${icon('check')}Free to use</p>
                <ul class="plan-list">
                  ${product.pricing.free.map((f) => `<li>${icon('check')}<span>${f}</span></li>`).join('')}
                </ul>
              </div>
              <div class="plan plan--premium">
                <p class="plan-tag">Premium adds</p>
                <ul class="plan-list">
                  ${product.pricing.premium.map((f) => `<li>${icon('plus')}<span>${f}</span></li>`).join('')}
                </ul>
              </div>
            </div>
            <p class="grid-note">${product.pricing.note}</p>
          </div>`
              : ''
          }

          <div class="pd-section">
            <h2>Platforms</h2>
            <div class="tag-row">
              ${product.platforms.map((p) => `<span class="tag">${p}</span>`).join('')}
            </div>
            <div class="platform-links">
              ${
                hasAndroid
                  ? `<a href="${product.storeUrl || stores.googlePlay.href}" target="_blank" rel="noopener">${icon('external')}Google Play listing</a>`
                  : ''
              }
              ${
                hasWindows
                  ? `<a href="${stores.microsoft.href}" target="_blank" rel="noopener">${icon('external')}Microsoft Store profile</a>`
                  : ''
              }
              ${
                hasIOS
                  ? `<span class="platform-note">App Store listing link available from the product team</span>`
                  : ''
              }
            </div>
          </div>

          <div class="pd-section">
            <h2>Support</h2>
            <p style="font-size:.95rem;line-height:1.7;color:var(--body);margin-bottom:1.2rem">
              For help with ${product.name}, include the platform, app version and a short description of the issue. Most support questions are answered by email.
            </p>
            <ul class="side-list" style="max-width:26rem">
              <li><span class="side-k">Support email</span><a class="side-v" href="mailto:${site.supportEmail}">${site.supportEmail}</a></li>
              <li><span class="side-k">Telephone</span><a class="side-v" href="tel:${site.phoneHref}">${site.phone}</a></li>
              <li><span class="side-k">Privacy</span><a class="side-v" href="/privacy/">Privacy policy</a></li>
            </ul>
          </div>

          ${
            product.clinical
              ? `<div class="pd-section">
            <h2>Important notice</h2>
            ${disclaimer(CLINICAL_DISCLAIMER)}
          </div>`
              : `<div class="pd-section">
            <h2>Important notice</h2>
            ${disclaimer(
              'Information on this page is provided for general understanding of the product. It is not medical advice. If you have a health concern, consult a qualified healthcare professional.'
            )}
          </div>`
          }
        </div>

        <aside class="pd-side" aria-label="Product summary">
          <div class="side-card">
            <p class="side-title">At a glance</p>
            <ul class="side-list">
              <li><span class="side-k">Product</span><span class="side-v">${product.name}</span></li>
              <li><span class="side-k">Category</span><span class="side-v">${product.kicker}</span></li>
              <li><span class="side-k">Audience</span><span class="side-v">${product.audienceLabel}</span></li>
              <li><span class="side-k">Platforms</span><span class="side-v">${product.platforms.join(', ')}</span></li>
              ${
                product.pricing
                  ? `<li><span class="side-k">Plans</span><span class="side-v">Free · Premium optional</span></li>`
                  : ''
              }
              <li><span class="side-k">Vendor</span><span class="side-v">${site.name}</span></li>
            </ul>
          </div>

          <div class="side-card side-card--dark side-cta">
            <p class="side-title">Enquiries</p>
            <h3>Interested in ${product.name}?</h3>
            <p>Ask about availability, deployment within your organisation, or a support arrangement.</p>
            ${btn({ href: '/contact/', label: 'Contact us', variant: 'ghost-light', cls: 'btn--block' })}
            <div class="side-links">
              <a href="mailto:${site.email}">${icon('mail')}${site.email}</a>
              <a href="tel:${site.phoneHref}">${icon('phone-call')}${site.phone}</a>
            </div>
          </div>
        </aside>
      </div>
    </section>

    ${
      related.length
        ? `<section class="section bg-bone" aria-labelledby="related-title">
      <div class="shell">
        <div class="sec-head reveal">
          <div class="section-head">
            <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>Related products</p>
            <h2 class="section-title" id="related-title">More from the ${site.name} portfolio.</h2>
          </div>
          <a class="link-underline sec-head-link" href="/products/">All products ${icon('arrow-right', 'ico')}</a>
        </div>
        <ul class="product-grid">
          ${related.map((p, i) => productCard(p, i)).join('')}
        </ul>
      </div>
    </section>`
        : ''
    }

    ${ctaBanner({
      title: `Have a question about ${product.name}?`,
      text: 'Send us a message and our team will route it to the right product contact.',
      primary: { href: '/contact/', label: 'Start a Conversation' },
      secondary: { href: '/products/', label: 'Back to products' },
    })}
  `;

  return doc({
    title: product.seo.title,
    description: product.seo.description,
    path: `/products/${product.slug}/`,
    body,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: product.name,
      description: product.summary,
      applicationCategory: 'HealthApplication',
      operatingSystem: product.platforms.join(', '),
      url: `https://itmedicus.com/products/${product.slug}/`,
      publisher: { '@type': 'Organization', name: site.name },
      ...(product.logo ? { image: `https://itmedicus.com${product.logo}` } : {}),
      ...(product.pricing
        ? {
            isAccessibleForFree: true,
            offers: [
              {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'BDT',
                description: 'Core features are free to use',
              },
              {
                '@type': 'Offer',
                description: 'Optional premium plan, available inside the app',
              },
            ],
          }
        : {}),
    },
  });
}
