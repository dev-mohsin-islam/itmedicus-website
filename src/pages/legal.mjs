import { site } from '../content.mjs';
import { icon, breadcrumbs, doc } from '../layout.mjs';

const L = (t) => ({ type: 'h2', text: t });
const P = (t) => ({ type: 'p', text: t });
const UL = (items) => ({ type: 'ul', items });

export const policies = {
  privacy: {
    path: '/privacy/',
    title: 'Privacy Policy',
    updated: '10 November 2026',
    metaTitle: 'Privacy Policy | ITmedicus',
    metaDescription:
      'How ITmedicus collects, uses and protects information provided through this website and our applications.',
    intro:
      'This policy explains what information ITmedicus collects when you use this website or contact us, how that information is used, and the choices available to you.',
    sections: [
      L('Who we are'),
      P(`${site.name} develops healthcare applications, professional software and digital solutions. In this policy, “we”, “us” and “our” refer to ${site.name}. You can reach us at ${site.email}.`),
      L('Information we collect'),
      P('We collect information in three ways:'),
      UL([
        'Information you give us. When you complete the contact form or email us, we receive the name, email address, organisation, phone number, enquiry type and message you provide.',
        'Information collected automatically. Our web server and any analytics service we use may record technical information such as your IP address, browser type, device type, referring page and the pages you visit.',
        'Information from our applications. Some of our applications require an account. In those cases the application’s own privacy notice describes the data collected, and that notice governs the application rather than this website policy.',
      ]),
      L('How we use information'),
      UL([
        'To respond to enquiries and provide the information or support you request.',
        'To operate, maintain and improve this website and our products.',
        'To understand which pages and content are useful, in aggregate.',
        'To meet legal, regulatory and contractual obligations.',
        'To protect against misuse, fraud and automated abuse of our forms.',
      ]),
      P('We do not sell personal information. We do not use the details you submit through this website for unrelated marketing without your consent.'),
      L('Cookies and analytics'),
      P('This website uses only the cookies and similar storage needed to function. If we add an analytics service, it will be configured to minimise the data collected, and this policy will be updated to describe it before it is enabled. Where consent is required by applicable law, we will ask for it before setting non-essential cookies.'),
      L('Sharing information'),
      P('We share information only with service providers who help us operate the website and our business — for example hosting, email and support providers — and only to the extent needed to provide those services. We may also disclose information where required by law or to protect our legal rights.'),
      L('International transfers'),
      P('Some service providers may store data outside Bangladesh. Where that happens, we take reasonable steps to ensure the information receives an appropriate level of protection.'),
      L('Retention'),
      P('We keep enquiry records for as long as needed to handle the enquiry and for a reasonable period afterwards for reference, unless a longer period is required by law.'),
      L('Security'),
      P('We use technical and organisational measures intended to protect information against unauthorised access, alteration or loss. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.'),
      L('Your rights'),
      P('Subject to applicable law, you may ask us to confirm what personal information we hold about you, correct inaccurate information, delete information we no longer need, or object to certain processing. To make a request, email us. We may need to verify your identity before acting on it.'),
      L('Children'),
      P('This website is intended for organisations and adults. We do not knowingly collect personal information from children through this website.'),
      L('Medical information'),
      P('Content on this website and in our reference applications is informational and educational. It is not medical advice and does not create a clinician–patient relationship. Do not send confidential clinical or patient-identifiable information through the website contact form.'),
      L('Changes to this policy'),
      P('We may update this policy as our services change. The “last updated” date at the top of the page will change when we do.'),
      L('Contact'),
      P(`Questions about this policy can be sent to ${site.email}, or by post to ${site.address.line1}, ${site.address.line2}, ${site.address.city}, ${site.address.country}.`),
    ],
  },
  terms: {
    path: '/terms/',
    title: 'Terms of Use',
    updated: '10 November 2026',
    metaTitle: 'Terms of Use | ITmedicus',
    metaDescription:
      'The terms that govern use of the ITmedicus website and the information published on it.',
    intro:
      'These terms govern your use of this website. By using the site, you agree to them. If you do not agree, please do not use the site.',
    sections: [
      L('Use of this website'),
      P('You may view, download and print pages from this website for your own information and for legitimate business evaluation of our products and services. You may not reproduce, republish or redistribute substantial parts of the site for commercial purposes without our written permission.'),
      L('Product information'),
      P('Descriptions of products, features, platforms and availability are provided for general information. Products change, and availability can differ by platform, release and region. A description on this website is not a contractual commitment unless it is confirmed in a signed agreement with us.'),
      L('Medical disclaimer'),
      P('Content on this website and in our reference applications — including medicine information, clinical topics and educational material — is informational and educational only. It does not constitute medical advice, diagnosis or treatment, and it does not replace professional judgement, clinical training or official prescribing information. Never disregard professional medical advice, or delay seeking it, because of something you have read on this site or in one of our applications. In a medical emergency, contact local emergency services immediately.'),
      L('Intellectual property'),
      P(`The ${site.name} name, logo, product names, interface designs and site content are owned by us or our licensors and are protected by applicable intellectual property law. Third-party names and marks remain the property of their respective owners.`),
      L('Third-party links and app stores'),
      P('This website links to third-party services, including application stores and social platforms. Those services have their own terms and privacy policies, and we are not responsible for their content or practices. Downloads from an app store are also subject to that store’s terms.'),
      L('Acceptable use'),
      P('You agree not to interfere with the operation of this website, attempt to gain unauthorised access to any part of it, submit automated or abusive form submissions, or use the site in a way that infringes the rights of others.'),
      L('No warranty'),
      P('This website is provided on an “as is” and “as available” basis. To the extent permitted by law, we make no warranty that the site will be uninterrupted, error-free or free of harmful components, or that the information on it is complete, current or suitable for a particular purpose.'),
      L('Limitation of liability'),
      P('To the extent permitted by applicable law, we are not liable for any indirect or consequential loss arising from your use of this website or reliance on its content. Nothing in these terms limits liability that cannot lawfully be limited.'),
      L('Changes'),
      P('We may update these terms from time to time. Continued use of the website after a change means you accept the updated terms.'),
      L('Governing law'),
      P('These terms are governed by the laws of Bangladesh, and the courts of Bangladesh have jurisdiction over any dispute arising from them.'),
      L('Contact'),
      P(`Questions about these terms can be sent to ${site.email}.`),
    ],
  },
};

function render(policy) {
  const body = `
    <section class="page-hero">
      <div class="shell">
        ${breadcrumbs([{ label: policy.title }])}
        <div class="page-hero-inner" style="margin-top:1.6rem">
          <p class="kicker"><span class="kicker-rule" aria-hidden="true"></span>Legal</p>
          <h1>${policy.title}</h1>
          <p class="page-hero-lead">${policy.intro}</p>
          <p style="margin-top:1.2rem;font-size:.82rem;color:var(--muted)">Last updated: ${policy.updated}</p>
        </div>
      </div>
    </section>

    <div class="shell legal-layout">
      <nav class="legal-nav" aria-label="On this page">
        ${policy.sections
          .filter((s) => s.type === 'h2')
          .map(
            (s) =>
              `<a href="#${s.text
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')}">${s.text}</a>`
          )
          .join('')}
      </nav>
      <article class="prose">
        <div class="legal-note">
          ${icon('alert')}
          <p><strong>Draft for review.</strong> This document is a structured starting point prepared as part of the website build. It must be reviewed and approved by qualified legal counsel before publication, and updated to reflect the company’s confirmed legal entity, data-processing practices and app-store obligations.</p>
        </div>
        ${policy.sections
          .map((s) => {
            if (s.type === 'h2')
              return `<h2 id="${s.text
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')}">${s.text}</h2>`;
            if (s.type === 'ul') return `<ul>${s.items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
            return `<p>${s.text}</p>`;
          })
          .join('')}
      </article>
    </div>
  `;

  return doc({
    title: policy.metaTitle,
    description: policy.metaDescription,
    path: policy.path,
    body,
  });
}

export const privacyPage = () => render(policies.privacy);
export const termsPage = () => render(policies.terms);
