/**
 * Single source of truth for all site content.
 *
 * Edit this file, then run `npm run build` to regenerate every page.
 * Nothing here is invented beyond the supplied blueprint: anything that must be
 * confirmed before launch is listed in LAUNCH-CHECKLIST.md.
 */

export const site = {
  name: 'ITmedicus',
  // Public-facing name. Legal entity name must be confirmed before launch.
  legalName: 'ITmedicus Solutions',
  altName: 'ITmedicus',
  tagline: 'Building Digital Solutions for Better Healthcare',
  founded: 2011,
  description:
    'ITmedicus develops healthcare applications, professional software and digital solutions for healthcare professionals, pharmaceutical organisations and the wider community.',
  origin: 'https://itmedicus.com',
  email: 'info@itmedicus.com',
  supportEmail: 'info@itmedicus.com',
  // The phone number is deliberately not published. Enquiries route through
  // WhatsApp (no number shown) or email.
  whatsapp: '8801856250187',
  whatsappHref: 'https://wa.me/8801856250187',
  address: {
    line1: 'F: 8/B, H:31, Eastern Housing',
    line2: 'Basherpul, Demra',
    city: 'Dhaka',
    country: 'Bangladesh',
  },
};

export const social = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/13734423/', icon: 'linkedin' },
  { label: 'Facebook', href: 'https://www.facebook.com/itmedicus', icon: 'facebook' },
  { label: 'YouTube', href: 'https://www.youtube.com/@itmedicus7903', icon: 'youtube' },
];

export const stores = {
  googlePlay: {
    label: 'Google Play',
    href: 'https://play.google.com/store/apps/dev?id=5663691893572348964&hl=en',
  },
  microsoft: {
    label: 'Microsoft Store',
    href: 'https://apps.microsoft.com/search/publisher?name=ITmedicus&hl=en-US&gl=BD',
  },
};

export const nav = [
  { label: 'About', href: '/about/' },
  { label: 'Products', href: '/products/', menu: true },
  { label: 'Services', href: '/services/' },
  { label: 'Industries', href: '/industries/' },
  { label: 'Insights', href: '/insights/' },
  { label: 'Careers', href: '/careers/' },
];

/* ------------------------------------------------------------------ *
 * Products
 * ------------------------------------------------------------------ */

export const products = [
  {
    slug: 'dims',
    name: 'DIMS',
    kicker: 'Medicine information',
    tagline: 'Drug information at your fingertips.',
    summary:
      'A medicine information platform designed to help healthcare professionals access drug references and related product information.',
    audiences: ['professionals'],
    audienceLabel: 'Doctors, pharmacists & healthcare professionals',
    platforms: ['Android', 'iOS', 'Web', 'Windows'],
    accent: ['#1b4e40', '#0c2a22'],
    icon: 'capsule',
    logo: '/assets/img/products/dims.png',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.twgbd.dims',
    logoPlate: true,
    clinical: true,
    featured: true,
    hero: {
      headline: 'DIMS — Drug Information at Your Fingertips.',
      intro:
        'DIMS is a medicine information platform developed by ITmedicus to help healthcare professionals access structured drug and product references in a focused digital experience.',
    },
    forWhom: [
      'Doctors and physicians who need medicine references during consultations',
      'Pharmacists and medicine retailers checking product and brand information',
      'Medical students and healthcare teams building therapeutic knowledge',
    ],
    benefits: [
      {
        title: 'Find the right medicine faster',
        text: 'Search across brand and generic names to reach the reference you need without working through long printed directories.',
      },
      {
        title: 'Read structured medicine detail',
        text: 'Review therapeutic class, indications and related product information in one consistent layout.',
      },
      {
        title: 'Keep essentials close',
        text: 'Save the references you return to most, so frequently used information is never more than a tap away.',
      },
      {
        title: 'Work when the network does not',
        text: 'Offline access is designed to keep core reference content available in wards, chambers and rural settings.',
      },
    ],
    features: [
      'Brand and generic name search',
      'Structured medicine detail pages',
      'Therapeutic classes and indications',
      'Saved and favourite items',
      'Offline access to core content',
      'Desktop and web availability',
    ],
    stats: {
      downloads: 7000000,
      downloadsLabel: '7M+',
      rating: 4.6,
      reviews: 150000,
      reviewsLabel: '150k+',
      asOf: 'November 2026',
      source: 'Google Play',
    },
    pricing: {
      headline: 'Free to use. Premium adds clinical depth.',
      summary:
        'The medicine reference itself is free. Premium adds clinical reference content and keeps the data updating daily.',
      free: [
        'Search by brand, generic, company or condition',
        'A–Z brand list and drug-by-generic browsing',
        'Therapeutic class and condition listings',
        'Full drug detail — indications, dosage, contraindications, side effects, pack size and price',
        'Saved and favourite medicines',
        'Practice updates and add-a-drug',
      ],
      premium: [
        'Disease articles',
        'National treatment guidelines',
        'International guidelines',
        'Investigation locator',
        'Premium interface',
        'Online bookmarks synced across devices',
        'Daily data updates',
      ],
      note: 'Plans are sold through the app and its web portal; current pricing is shown at purchase.',
    },
    seo: {
      title: 'DIMS App — Drug Information for Doctors | ITmedicus',
      description:
        'DIMS is a medicine information platform from ITmedicus that helps healthcare professionals access structured drug and product references. Explore features and platforms.',
    },
  },
  {
    slug: 'patient-aid',
    name: 'Patient Aid',
    kicker: 'Patient & public health',
    tagline: 'Smart access to healthcare.',
    summary:
      'A patient-focused healthcare application bringing useful health information and digital tools together in one place.',
    audiences: ['public'],
    audienceLabel: 'Patients, families & the general public',
    platforms: ['Android'],
    accent: ['#3f8a6c', '#1b4e40'],
    icon: 'heart-pulse',
    logo: '/assets/img/products/patient-aid.png',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.itmedicus.patientaid',
    clinical: false,
    featured: true,
    hero: {
      headline: 'Patient Aid — Smart Access to Healthcare.',
      intro:
        'Patient Aid brings useful healthcare information and everyday health tools together in a mobile experience designed for the public.',
    },
    forWhom: [
      'Patients and family members looking for accessible health information',
      'People who want everyday health tools in a single mobile app',
      'Anyone who prefers clear, plain-language guidance before a consultation',
    ],
    benefits: [
      {
        title: 'Understand before you ask',
        text: 'Read approachable health information that helps you prepare better questions for your doctor.',
      },
      {
        title: 'One place for everyday tools',
        text: 'Keep the small utilities you reach for regularly together instead of spread across several apps.',
      },
      {
        title: 'Designed for non-specialists',
        text: 'Clear language and uncluttered screens make the app usable without clinical training.',
      },
      {
        title: 'Bilingual, accessible experience',
        text: 'Content and interface are built for readers who move between local language and English.',
      },
    ],
    features: [
      'Health information library',
      'Everyday health utilities',
      'Simple, readable interface',
      'Medicine information for the public',
      'Personal health organisation',
    ],
    stats: {
      downloads: 3000000,
      downloadsLabel: '3M+',
      rating: 4.5,
      reviews: 150000,
      reviewsLabel: '150k+',
      asOf: 'November 2026',
      source: 'Google Play',
    },
    pricing: {
      headline: 'Free for everyone. Premium is optional.',
      summary:
        'The core health information and everyday tools are free to use. Premium content is an optional extra, not a paywall on the basics.',
      free: [
        'Medicine information for the public',
        'Health knowledge and articles',
        'Everyday health tools',
      ],
      premium: ['Additional health content and digital tools inside the app'],
      note: 'Premium content is optional. Confirm the current premium feature list with the product team before publishing detailed claims.',
    },
    seo: {
      title: 'Patient Aid App — Medicine & Health Information | ITmedicus',
      description:
        'Patient Aid brings useful healthcare information and everyday health tools together in one mobile app, designed for patients and the general public.',
    },
  },
  {
    slug: 'pdm',
    name: 'PDM',
    kicker: 'Clinical decision support',
    tagline: 'Clinical knowledge for informed practice.',
    summary:
      'A diagnosis and management reference application designed to support healthcare professionals with structured clinical topics and guidance.',
    audiences: ['professionals', 'institutions'],
    audienceLabel: 'Physicians & clinical teams',
    platforms: ['Android', 'iOS'],
    accent: ['#123a2f', '#2a6653'],
    icon: 'stethoscope',
    logo: '/assets/img/products/pdm.png',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.itmedicus.pdm',
    clinical: true,
    featured: true,
    hero: {
      headline: 'PDM — Diagnosis & Management.',
      intro:
        'PDM is a clinical reference application designed to help healthcare professionals explore structured diagnosis and management information in a convenient digital format.',
    },
    forWhom: [
      'Physicians who want a structured prompt during a consultation',
      'Clinical teams aligning on diagnosis and management pathways',
      'Medical trainees learning a consistent approach to common conditions',
    ],
    benefits: [
      {
        title: 'Structure where it helps',
        text: 'Clinical topics follow a predictable pattern — presentation, differential, investigation and management — so you always know where to look.',
      },
      {
        title: 'Reference at the point of care',
        text: 'Reach the topic you need between patients rather than returning to a desk or a textbook.',
      },
      {
        title: 'Consistent clinical language',
        text: 'Shared terminology helps teams brief each other quickly and reduces ambiguity in handover.',
      },
      {
        title: 'Built for study as well as practice',
        text: 'The same structured topics support trainees preparing for examinations and reviews.',
      },
    ],
    features: [
      'Structured clinical topics',
      'Diagnosis and management guidance',
      'Topic-based navigation',
      'Consistent reference layout',
      'Search across clinical content',
    ],
    pricing: {
      headline: 'Core reference free. Premium unlocks the full library.',
      summary:
        'The diagnosis and management reference is usable for free. Premium opens the complete library and the laboratory reference values.',
      free: [
        'Browse clinical topics',
        'Diagnosis and management reference',
        'Search across the topic library',
      ],
      premium: [
        'Disease management content',
        'Investigation and lab reference values',
        'Daily data updates',
        'Full access to the whole library',
      ],
      note: 'Plans are sold through the app and its web portal; current pricing is shown at purchase.',
    },
    seo: {
      title: 'PDM App — Diagnosis & Management Reference | ITmedicus',
      description:
        'PDM is a clinical reference application from ITmedicus helping healthcare professionals explore structured diagnosis and management information.',
    },
  },
  {
    slug: 'dims-vet',
    name: 'DIMS Vet',
    kicker: 'Veterinary medicine',
    tagline: 'Medicine information for veterinary practice.',
    summary:
      'A veterinary medicine reference application for veterinary professionals and users who need veterinary drug information.',
    audiences: ['veterinary', 'professionals'],
    audienceLabel: 'Veterinary professionals & animal health teams',
    platforms: ['Android'],
    accent: ['#6e7a45', '#2b3a22'],
    icon: 'paw',
    logo: '/assets/img/products/dims-vet.png',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.itmedicus.dimsvet',
    logoPlate: true,
    clinical: true,
    featured: true,
    hero: {
      headline: 'DIMS Vet — Veterinary Medicine Information.',
      intro:
        'DIMS Vet extends the DIMS approach to veterinary medicine, giving veterinary professionals a focused reference for drug and product information across species.',
    },
    forWhom: [
      'Veterinarians in clinic and field practice',
      'Livestock and poultry health teams',
      'Animal health students and technical staff',
    ],
    benefits: [
      {
        title: 'Veterinary-specific reference',
        text: 'Content is organised around animal health practice rather than adapted from a human-medicine catalogue.',
      },
      {
        title: 'Species-aware lookup',
        text: 'Reach drug information with the species context a veterinary decision actually requires.',
      },
      {
        title: 'Useful in the field',
        text: 'A mobile reference is practical for farm visits and field work where a desktop is not available.',
      },
      {
        title: 'Consistent with the DIMS family',
        text: 'Familiar structure means teams already using DIMS need no new learning curve.',
      },
    ],
    features: [
      'Veterinary drug references',
      'Species-oriented organisation',
      'Brand and generic search',
      'Structured product detail',
      'Mobile-first reference',
    ],
    seo: {
      title: 'DIMS Vet App — Veterinary Medicine Reference | ITmedicus',
      description:
        'DIMS Vet is a veterinary medicine reference application from ITmedicus for veterinary professionals and users who need veterinary drug information.',
    },
  },
  {
    slug: 'pharma-plus',
    name: 'Pharma Plus',
    kicker: 'Pharmacy reference',
    tagline: 'Focused medicine reference for pharmacy teams.',
    summary:
      'A streamlined medicine reference built for fast lookup at the pharmacy counter, where a full research catalogue is more than the moment needs.',
    audiences: ['pharmacy', 'professionals'],
    audienceLabel: 'Pharmacy teams & prescribers',
    platforms: ['Android'],
    accent: ['#59a07f', '#2e6b55'],
    icon: 'layers',
    logo: '/assets/img/products/pharma-plus.png',
    clinical: true,
    featured: false,
    hero: {
      headline: 'Pharma Plus — Focused Medicine Reference.',
      intro:
        'Pharma Plus is a streamlined reference application built around fast medicine lookup for pharmacy teams and prescribers, rather than a full research catalogue.',
    },
    forWhom: [
      'Pharmacy counter staff who need a quick, dependable reference',
      'Prescribers checking a small set of medicines repeatedly',
      'Teams that want a light reference tool before a wider rollout',
    ],
    benefits: [
      {
        title: 'Less to navigate',
        text: 'A reduced interface keeps the path from search to answer short.',
      },
      {
        title: 'Built for the counter',
        text: 'The workflow assumes someone is waiting, so lookup stays quick and predictable.',
      },
      {
        title: 'Fast on modest devices',
        text: 'A lighter footprint suits everyday phones and slower connections.',
      },
      {
        title: 'A clear first step',
        text: 'An easy way for an organisation to adopt a reference tool before a wider deployment.',
      },
    ],
    features: [
      'Focused medicine search',
      'Streamlined reference layout',
      'Core medicine detail',
      'Lightweight mobile experience',
    ],
    seo: {
      title: 'Pharma Plus App — Medicine Reference for Pharmacy | ITmedicus',
      description:
        'Pharma Plus is a streamlined medicine reference application from ITmedicus, built for fast lookup by pharmacy teams and prescribers.',
    },
  },
  {
    slug: 'skinvd',
    name: 'SkinVD',
    kicker: 'Dermatology',
    tagline: 'Digital support for dermatology learning and practice.',
    summary:
      'A dermatology-focused application featuring educational resources and digital tools for skin and venereal disease topics.',
    audiences: ['professionals', 'institutions'],
    audienceLabel: 'Dermatology practitioners & trainees',
    platforms: ['Android'],
    accent: ['#c4703a', '#8c3f22'],
    icon: 'skin',
    logo: '/assets/img/products/skinvd.png',
    clinical: true,
    featured: true,
    hero: {
      headline: 'SkinVD — Dermatology Learning & Reference.',
      intro:
        'SkinVD is a dermatology-focused application that brings educational resources and reference material for skin conditions into one place.',
    },
    forWhom: [
      'Dermatology practitioners refreshing a differential',
      'Medical students and residents studying dermatology',
      'General practitioners handling common skin presentations',
    ],
    benefits: [
      {
        title: 'Visual learning first',
        text: 'Dermatology is a visual discipline; the app is organised around recognising presentations, not memorising lists.',
      },
      {
        title: 'Study and practice together',
        text: 'Educational material supports both examination preparation and day-to-day reference.',
      },
      {
        title: 'Structured topic coverage',
        text: 'Conditions are grouped logically so a topic can be followed from presentation to management.',
      },
      {
        title: 'Mobile access to revision',
        text: 'Short, focused sessions are practical between clinics rather than at a desk.',
      },
    ],
    features: [
      'Dermatology educational content',
      'Topic-based condition reference',
      'Structured learning material',
      'Reference for common presentations',
      'Mobile study experience',
    ],
    seo: {
      title: 'SkinVD App — Dermatology Reference & Learning | ITmedicus',
      description:
        'SkinVD is a dermatology-focused application from ITmedicus offering educational resources and reference material for skin conditions.',
    },
  },
  {
    slug: 'mdoctor-agent',
    name: 'mDoctor Agent',
    kicker: 'Medical engagement',
    tagline: 'Digital tools for medical engagement.',
    summary:
      'A field-facing digital product that supports how medical representatives and commercial teams engage healthcare professionals.',
    audiences: ['pharma', 'professionals'],
    audienceLabel: 'Pharmaceutical field teams & medical affairs',
    platforms: ['Android', 'Web'],
    accent: ['#33544a', '#0c2a22'],
    icon: 'link',
    clinical: false,
    featured: false,
    hero: {
      headline: 'mDoctor Agent — Digital Medical Engagement.',
      intro:
        'mDoctor Agent is a field-facing digital product from ITmedicus, designed for teams who meet healthcare professionals and need product and medical information to hand.',
    },
    forWhom: [
      'Medical representatives planning and recording visits',
      'Commercial and medical affairs teams coordinating field activity',
      'Organisations moving printed detailing material into digital form',
    ],
    benefits: [
      {
        title: 'Current information, always',
        text: 'Field teams share the latest approved product information instead of outdated printed material.',
      },
      {
        title: 'Structured engagement',
        text: 'A consistent path through a visit helps teams cover the points that matter and record them.',
      },
      {
        title: 'Visibility for managers',
        text: 'Activity is captured in one place, so coordination does not depend on individual spreadsheets.',
      },
      {
        title: 'Fits existing workflows',
        text: 'Scope and integration are agreed around your territory structure and reporting needs.',
      },
    ],
    features: [
      'Digital product information',
      'Field engagement workflows',
      'Activity capture',
      'Role-based access',
      'Web and mobile access',
    ],
    seo: {
      title: 'mDoctor Agent — Digital Medical Engagement | ITmedicus',
      description:
        'mDoctor Agent is a field-facing digital product from ITmedicus supporting how pharmaceutical teams engage healthcare professionals.',
    },
  },
  {
    slug: 'med-dictionary',
    name: 'Med Dictionary',
    kicker: 'Medical terminology',
    tagline: 'Medical terminology, made easier to explore.',
    summary:
      'A medical dictionary application for users who need to explore medical terms and definitions quickly and clearly.',
    audiences: ['professionals', 'public'],
    audienceLabel: 'Students, professionals & the public',
    platforms: ['Android'],
    accent: ['#2e6b55', '#123a2f'],
    icon: 'book',
    logo: '/assets/img/products/med-dictionary.png',
    logoPlate: true,
    clinical: false,
    featured: true,
    hero: {
      headline: 'Med Dictionary — Medical Terminology, Explained.',
      intro:
        'Med Dictionary is a reference application for exploring medical terms and definitions, written to be clear for students and the public as well as professionals.',
    },
    forWhom: [
      'Medical and nursing students learning terminology',
      'Clinicians checking an unfamiliar term',
      'Patients and families decoding clinical language',
    ],
    benefits: [
      {
        title: 'Plain definitions',
        text: 'Entries are written to be understood, not to impress — which helps both students and the public.',
      },
      {
        title: 'Fast lookup',
        text: 'Search from the first letter and reach the term without scrolling an alphabetical list.',
      },
      {
        title: 'Useful across roles',
        text: 'One reference serves students, practitioners and patients reading the same report.',
      },
      {
        title: 'Works as a study aid',
        text: 'A dependable companion for revision and for building vocabulary over time.',
      },
    ],
    features: [
      'Medical term definitions',
      'Alphabetical and search lookup',
      'Clear, plain-language entries',
      'Mobile reference',
    ],
    seo: {
      title: 'Med Dictionary App — Medical Terms & Definitions | ITmedicus',
      description:
        'Med Dictionary is a medical dictionary application from ITmedicus for exploring medical terms and definitions clearly and quickly.',
    },
  },
];

/** Filter facets used on the products page. */
export const productFilters = [
  { id: 'all', label: 'All products' },
  { id: 'professionals', label: 'Healthcare professionals' },
  { id: 'public', label: 'Patients & public' },
  { id: 'pharma', label: 'Pharmaceutical' },
  { id: 'veterinary', label: 'Veterinary' },
];

/* ------------------------------------------------------------------ *
 * Services
 * ------------------------------------------------------------------ */

export const services = [
  {
    slug: 'custom-healthcare-software',
    name: 'Custom Software Development',
    summary:
      'Web, mobile and desktop software built around your workflows — for healthcare organisations, other businesses and individual clients.',
    detail:
      'We plan and develop custom web, mobile and desktop software. Most of our work is in healthcare, but the same approach applies to any organisation or individual who needs a purpose-built system rather than an off-the-shelf product. From initial requirements to deployment and ongoing improvement, we work with stakeholders to create solutions that fit their operational context.',
    cta: 'Discuss a Software Project',
    icon: 'code',
    deliverables: ['Requirements and discovery', 'Solution architecture', 'Design and build', 'Deployment and handover'],
  },
  {
    slug: 'doctor-prescription-software',
    name: 'Doctor & Prescription Software',
    summary:
      'Digital prescription and chamber-management workflows that help doctors and assistants manage patient records and prescription processes.',
    detail:
      'Support digital clinical workflows with tools for prescription creation, patient record management and chamber operations. Solution scope, integrations and deployment model are tailored to the organisation and the needs of healthcare professionals.',
    cta: 'Request a Demonstration',
    icon: 'prescription',
    deliverables: ['Chamber and appointment flow', 'Prescription composition', 'Patient record handling', 'Print and export'],
  },
  {
    slug: 'pharmaceutical-digital-solutions',
    name: 'Pharmaceutical Digital Solutions',
    summary:
      'Digital platforms and engagement solutions that help pharmaceutical organisations communicate product and medical information to professional audiences.',
    detail:
      'We help pharmaceutical organisations explore digital platforms and professional engagement solutions. Projects may include product information platforms, DIMS Gateway registration so a company can maintain its own product data, digital communication tools, campaign support and workflow software, subject to agreed scope and compliance review.',
    cta: 'Talk to Our Pharma Solutions Team',
    icon: 'molecule',
    deliverables: ['Product information platforms', 'Field engagement tools', 'Campaign support', 'Compliance-reviewed content flow'],
  },
  {
    slug: 'healthcare-mobile-apps',
    name: 'Healthcare Mobile Applications',
    summary:
      'End-to-end mobile app design and development for healthcare, medical education and patient-facing services.',
    detail:
      'We design and build mobile applications for healthcare information, patient engagement, medical education and professional use. Product planning includes user journeys, content structure, platform requirements and ongoing support.',
    cta: 'Build a Healthcare App',
    icon: 'phone',
    deliverables: ['User journeys', 'Content structure', 'Design and build', 'Store release and support'],
  },
  {
    slug: 'web-platforms',
    name: 'Web Platforms & Business Systems',
    summary:
      'Purpose-built portals, dashboards and management systems that connect teams, information and processes.',
    detail:
      'Develop portals, dashboards and web-based systems that help teams manage information, users and business processes. Scope can include role-based access, reporting, content management and integrations.',
    cta: 'Plan Your Platform',
    icon: 'dashboard',
    deliverables: ['Role-based access', 'Reporting', 'Content management', 'Integrations'],
  },
  {
    slug: 'product-support',
    name: 'Software Maintenance & Support',
    summary:
      'Maintenance, updates and technical support for software we built — and for systems built elsewhere. Delivered remotely worldwide, with local support in Bangladesh.',
    detail:
      'Digital products need ongoing attention. We provide maintenance, bug fixing, platform and security updates, monitoring, and agreed data or content operations — for products we have built and for existing systems maintained under contract. Work is delivered remotely to clients worldwide, with on-site support available in Bangladesh.',
    cta: 'Contact Support',
    icon: 'support',
    deliverables: ['Maintenance and bug fixing', 'Platform and security updates', 'Monitoring and incident response', 'Agreed support levels'],
  },
];

/* ------------------------------------------------------------------ *
 * Industries
 * ------------------------------------------------------------------ */

export const industries = [
  {
    slug: 'doctors',
    name: 'Doctors & healthcare professionals',
    summary:
      'Access professional reference tools and digital workflows designed to support day-to-day practice.',
    icon: 'stethoscope',
    products: ['dims', 'pdm', 'skinvd'],
    services: ['doctor-prescription-software', 'healthcare-mobile-apps'],
  },
  {
    slug: 'hospitals',
    name: 'Hospitals, clinics & diagnostic centres',
    summary:
      'Explore software that can be tailored to service delivery, records, operational coordination and patient-facing workflows.',
    icon: 'hospital',
    products: ['pdm', 'dims'],
    services: ['custom-healthcare-software', 'web-platforms'],
  },
  {
    slug: 'pharmaceutical',
    name: 'Pharmaceutical companies',
    summary:
      'Support product information, professional engagement and digital transformation initiatives with fit-for-purpose technology.',
    icon: 'molecule',
    products: ['mdoctor-agent', 'dims'],
    services: ['pharmaceutical-digital-solutions', 'custom-healthcare-software'],
  },
  {
    slug: 'pharmacies',
    name: 'Pharmacies & medicine retailers',
    summary:
      'Explore digital tools and software concepts for medicine information, pharmacy operations and customer service.',
    icon: 'pharmacy',
    products: ['dims', 'pharma-plus', 'med-dictionary'],
    services: ['custom-healthcare-software', 'product-support'],
  },
  {
    slug: 'veterinary',
    name: 'Veterinary professionals',
    summary:
      'Access veterinary-focused medicine information and digital resources.',
    icon: 'paw',
    products: ['dims-vet'],
    services: ['healthcare-mobile-apps', 'product-support'],
  },
  {
    slug: 'public',
    name: 'Patients & the public',
    summary:
      'Discover applications that make selected health information and everyday health tools easier to access.',
    icon: 'heart-pulse',
    products: ['patient-aid', 'med-dictionary'],
    services: ['healthcare-mobile-apps'],
  },
];

/* ------------------------------------------------------------------ *
 * Insights
 * ------------------------------------------------------------------ */

export const insights = [
  {
    slug: 'offline-first-healthcare-applications',
    category: 'Healthcare Technology',
    date: '2026-10-21',
    readTime: '6 min read',
    title: 'Designing offline-first healthcare applications for real-world conditions',
    excerpt:
      'Connectivity is not guaranteed in a ward, a rural clinic or a basement pharmacy. Here is how we think about building healthcare apps that stay useful when the network does not.',
    author: 'ITmedicus Product Team',
    body: [
      {
        type: 'p',
        text: 'Most software is designed on the assumption that the network is present. Healthcare is one of the settings where that assumption fails most often — and where failing matters most. A doctor looking up a drug interaction in a crowded chamber, a pharmacist checking a brand in a market pharmacy, a field team visiting a rural clinic: each of them may have no usable connection at the moment they need the reference.',
      },
      {
        type: 'h2',
        text: 'Decide what “offline” actually means for your product',
      },
      {
        type: 'p',
        text: 'Offline-first is not a single feature. It is a set of decisions about which content must be available without a connection, how that content is kept current, and what the interface does while it waits. Before writing any code, we ask three questions with the product owner: what is the smallest useful offline set, how stale can it be, and what should the user see when fresh data is unavailable?',
      },
      {
        type: 'ul',
        items: [
          'Smallest useful set — ship the reference content people reach for daily, not the entire catalogue.',
          'Acceptable staleness — a medicine reference and a stock price do not age at the same rate.',
          'Honest interface — show the last-updated date rather than pretending content is live.',
        ],
      },
      {
        type: 'h2',
        text: 'Design the sync before the screens',
      },
      {
        type: 'p',
        text: 'The hardest part of offline-first is not storage; it is reconciliation. If a user has made changes locally, those changes need to reach the server without overwriting newer data or creating duplicates. We plan the sync model before the interface, because retrofitting conflict handling into a finished app is expensive and usually visible to users as lost work.',
      },
      {
        type: 'quote',
        text: 'If the offline experience is an afterthought, users will treat the app as unreliable — and they will be right.',
      },
      {
        type: 'h2',
        text: 'Make the state of the data visible',
      },
      {
        type: 'p',
        text: 'A quiet, persistent indicator of content version and connectivity does more for trust than a spinner. When people can see that they are reading content downloaded on a specific date, they can make their own judgement about whether to rely on it. Hidden freshness is the thing that erodes confidence.',
      },
      {
        type: 'h2',
        text: 'Test on the devices and networks people actually have',
      },
      {
        type: 'p',
        text: 'A flagship phone on office Wi-Fi will not surface the problems that matter. We test with older mid-range devices, constrained storage and throttled connections, and we test transitions — losing signal mid-task, regaining it, backgrounding the app. Those transitions, not the happy path, are where offline products succeed or fail.',
      },
      {
        type: 'p',
        text: 'None of this is exotic engineering. It is a sequence of ordinary decisions made deliberately, in the right order, with the field conditions in view.',
      },
    ],
  },
  {
    slug: 'digitising-prescription-workflow',
    category: 'Healthcare Technology',
    date: '2026-09-30',
    readTime: '7 min read',
    title: 'What to consider when digitising a doctor’s prescription workflow',
    excerpt:
      'Digitising a prescription is rarely a software problem first. It is a workflow problem — and the software only succeeds if it respects how a chamber actually runs.',
    author: 'ITmedicus Delivery Team',
    body: [
      {
        type: 'p',
        text: 'A prescription is the most-used document in a doctor’s working day. It is also the place where digitisation projects most often stall, because the printed pad is not merely a document — it is a small system that already works, and every part of it exists for a reason.',
      },
      {
        type: 'h2',
        text: 'Start with the actual sequence of events',
      },
      {
        type: 'p',
        text: 'Before proposing a screen, we sit with the doctor and the assistant and record what happens between a patient arriving and a prescription being handed over. Where does the file come from? Who writes what? When is the assistant interrupted? Which step is the bottleneck on a busy evening? The answers usually reveal that the valuable digitisation is not the prescription itself but the queue in front of it.',
      },
      {
        type: 'h2',
        text: 'The assistant is a primary user',
      },
      {
        type: 'p',
        text: 'Many prescription tools are designed for the doctor and then handed to an assistant to operate. That mismatch shows up as extra keystrokes, duplicated entry and quiet workarounds. If an assistant will enter patient details, the workflow must be designed for speed of entry with a queue of waiting patients in mind — keyboard-first where possible, with defaults that remove repeated typing.',
      },
      {
        type: 'ul',
        items: [
          'Design for interruption: a chamber consultation is constantly paused and resumed.',
          'Assume the assistant, not the doctor, types most of the text.',
          'Keep a printable output that looks credible to a pharmacist.',
          'Plan for the day the network is down — the queue cannot stop.',
        ],
      },
      {
        type: 'h2',
        text: 'Never break the paper fallback on day one',
      },
      {
        type: 'p',
        text: 'A clinic that has used a printed pad for twenty years will not accept a system that can fail to produce a prescription. The transition works when the digital path is reliable and the paper path remains available without drama. We treat print output as a first-class feature, not a legacy concession.',
      },
      {
        type: 'h2',
        text: 'Measure the time it actually saves',
      },
      {
        type: 'p',
        text: 'The claim that digitisation saves time should be measurable. We agree a baseline before go-live — average minutes per patient, number of repeat entries, corrections per prescription — and compare after a month of real use. If the numbers do not move, the design is wrong, not the users.',
      },
      {
        type: 'p',
        text: 'Prescription software is a workflow product wearing a clinical interface. Treated that way, it can remove a great deal of daily friction. Treated as a form to be replicated on screen, it usually adds some.',
      },
    ],
  },
  {
    slug: 'planning-a-healthcare-mobile-application',
    category: 'Product',
    date: '2026-09-08',
    readTime: '5 min read',
    title: 'Planning a healthcare mobile application: from requirements to launch',
    excerpt:
      'A practical sequence for turning a healthcare idea into a released app — and the decisions that are expensive to change later.',
    author: 'ITmedicus Product Team',
    body: [
      {
        type: 'p',
        text: 'Healthcare apps attract a particular kind of optimism: the idea is clear, the audience is large, and the launch feels close. The gap between that and a released product is usually a small number of decisions made too late. This is the sequence we follow to make them early.',
      },
      {
        type: 'h2',
        text: '1. Name the user and the moment of use',
      },
      {
        type: 'p',
        text: '“Doctors” is not a user definition. A resident checking a dose at 2 a.m. and a consultant reviewing a formulary between patients need different things from the same content. Write down the specific moment — where the person is, what they have in their hand, how much time they have. Everything later is easier once this is concrete.',
      },
      {
        type: 'h2',
        text: '2. Choose the content model before the design',
      },
      {
        type: 'p',
        text: 'Most healthcare apps are content products with an interface attached. Deciding how content is structured, versioned and updated has more effect on long-term cost than the visual design does. If the content model changes after launch, screens have to be rebuilt around it.',
      },
      {
        type: 'h2',
        text: '3. Decide the platform question honestly',
      },
      {
        type: 'p',
        text: 'Cross-platform development is the sensible default for most healthcare apps, but not an automatic one. Reference content with heavy offline storage, or features that depend on device-specific capability, may justify a native approach for one platform first. What matters is deciding deliberately rather than by habit.',
      },
      {
        type: 'h2',
        text: '4. Plan for review and release as part of the build',
      },
      {
        type: 'p',
        text: 'Store review, medical disclaimers, privacy disclosures and data-handling statements are not launch-week paperwork. They influence the interface — consent flows, account deletion, data export — and are far cheaper to accommodate during design than to bolt on afterwards.',
      },
      {
        type: 'ul',
        items: [
          'Write the medical disclaimer before the first screen is designed.',
          'Decide what data leaves the device, and say so plainly.',
          'Plan account deletion and data export from the start.',
          'Keep release notes and version history from the first release.',
        ],
      },
      {
        type: 'h2',
        text: '5. Ship to a small group first',
      },
      {
        type: 'p',
        text: 'A closed test with real users in real conditions will surface more than any internal review. Plan the feedback channel and the fix cycle before the test begins, so the first round produces decisions rather than a list.',
      },
    ],
  },
  {
    slug: 'digital-engagement-for-pharmaceutical-organisations',
    category: 'Pharma Digital',
    date: '2026-08-19',
    readTime: '6 min read',
    title: 'Digital engagement opportunities for pharmaceutical organisations',
    excerpt:
      'Where digital channels genuinely improve professional engagement — and where they add process without adding value.',
    author: 'ITmedicus Pharma Solutions',
    body: [
      {
        type: 'p',
        text: 'Pharmaceutical teams are under pressure to make every professional interaction count, and digital tools promise to help. The promise is real, but it is narrower than the pitch. Digital engagement works where it removes friction from something a field team or a medical affairs function already does.',
      },
      {
        type: 'h2',
        text: 'Start from the interaction, not the platform',
      },
      {
        type: 'p',
        text: 'A platform that requires a representative to change how they work will be used reluctantly, then not at all. The productive question is not “what should our platform do?” but “what does a representative actually need in the two minutes before a call?” Usually the answer is current approved product information, a clear record of the last conversation, and a way to capture what was agreed.',
      },
      {
        type: 'h2',
        text: 'Content currency is the real product',
      },
      {
        type: 'p',
        text: 'The most common failure in pharma digital projects is not functionality but content decay. Approved material changes, a product is discontinued, a claim is revised — and the digital tool keeps serving the old version. A content workflow with a named owner, an approval step and a visible version date matters more than an extra feature.',
      },
      {
        type: 'h2',
        text: 'Compliance is a design constraint, not a final gate',
      },
      {
        type: 'p',
        text: 'Approval requirements shape what can be measured, what can be stored and what must be shown. Projects that treat compliance as a review at the end tend to lose features late and expensively. We prefer to bring the review into the design phase, where a constraint can still be turned into a layout decision.',
      },
      {
        type: 'h2',
        text: 'Measure engagement in terms that survive scrutiny',
      },
      {
        type: 'p',
        text: 'Visit counts and screen views are easy to report and easy to misinterpret. More defensible measures connect activity to something the business recognises: coverage of priority professionals, currency of shared material, follow-up completion, quality of captured notes. These are less flattering and more useful.',
      },
      {
        type: 'p',
        text: 'Digital engagement is worth doing where it makes an existing professional interaction better. It is rarely worth doing simply because a competitor has a portal.',
      },
    ],
  },
];

export const insightCategories = ['All', 'Company News', 'Product Updates', 'Healthcare Technology', 'Pharma Digital', 'Case Studies'];

/* ------------------------------------------------------------------ *
 * Shared page content
 * ------------------------------------------------------------------ */

export const values = [
  {
    title: 'Purpose before technology',
    text: 'We solve meaningful user and business problems, and we let the problem choose the technology rather than the other way round.',
  },
  {
    title: 'Trust and responsibility',
    text: 'Healthcare information and user privacy are handled with care, because the consequences of getting them wrong are not abstract.',
  },
  {
    title: 'Usability',
    text: 'Complex information and workflows become easier to navigate. If a professional has to be taught to use a reference tool, we have not finished.',
  },
  {
    title: 'Continuous improvement',
    text: 'We listen, learn and improve products over time. A launch is a checkpoint in the product’s life, not the end of the work.',
  },
  {
    title: 'Collaboration',
    text: 'We work closely with healthcare and business stakeholders, since the people closest to a workflow usually know where it hurts.',
  },
];

export const process = [
  {
    step: '01',
    title: 'Understand',
    text: 'We start with the users, the context and the operational challenge — not with a feature list.',
  },
  {
    step: '02',
    title: 'Define',
    text: 'Scope, priorities, success measures and delivery milestones are written down and agreed.',
  },
  {
    step: '03',
    title: 'Design & build',
    text: 'Design and development proceed with regular stakeholder feedback rather than one distant review.',
  },
  {
    step: '04',
    title: 'Test',
    text: 'Careful testing across the relevant devices, platforms and real workflows.',
  },
  {
    step: '05',
    title: 'Support & improve',
    text: 'Deploy, support, measure and improve — with maintenance and iteration planned from the start.',
  },
];

export const differentiators = [
  {
    title: 'Domain understanding',
    text: 'Products and software shaped around healthcare and pharmaceutical workflows rather than generic business patterns.',
    icon: 'stethoscope',
  },
  {
    title: 'Multi-platform thinking',
    text: 'Solutions planned across mobile, web and desktop environments where that actually serves the user.',
    icon: 'layers',
  },
  {
    title: 'User-centred development',
    text: 'Clear interfaces and practical features for professionals and the public alike.',
    icon: 'user',
  },
  {
    title: 'Long-term product mindset',
    text: 'Support, improvement and product evolution continue beyond initial delivery.',
    icon: 'refresh',
  },
  {
    title: 'Collaborative delivery',
    text: 'Requirements, milestones and feedback are aligned with each client throughout the work.',
    icon: 'handshake',
  },
];

export const proofPoints = [
  { value: '2011', label: 'Building healthcare technology since' },
  { value: '10M+', label: 'App downloads on Google Play' },
  { value: '4.6', label: 'DIMS rating on Google Play' },
  { value: '8', label: 'Digital products in the portfolio' },
];

export const faqs = [
  {
    q: 'Is ITmedicus a software company or a product company?',
    a: 'Both. ITmedicus develops its own healthcare applications — such as DIMS, Patient Aid and PDM — and also builds custom software and digital platforms for healthcare and pharmaceutical organisations.',
  },
  {
    q: 'How do we start a custom software project with ITmedicus?',
    a: 'Send us a short description of the problem, the users involved and any timeline constraints. We begin with a discovery discussion, then prepare scope, a proposal and a delivery plan before development starts.',
  },
  {
    q: 'Can an existing product be adapted for our organisation?',
    a: 'In many cases, yes. Adaptation depends on the product, the requested changes and the deployment model. Contact us with your requirement and we will tell you honestly whether an existing product, a configuration or a new build is the better route.',
  },
  {
    q: 'Where can I get support for an ITmedicus application?',
    a: 'Product support is handled by email at our published contact address. Please include the product name, platform, app version and a description of the issue so we can route it correctly.',
  },
  {
    q: 'Do your clinical products replace professional judgement?',
    a: 'No. Our reference applications are informational and educational tools. They do not replace professional judgement, clinical training or official prescribing information, and they should not be used as the sole basis for a clinical decision.',
  },
  {
    q: 'Which platforms do the products support?',
    a: 'Support varies by product and is shown on each product page. The portfolio spans Android, iOS, web and Windows, but a specific product may not be available on every platform. Check the product page or store listing before relying on a particular platform.',
  },
];
