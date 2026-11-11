import { insights, insightCategories } from '../content.mjs';
import { icon, btn, breadcrumbs, ctaBanner, doc } from '../layout.mjs';

const dateFmt = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export function insightsPage() {
  const [featured, ...rest] = insights;

  const body = `
    <section class="page-hero">
      <div class="shell">
        ${breadcrumbs([{ label: 'Insights' }])}
        <div class="page-hero-inner" style="margin-top:1.6rem">
          <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>Insights</p>
          <h1>Insights from healthcare technology.</h1>
          <p class="page-hero-lead">Read product updates, company announcements and practical perspectives on digital healthcare, medical software and pharmaceutical technology.</p>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="latest-title">
      <div class="shell">
        <h2 id="latest-title" class="sr-only">Latest insights</h2>

        <article class="featured-post reveal">
          <div class="fp-visual" aria-hidden="true">
            <svg viewBox="0 0 400 400" fill="none">
              <circle cx="200" cy="200" r="70" stroke="#8cc5a9" stroke-opacity=".35" stroke-dasharray="2 7"/>
              <circle cx="200" cy="200" r="120" stroke="#8cc5a9" stroke-opacity=".18" stroke-dasharray="2 9"/>
              <circle cx="200" cy="200" r="170" stroke="#8cc5a9" stroke-opacity=".1" stroke-dasharray="2 11"/>
              <path d="M60 240h60l18-46 24 84 20-52h58" stroke="#8cc5a9" stroke-opacity=".55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="200" cy="200" r="4" fill="#c4703a"/>
            </svg>
            <span class="fp-visual-label">${featured.category}</span>
          </div>
          <div class="fp-body">
            <div class="ic-meta">
              <span class="ic-tag">Featured</span>
              <time datetime="${featured.date}">${dateFmt(featured.date)}</time>
              <span>·</span>
              <span>${featured.readTime}</span>
            </div>
            <h2><a href="/insights/${featured.slug}/">${featured.title}</a></h2>
            <p>${featured.excerpt}</p>
            <div>
              ${btn({ href: `/insights/${featured.slug}/`, label: 'Read the article' })}
            </div>
          </div>
        </article>

        <div class="post-grid">
          ${rest
            .map(
              (a, i) => `<article class="insight-card reveal" style="--i:${i}">
              <div class="ic-meta">
                <span class="ic-tag">${a.category}</span>
                <time datetime="${a.date}">${dateFmt(a.date)}</time>
              </div>
              <h2 class="ic-title" style="font-size:1.1rem"><a href="/insights/${a.slug}/">${a.title}</a></h2>
              <p class="ic-excerpt">${a.excerpt}</p>
              <div class="ic-foot">
                <span>${a.readTime}</span>
                ${icon('arrow-right')}
              </div>
            </article>`
            )
            .join('')}
        </div>

        <div class="topic-row reveal">
          <p class="topic-label">Topics we write about</p>
          <ul class="tag-row">
            ${insightCategories
              .filter((c) => c !== 'All')
              .map((c) => `<li class="tag">${c}</li>`)
              .join('')}
          </ul>
        </div>
      </div>
    </section>

    <section class="section bg-bone">
      <div class="shell">
        <div class="subscribe-band reveal">
          <div>
            <p class="kicker" style="margin-bottom:.6rem"><span class="kicker-rule" aria-hidden="true"></span>Stay informed</p>
            <h2 style="font-size:clamp(1.35rem,1.15rem + .8vw,1.75rem);margin-bottom:.5rem">Product updates, without the noise.</h2>
            <p style="font-size:.94rem;color:var(--body);max-width:52ch">Announcements and release notes are published here first. To be told about a specific product, contact us and ask to be added to its update list.</p>
          </div>
          <div class="subscribe-actions">
            ${btn({ href: '/contact/', label: 'Request product updates' })}
            ${btn({ href: '/products/', label: 'Browse products', variant: 'secondary', iconName: 'arrow-up-right' })}
          </div>
        </div>
      </div>
    </section>
  `;

  return doc({
    title: 'Insights, Product Updates & Healthcare Technology Articles | ITmedicus',
    description:
      'Product updates, company announcements and practical perspectives on digital healthcare, medical software and pharmaceutical technology from ITmedicus.',
    path: '/insights/',
    body,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'ITmedicus Insights',
      url: 'https://itmedicus.com/insights/',
      blogPost: insights.map((a) => ({
        '@type': 'BlogPosting',
        headline: a.title,
        datePublished: a.date,
        url: `https://itmedicus.com/insights/${a.slug}/`,
      })),
    },
  });
}

/* ------------------------------------------------------------------ article */

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);

export function articlePage(article) {
  const headings = article.body.filter((b) => b.type === 'h2').map((b) => ({ id: slugify(b.text), text: b.text }));
  const related = insights.filter((a) => a.slug !== article.slug).slice(0, 2);
  const wordCount = article.body
    .map((b) => b.text || (b.items ? b.items.join(' ') : ''))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;

  const body = `
    <section class="article-head">
      <div class="shell">
        ${breadcrumbs([
          { label: 'Insights', href: '/insights/' },
          { label: article.title.length > 54 ? article.title.slice(0, 54).trimEnd() + '…' : article.title },
        ])}
        <div style="margin-top:1.5rem">
          <div class="ic-meta" style="margin-bottom:1rem">
            <span class="ic-tag">${article.category}</span>
            <time datetime="${article.date}">${dateFmt(article.date)}</time>
            <span>·</span>
            <span>${article.readTime}</span>
          </div>
          <h1>${article.title}</h1>
          <div class="article-meta">
            <span>${article.author}</span>
            <span class="sep" aria-hidden="true"></span>
            <span>${wordCount} words</span>
            <span class="sep" aria-hidden="true"></span>
            <span>${article.category}</span>
          </div>
        </div>
      </div>
    </section>

    <div class="shell article-layout">
      <article class="prose">
        ${article.body
          .map((block) => {
            if (block.type === 'h2') return `<h2 id="${slugify(block.text)}">${block.text}</h2>`;
            if (block.type === 'h3') return `<h3>${block.text}</h3>`;
            if (block.type === 'quote') return `<blockquote>${block.text}</blockquote>`;
            if (block.type === 'ul')
              return `<ul>${block.items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
            return `<p>${block.text}</p>`;
          })
          .join('')}

        <div class="share-row">
          <span>Share</span>
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://itmedicus.com/insights/${article.slug}/" target="_blank" rel="noopener">
            <svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM2.9 21h4.2V9.5H2.9zM9.4 9.5h4v1.6a4.4 4.4 0 0 1 3.9-2c4 0 4.7 2.5 4.7 5.8V21h-4.2v-5.4c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9V21H9.4z"/></svg>
            LinkedIn
          </a>
          <a href="mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent('https://itmedicus.com/insights/' + article.slug + '/')}">
            ${icon('mail')}Email
          </a>
        </div>

        <div class="author-box">
          <span class="author-ava">${article.author
            .split(' ')
            .map((w) => w[0])
            .slice(0, 2)
            .join('')}</span>
          <div>
            <p class="author-name">${article.author}</p>
            <p class="author-bio">${article.category} — written by the ITmedicus team. Views are general and do not constitute clinical or legal advice.</p>
          </div>
        </div>
      </article>

      <aside>
        ${
          headings.length
            ? `<div class="toc">
          <p>On this page</p>
          <ol>${headings.map((h) => `<li><a href="#${h.id}">${h.text}</a></li>`).join('')}</ol>
        </div>`
            : ''
        }

        <div class="side-card" style="margin-top:1rem">
          <p class="side-title">Products in this space</p>
          <ul class="side-links">
            <li><a href="/products/dims/">DIMS — medicine reference</a></li>
            <li><a href="/products/pdm/">PDM — diagnosis &amp; management</a></li>
            <li><a href="/products/patient-aid/">Patient Aid — for the public</a></li>
          </ul>
        </div>
      </aside>
    </div>

    <section class="section bg-bone">
      <div class="shell">
        <div class="sec-head reveal">
          <div class="section-head">
            <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>Keep reading</p>
            <h2 class="section-title">More from Insights</h2>
          </div>
          <a class="link-underline sec-head-link" href="/insights/">All insights ${icon('arrow-right', 'ico')}</a>
        </div>
        <div class="post-grid">
          ${related
            .map(
              (a, i) => `<article class="insight-card reveal" style="--i:${i}">
              <div class="ic-meta"><span class="ic-tag">${a.category}</span><time datetime="${a.date}">${dateFmt(a.date)}</time></div>
              <h3 class="ic-title"><a href="/insights/${a.slug}/">${a.title}</a></h3>
              <p class="ic-excerpt">${a.excerpt}</p>
              <div class="ic-foot"><span>${a.readTime}</span>${icon('arrow-right')}</div>
            </article>`
            )
            .join('')}
        </div>
      </div>
    </section>

    ${ctaBanner()}
  `;

  // Search results cut around 60 characters; keep the headline readable there.
  const shortTitle =
    article.title.length > 53
      ? article.title.slice(0, 53).replace(/\s+\S*$/, '') + '…'
      : article.title;
  const shortDesc =
    article.excerpt.length > 155
      ? article.excerpt.slice(0, 155).replace(/\s+\S*$/, '') + '…'
      : article.excerpt;

  return doc({
    title: `${shortTitle} | ITmedicus`,
    description: shortDesc,
    path: `/insights/${article.slug}/`,
    body,
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.excerpt,
      datePublished: article.date,
      author: { '@type': 'Organization', name: article.author },
      publisher: { '@type': 'Organization', name: 'ITmedicus' },
      mainEntityOfPage: `https://itmedicus.com/insights/${article.slug}/`,
    },
  });
}
