import { 
  EcosystemDomain, 
  Pillar, 
  KnowledgeItem, 
  MarketplaceEntity, 
  JourneyTask 
} from './types';

export const CANONICAL_REVIEW_NOTE = 
  "Verification / Expert Review in Progress: This material has been prepared from the sources and evidence currently available to meUus. Independent review by an appropriate authoritative source and/or qualified expert is continuing. It is made available now for learning, review, and practical accessibility, and will be corrected or strengthened as verification is completed.";

export const ECOSYSTEM_DOMAINS: EcosystemDomain[] = [
  {
    id: 'meuus-org',
    name: 'meuus.org',
    url: 'https://meuus.org',
    role: 'understand',
    tagline: 'Public Ecosystem, Trust & Understanding',
    description: 'The public window to meUus. Discover why meUus exists, understand the Nine Pillars, explore transparent status matrices, and see how human development connects across Bangladesh.',
    status: 'LIVE',
    primaryFunctions: [
      'Ecosystem explanation & Nine Pillars overview',
      'Public trust, truth status & evidence registry',
      'Universal Start Door entry & discovery',
      'Pathways into Learning (meuussoul.com) and Action (meuus.app)'
    ]
  },
  {
    id: 'meuus-soul',
    name: 'meuussoul.com',
    url: 'https://meuussoul.com',
    role: 'learn',
    tagline: 'The Knowledge, Reflection & Learning Home',
    description: 'Deep developmental knowledge, structured readings, Qur\'an & Seerah learning materials with source transparency, DLAS developmental concepts, and verified life curricula.',
    status: 'LIVE',
    primaryFunctions: [
      'Knowledge library (Foundational, Legal, SME, Recovery, Literacy)',
      'Qur\'an & Seerah learning modules with ongoing scholarly review notes',
      'Be — The Starting Point developmental readings',
      'DLAS conceptual frameworks & source-indexed bibliography'
    ]
  },
  {
    id: 'meuus-app',
    name: 'meuus.app',
    url: 'https://meuus.app',
    role: 'reflect-act',
    tagline: 'Operational Human Starting Point: Soul & Action',
    description: 'Where understanding transforms into practical reality. Build your Master Soul, state real needs or capacities, track your 90-day journey, access services, and connect with opportunities.',
    status: 'LIVE',
    primaryFunctions: [
      'Personal Master Soul & granular privacy controls',
      'Universal Start Door with immediate next-step routing',
      '90-Day Journey progress tracker & custom task engine',
      'Two-Way Marketplace: Need ↔ Capacity matching',
      'meYoo human-facing intelligence interface & DLAS structured reflection'
    ]
  },
  {
    id: 'rujbel-org',
    name: 'rujbel.org',
    url: 'https://rujbel.org',
    role: 'archive',
    tagline: 'Founder Living Archive & Governance Laboratory',
    description: 'The preservation repository for founder chronology, architectural decision records, Be Written archive, engineering closures, and governance methodologies.',
    status: 'LIVE',
    primaryFunctions: [
      'Founder journey & Be Written archive (preserving history without cluttering user app)',
      'Architecture Decision Records (ADRs) & Engineering Closures',
      'Governance principles: Claim ≤ Evidence, Diagnosis Before Retry, Default Deny',
      'Audit logs, research notes & provenance preservation'
    ]
  }
];

export const PILLARS: Pillar[] = [
  {
    id: 'mind-beautifier',
    title: 'Mind Beautifier',
    tagline: 'Emotional Literacy, Reflection & Non-Clinical Wellness',
    description: 'Nurturing mental well-being and self-understanding through guided reflection, stigma-free resources, and referral to verified professional mental health practitioners.',
    iconName: 'Brain',
    color: 'from-pink-500 to-rose-600',
    leadQuote: '"Your mind deserves gentleness, clarity, and honest care."',
    reviewStatus: 'Educational & Non-Diagnostic — Professional Verification in Progress',
    features: [
      'Guided daily self-reflection & emotional literacy exercises in Bangla and English',
      'Culturally grounded non-clinical support and wellness check-in prompts',
      'Direct directory & referral routing to verified licensed clinical psychologists and psychiatrists',
      'Stigma-reduction educational toolkits for families and students'
    ],
    capabilities: [
      { name: 'Self-Guided Reflection Toolkits', mode: 'Knowledge', status: 'LIVE', evidenceNote: 'Available locally on browser/app' },
      { name: 'Manual Counselling Referral Desk', mode: 'Manual Service', status: 'PILOT', evidenceNote: 'Human triage team connects to verified clinic' },
      { name: 'meYoo Empathetic Listening Mode', mode: 'AI Assist', status: 'PILOT', evidenceNote: 'Strictly non-diagnostic non-prescriptive supportive companion' },
      { name: 'Automated Psychiatric Diagnostic Authority', mode: 'Autonomous AI', status: 'UNAVAILABLE', evidenceNote: 'Prohibited by meUus safety constitution' }
    ]
  },
  {
    id: 'legal-hub',
    title: 'Legal Hub',
    tagline: 'Democratizing Legal Literacy, Formalization & Justice Support',
    description: 'Empowering citizens and micro-enterprises with clear legal knowledge, basic document preparation guidance, and connections to pro-bono or affordable bar-certified attorneys.',
    iconName: 'Scale',
    color: 'from-blue-600 to-indigo-700',
    leadQuote: '"Knowledge of your rights is the first step toward dignity and fairness."',
    reviewStatus: 'General Information & Literacy — Individual Representation by Partner Lawyers Only',
    features: [
      'Plain-language guides on Bangladesh labour laws, tenancy, family rights, and civil procedures',
      'SME registration guidance (Trade License, TIN, BIN, VAT compliance)',
      'Standardized contract templates & checklist for dispute mitigation',
      'Vetted partner advocate network for formal representation'
    ],
    capabilities: [
      { name: 'Citizen Legal Literacy Modules', mode: 'Knowledge', status: 'LIVE', evidenceNote: 'Researched statutory summaries' },
      { name: 'Trade License & TIN Assistance', mode: 'Manual Service', status: 'LIVE', evidenceNote: 'Step-by-step verified administrative support' },
      { name: 'Pro-Bono Case Routing', mode: 'Professional', status: 'PILOT', evidenceNote: 'Partner advocate roster in Dhaka & Chittagong' },
      { name: 'Autonomous Legal Ruling Generation', mode: 'Autonomous AI', status: 'UNAVAILABLE', evidenceNote: 'Legal decisions require qualified licensed human judgment' }
    ]
  },
  {
    id: 'business-hub',
    title: 'Business Hub',
    tagline: 'Practical SME Formalization, Growth & Digital Operations',
    description: 'Empowering local entrepreneurs and small businesses to transition from informal trade into formalized, scalable, and resilient commercial enterprises.',
    iconName: 'Briefcase',
    color: 'from-indigo-600 to-violet-700',
    leadQuote: '"Building sustainable enterprise one truthful step at a time."',
    reviewStatus: 'Operational Best Practices — Individualized Auditing by Partner Accountants',
    features: [
      'Integrated Formalization roadmap: Licensing, banking, tax identification, and bookkeeping',
      'Financial planning worksheets and cash-flow management frameworks',
      'Digital presence, cataloging, and local marketplace integration toolkits',
      'Mentorship circles and peer-to-peer enterprise exchange'
    ],
    capabilities: [
      { name: 'SME Formalization Guidebooks', mode: 'Knowledge', status: 'LIVE', evidenceNote: 'Comprehensive documentation verified against NBR/City Corp guidelines' },
      { name: 'Business Identity Profile Builder', mode: 'Digital / Pilot', status: 'LIVE', evidenceNote: 'Integrated with meUus Master Soul' },
      { name: '1-on-1 Business Model Coaching', mode: 'Manual Service', status: 'PILOT', evidenceNote: 'Experienced SME mentor sessions' },
      { name: 'Guaranteed Revenue Prediction Engine', mode: 'Autonomous AI', status: 'UNAVAILABLE', evidenceNote: 'Financial outcomes depend on real market factors' }
    ]
  },
  {
    id: 'unemployment-buster',
    title: 'Unemployment Buster',
    tagline: 'Practical Skills, Career Pathways & Verified Opportunity Matching',
    description: 'Bridging the divide between job-seekers and real market demand through actionable skill curriculums, authentic portfolio building, and two-way opportunity discovery.',
    iconName: 'UserMinus',
    color: 'from-orange-500 to-amber-600',
    leadQuote: '"Every person has latent capacity waiting for the right door to open."',
    reviewStatus: 'Curriculum Verified by Industry Practitioners',
    features: [
      'Actionable career mapping and skills gap diagnostic toolkits',
      'CV crafting & portfolio development aligned with Bangladesh and remote industry standards',
      'Practical micro-enterprise and freelancing startup roadmaps',
      'Verified job and apprenticeship noticeboard with two-way capacity matching'
    ],
    capabilities: [
      { name: 'Skills & Career Diagnostic Framework', mode: 'Knowledge', status: 'LIVE', evidenceNote: 'Self-guided evaluation matrices' },
      { name: 'Two-Way Need & Capacity Board', mode: 'Digital / Pilot', status: 'LIVE', evidenceNote: 'Direct peer & employer connection' },
      { name: 'Interview Coaching & CV Audit', mode: 'Manual Service', status: 'PILOT', evidenceNote: 'Personalized human feedback' },
      { name: 'Automated Job Placement Guarantee', mode: 'Autonomous AI', status: 'UNAVAILABLE', evidenceNote: 'Hiring is determined by employer evaluation' }
    ]
  },
  {
    id: 'drug-buster',
    title: 'Drug Buster',
    tagline: 'Compassionate Recovery Education, Family Support & Referral',
    description: 'A non-judgmental, dignified path to recovery offering evidence-based substance literacy, family communication strategies, and verified rehabilitation centre referrals.',
    iconName: 'ShieldAlert',
    color: 'from-red-600 to-rose-700',
    leadQuote: '"Recovery begins with honesty, dignity, and a supportive community."',
    reviewStatus: 'Substance Literacy Verified — Clinical Rehabilitation by Licensed Centers',
    features: [
      'Substance literacy & harm-reduction educational resources',
      'Family support guidelines for constructive intervention and emotional resilience',
      'Vetted directory of licensed medical detox and rehabilitation facilities across Bangladesh',
      'Post-recovery reintegration planning and vocational re-skilling support'
    ],
    capabilities: [
      { name: 'Recovery Education Library', mode: 'Knowledge', status: 'LIVE', evidenceNote: 'Curated evidence-based literature' },
      { name: 'Rehabilitation Center Directory', mode: 'Manual Service', status: 'PILOT', evidenceNote: 'Verified government-licensed facilities' },
      { name: 'Post-Recovery Peer Check-in', mode: 'Manual Service', status: 'IN REVIEW', evidenceNote: 'Community mentor network in development' },
      { name: 'Clinical Medical Detox Administration', mode: 'Autonomous AI', status: 'UNAVAILABLE', evidenceNote: 'Requires medical in-patient clinical oversight' }
    ]
  },
  {
    id: 'family-harmony',
    title: 'Family Harmony',
    tagline: 'Interpersonal Communication, Parenting & Generational Respect',
    description: 'Strengthening relationships and resolving domestic friction through pre-marital guidance, constructive communication workshops, and compassionate elderly care toolkits.',
    iconName: 'Users',
    color: 'from-emerald-600 to-teal-700',
    leadQuote: '"When the family is in harmony, the individual thrives and society prospers."',
    reviewStatus: 'Educational Materials Reviewed by Community Counselors',
    features: [
      'Pre-marital preparation and mutual expectation alignment frameworks',
      'Parenting toolkits for early childhood development and adolescent mental health',
      'Constructive conflict resolution strategies for multigenerational households',
      'Dignified elderly caregiving practices and emotional support guidelines'
    ],
    capabilities: [
      { name: 'Family Communication Guides', mode: 'Knowledge', status: 'LIVE', evidenceNote: 'Open-access family literacy' },
      { name: 'Pre-Marital Consultation Desk', mode: 'Manual Service', status: 'PILOT', evidenceNote: 'Trained family mentors' },
      { name: 'Multigenerational Conflict Mediation', mode: 'Professional', status: 'IN REVIEW', evidenceNote: 'Collaborative dispute resolution protocol' }
    ]
  },
  {
    id: 'green-solutions',
    title: 'Green Solutions',
    tagline: 'Local Sustainability, Solar Energy & Environmental Stewardship',
    description: 'Fostering environmental responsibility and economic efficiency through community solar literacy, sustainable waste management, and climate-resilient local projects.',
    iconName: 'Leaf',
    color: 'from-green-600 to-emerald-700',
    leadQuote: '"Protecting our land and rivers is an act of intergenerational trust (Amanah)."',
    reviewStatus: 'Technical Specs Aligned with Renewable Energy Authorities',
    features: [
      'Rooftop and rural solar installation feasibility guides & vendor checklists',
      'Community waste segregation and organic composting manuals',
      'Water conservation and rainwater harvesting blueprints for urban and rural settings',
      'Green micro-enterprise and organic farming commercialization pathways'
    ],
    capabilities: [
      { name: 'Solar Feasibility & Cost Calculator', mode: 'Digital / Pilot', status: 'LIVE', evidenceNote: 'Rule-based benchmark calculator' },
      { name: 'Community Composting Blueprints', mode: 'Knowledge', status: 'LIVE', evidenceNote: 'Open practical guides' },
      { name: 'Green Contractor Directory', mode: 'Manual Service', status: 'PILOT', evidenceNote: 'Verified renewable energy technicians' }
    ]
  },
  {
    id: 'idea-lab',
    title: 'Idea Lab',
    tagline: 'Disciplined Problem Validation, Gating & Project Incubation',
    description: 'Transforming raw ideas into viable social or commercial initiatives through systematic problem validation, gated evidence milestones, and structured mentorship.',
    iconName: 'Lightbulb',
    color: 'from-amber-500 to-yellow-600',
    leadQuote: '"An idea without evidence is a dream; with disciplined action, it becomes reality."',
    reviewStatus: 'Validated via meUus Gate Review Methodology',
    features: [
      'Stage-gated idea submission and problem validation canvas',
      'Evidence-first milestone checklist (Claim ≤ Evidence enforcement)',
      'Mentorship pairing with domain practitioners and technical advisors',
      'Project incubation sandbox with transparent progress logs'
    ],
    capabilities: [
      { name: 'Idea Canvas & Problem Validator', mode: 'Digital / Pilot', status: 'LIVE', evidenceNote: 'Structured client-side tool' },
      { name: 'Founder Gate Review Board', mode: 'Manual Service', status: 'PILOT', evidenceNote: 'Periodic review of high-evidence submissions' },
      { name: 'Incubation Project Registry', mode: 'Digital / Pilot', status: 'LIVE', evidenceNote: 'Integrated with meUus ecosystem projects' }
    ]
  },
  {
    id: 'alive-bangladesh',
    title: 'aLive Bangladesh',
    tagline: 'Civic Transparency, Quran/Seerah Learning & Social Unity',
    description: 'Promoting national development, ethical awareness, transparent civic reporting, and profound spiritual reflection anchored in authentic texts and verified community impact.',
    iconName: 'MapPin',
    color: 'from-teal-600 to-cyan-700',
    leadQuote: '"A nation rises when its people learn, reflect, and stand together for truth."',
    reviewStatus: 'Religious Content Subject to Continual Scholarly Review',
    features: [
      'Quran & Seerah developmental reading journeys with contextual notes and source transparency',
      'Civic transparency dashboards monitoring national human development metrics',
      'Community impact reporting and verified volunteer opportunities across 64 districts',
      'Amanah & ethical governance frameworks for public and private organizations'
    ],
    capabilities: [
      { name: 'Quran Developmental Journey Hub', mode: 'Knowledge', status: 'LIVE', evidenceNote: 'With explicit scholarly review notes' },
      { name: 'District Development Data Portal', mode: 'Knowledge', status: 'LIVE', evidenceNote: 'BBS & verified national data sources' },
      { name: 'Civic Transparency Audit Matrix', mode: 'Digital / Pilot', status: 'LIVE', evidenceNote: 'Open-access governance ledger' }
    ]
  }
];

export const KNOWLEDGE_LIBRARY: KnowledgeItem[] = [
  {
    id: 'k-01',
    title: 'Be — The Starting Point (Philosophy & Grounding)',
    category: 'foundational',
    summary: 'The foundational meUus text outlining the movement from "I do not know where to start" to structured human understanding, personal responsibility, and collective progress.',
    authorOrSource: 'meUus Canonical Archive / Md. Mahady Hasan',
    evidenceLevel: 'Foundational Text (v0.8+)',
    reviewStatus: 'VERIFIED',
    reviewNote: 'Canonical core text approved in ecosystem baseline.',
    readTime: '6 min read',
    content: `meUus begins with one simple premise: You do not need to understand a giant platform before taking your first step. Whether you have an idea, a heavy burden, a practical skill, or total uncertainty, the first duty of a human system is to provide a gentle, truthful mirror. We move from me (self-understanding) through U (connection with another, a tool, or knowledge) to us (collective resilience and shared growth).`
  },
  {
    id: 'k-02',
    title: 'Knowledge Before Action & Listen Before Knowledge',
    category: 'foundational',
    summary: 'The classical epistemological principle: real progress requires deep listening first, sound understanding second, disciplined reflection third, and truthful action fourth.',
    authorOrSource: 'Classical Ethics & meUus Human Growth Operating Loop',
    evidenceLevel: 'Philosophical Principle',
    reviewStatus: 'VERIFIED',
    reviewNote: 'Fundamental ecosystem governance guideline.',
    readTime: '4 min read',
    content: `When action precedes knowledge, well-intentioned efforts often generate harm. By anchoring our loop in Listen → Understand → Learn → Reflect → Choose → Act, meUus safeguards individuals from hasty commitments and preserves Claim ≤ Evidence at every juncture.`
  },
  {
    id: 'k-03',
    title: 'Quranic Reflections on Human Development (Surah Al-Asr & Al-Inshirah)',
    category: 'quran',
    summary: 'Developmental reflections on time, patience, mutual encouragement toward truth, and the structural promise that with every hardship comes ease.',
    authorOrSource: 'Quranic Classical Exegesis (Tafsir Ibn Kathir, Ma\'ariful Quran, Tafsir Al-Tabari)',
    evidenceLevel: 'Textual Translation & Traditional Commentary Index',
    reviewStatus: 'REVIEW_IN_PROGRESS',
    reviewNote: CANONICAL_REVIEW_NOTE,
    readTime: '8 min read',
    content: `Surah Al-Asr articulates the four pillars of human safeguarding: Faith (firm conviction), Righteous Action (consistent constructive deeds), Mutual Counsel in Truth (collective honesty), and Mutual Counsel in Patience (perseverance in times of trial). Surah Al-Inshirah reminds us of developmental relief: hardship does not stand alone—it is intrinsically paired with expansion and ease.`
  },
  {
    id: 'k-04',
    title: 'Seerah Study: The Hilf al-Fudul (Pact of the Virtuous)',
    category: 'seerah',
    summary: 'The historical civic alliance formed in pre-Islamic Mecca to defend the rights of the oppressed and ensure commercial justice for any traveler or trader.',
    authorOrSource: 'Sirah Ibn Hisham & Ar-Raheeq Al-Makhtum',
    evidenceLevel: 'Historical Authentic Transmission',
    reviewStatus: 'REVIEW_IN_PROGRESS',
    reviewNote: CANONICAL_REVIEW_NOTE,
    readTime: '7 min read',
    content: `Before the prophetic mission, the Prophet (ﷺ) participated in Hilf al-Fudul, a civil compact where leaders pledged that no person—local or foreigner—would be wronged within Mecca without people standing to assist them until justice was restored. This serves as the historic model for the meUus Legal Hub and mutual human protection.`
  },
  {
    id: 'k-05',
    title: 'SME Formalization in Bangladesh: Trade License, TIN, and BIN',
    category: 'sme',
    summary: 'A step-by-step practical manual for registering a micro-enterprise with local Union Parishad or City Corporation, obtaining e-TIN from NBR, and VAT registration.',
    authorOrSource: 'National Board of Revenue & Local Government Division Guidelines',
    evidenceLevel: 'Statutory Regulations 2024-2026',
    reviewStatus: 'REVIEW_IN_PROGRESS',
    reviewNote: CANONICAL_REVIEW_NOTE,
    readTime: '10 min read',
    content: `To formalize an enterprise in Bangladesh:
1. Trade License: Issued by respective City Corporation / Pourashava / Union Parishad based on business classification.
2. e-TIN: 12-digit Tax Identification Number generated online at NBR portal.
3. VAT / BIN: Business Identification Number mandatory for commercial invoicing.
4. Current Bank Account: Requires Trade License, TIN, and proprietor NID.`
  },
  {
    id: 'k-06',
    title: 'Emotional Balance & Non-Clinical Reflection Toolkit',
    category: 'developmental',
    summary: 'Practical cognitive tools for processing acute anxiety, identifying emotional triggers, and establishing supportive daily routines without clinical over-medicalization.',
    authorOrSource: 'Mind Beautifier Literacy Protocol',
    evidenceLevel: 'Psycho-educational Literature',
    reviewStatus: 'REVIEW_IN_PROGRESS',
    reviewNote: CANONICAL_REVIEW_NOTE,
    readTime: '5 min read',
    content: `Emotional balance begins by recognizing that feelings are valid data, but not immutable conclusions. The 4-step Pause method: 1. Name the sensation without judgment. 2. Regulate breath (4-second inhale, 6-second exhale). 3. Identify what is within your direct control right now. 4. Take one small honest action.`
  }
];

export const SAMPLE_MARKETPLACE_ITEMS: MarketplaceEntity[] = [
  {
    id: 'm-01',
    type: 'CAPACITY',
    title: 'Web & Mobile Frontend Development (React / Tailwind)',
    description: 'Offering 3 years of hands-on web development experience. Available for SME website builds, responsive UI design, and local digital storefronts.',
    providerName: 'Tanvir Ahmed',
    district: 'Dhaka',
    pillarId: 'unemployment-buster',
    pricingOrTerms: 'Project-based / Affordable SME rates',
    status: 'PUBLISHED',
    verificationLevel: 'Portfolio & Identity Verified',
    createdAt: '2026-08-15'
  },
  {
    id: 'm-02',
    type: 'NEED',
    title: 'Legal Guidance for Partnership Agreement & Trade License',
    description: 'Starting a small agro-processing unit in Bogura with two co-founders. Need assistance drafting an equitable partnership deed and securing licensing.',
    providerName: 'Rafiqul Islam',
    district: 'Bogura',
    pillarId: 'legal-hub',
    pricingOrTerms: 'Budget: BDT 5,000 - 10,000',
    status: 'PUBLISHED',
    verificationLevel: 'National ID Verified',
    createdAt: '2026-08-16'
  },
  {
    id: 'm-03',
    type: 'SERVICE',
    title: 'SME Accounting & Tax Return Filing Support',
    description: 'Certified Income Tax Practitioner (ITP) assisting micro and small businesses with annual tax submissions, bookkeeping setup, and NBR compliance.',
    providerName: 'Nusrat Jahan, ITP',
    district: 'Chittagong',
    pillarId: 'business-hub',
    pricingOrTerms: 'BDT 2,500 per annual filing',
    status: 'PILOT',
    verificationLevel: 'Professional Certificate on Record',
    createdAt: '2026-08-14'
  },
  {
    id: 'm-04',
    type: 'RESOURCE',
    title: '2.5 Bigha Unused Agricultural Land for Organic Farming Pilot',
    description: 'Owner looking for a serious young agricultural entrepreneur or co-op to establish an organic vegetable or poultry initiative on an equitable profit-share model.',
    providerName: 'Kazi M. Rahman',
    district: 'Mymensingh',
    pillarId: 'green-solutions',
    pricingOrTerms: 'Revenue / Crop Share (No upfront rent for year 1)',
    status: 'PUBLISHED',
    verificationLevel: 'Land Ownership Documents Verified',
    createdAt: '2026-08-12'
  }
];

export const INITIAL_JOURNEY_TASKS: JourneyTask[] = [
  {
    id: 't-01',
    dayNumber: 1,
    phase: 'Understand',
    title: 'Define Your Current Reality in One Sentence',
    description: 'Write down exactly what is happening in your life or work right now without exaggeration or self-judgment.',
    isCompleted: true,
    notes: 'Grounding step completed.'
  },
  {
    id: 't-02',
    dayNumber: 2,
    phase: 'Understand',
    title: 'Create or Update Your Master Soul Profile',
    description: 'Document your real skills, one immediate need, and one capacity you can offer to another person.',
    isCompleted: true,
    notes: 'Master Soul initialized.'
  },
  {
    id: 't-03',
    dayNumber: 3,
    phase: 'Learn',
    title: 'Read One Foundational Knowledge Module',
    description: 'Study "Be — The Starting Point" or an SME/Legal guide relevant to your immediate direction.',
    isCompleted: false
  },
  {
    id: 't-04',
    dayNumber: 4,
    phase: 'Reflect',
    title: 'Complete a 5-Minute DLAS Reflection Check-in',
    description: 'Use the Development Lens and Assessment System to inspect individual, livelihood, or relationship harmony.',
    isCompleted: false
  },
  {
    id: 't-05',
    dayNumber: 5,
    phase: 'Act',
    title: 'Take One Concrete Practical Action',
    description: 'Submit one service request, post one capacity on the marketplace, or complete one task checklist.',
    isCompleted: false
  },
  {
    id: 't-06',
    dayNumber: 6,
    phase: 'Act',
    title: 'Record Truthful Evidence of the Outcome',
    description: 'Document what happened, what failed, and what succeeded under Claim ≤ Evidence discipline.',
    isCompleted: false
  },
  {
    id: 't-07',
    dayNumber: 7,
    phase: 'Act',
    title: '7-Day Review & Calibration',
    description: 'Review your 7-day loop with meYoo or an accountability peer and plan the next weekly sprint.',
    isCompleted: false
  }
];

export const ROADMAP = [
  {
    phase: 'Phase 01',
    period: 'Sept 2026 · Verified',
    title: 'The Starting Point Foundation',
    status: 'COMPLETE',
    items: [
      '✓ 45 Production Components Live (tsc exit 0)',
      '✓ Universal Start Door & Master Soul Profile Manager',
      '✓ DLAS 4-Tier Longitudinal Assessment Engine',
      '✓ Two-Way Need-Capacity Marketplace (64 Districts)',
      '✓ Career Skill Graph + Evidence Portfolio + CV Export',
      '✓ Offline-First PWA (Service Worker + IndexedDB)',
      '✓ 4-7-8 Breathing Pacer + Web Audio Ambient Synth',
      '✓ Self-Building Dynamic Tool Compiler'
    ]
  },
  {
    phase: 'Phase 02',
    period: '2026 - 2027',
    title: 'Verified Network & Cloud Sync',
    status: 'IN_PROGRESS',
    items: [
      'Firebase Auth + Secure Multi-Device Cloud Profile Sync',
      'Verified SME & Legal Referral Network (Pilot Dhaka)',
      'Peer Accountability Groups with Progress Tracking',
      'Educational Skill Accelerator (DLAS-Linked 30-Day Paths)',
      'Real Marketplace Transaction & Messaging Layer',
      'Mobile App (Flutter) Beta for Android'
    ]
  },
  {
    phase: 'Phase 03',
    period: '2027 - 2028',
    title: 'Institutional Integration',
    status: 'PLANNED',
    items: [
      '64-District Community Network Integration',
      'Formal Enterprise Trade & Supply Chains',
      'Decentralized Dispute & Legal Mediation System',
      'Sustainable Farming & Agricultural Resource Exchange',
      'Multi-Language Bengali Typography Full Support'
    ]
  },
  {
    phase: 'Phase 04',
    period: '2028 - 2030',
    title: 'Resilient National Ecosystem',
    status: 'VISION',
    items: [
      'Universal Human Development Standard (meUus Protocol)',
      'Full Economic & Healthcare Safety Net Layer',
      'Decentralized Community Self-Sufficiency',
      'Zero Abandonment: No Citizen of Bangladesh Left Behind'
    ]
  }
];

