export type DomainRole = 'understand' | 'learn' | 'reflect-act' | 'archive';

export interface EcosystemDomain {
  id: string;
  name: string;
  url: string;
  role: DomainRole;
  tagline: string;
  description: string;
  status: 'LIVE' | 'PILOT' | 'DEMO' | 'MANUAL' | 'IN REVIEW' | 'COMING LATER';
  primaryFunctions: string[];
}

export type CapabilityStatus = 
  | 'LIVE' 
  | 'PILOT' 
  | 'DEMO' 
  | 'MANUAL' 
  | 'IN REVIEW' 
  | 'COMING LATER' 
  | 'PRIVATE' 
  | 'PAUSED' 
  | 'UNAVAILABLE';

export interface PillarCapability {
  name: string;
  mode: 'Knowledge' | 'Manual Service' | 'Digital / Pilot' | 'Professional' | 'AI Assist' | 'Autonomous AI';
  status: CapabilityStatus;
  evidenceNote: string;
}

export interface Pillar {
  id: string;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  color: string;
  leadQuote?: string;
  capabilities: PillarCapability[];
  features: string[];
  reviewStatus: string;
}

export type VisibilityLevel = 
  | 'PRIVATE' 
  | 'SELECTIVE' 
  | 'CONNECTED' 
  | 'TEAM' 
  | 'PROFESSIONAL' 
  | 'PUBLIC';

export interface SoulBusinessLink {
  id: string;
  name: string;
  category: string;
  role: string;
  services: string[];
  products: string[];
  status: 'LIVE' | 'PILOT' | 'IN REVIEW';
}

export interface SoulProfile {
  id: string;
  fullName: string;
  oneLineStatement: string;
  district: string;
  bio: string;
  skills: string[];
  needs: string[];
  capacities: string[];
  goals: string[];
  visibility: Record<string, VisibilityLevel>;
  businesses: SoulBusinessLink[];
  projects: string[];
  createdAt: string;
  lastUpdated: string;
}

export interface DLASReflection {
  id: string;
  lensCategory: 'individual' | 'relationship' | 'family' | 'livelihood' | 'purpose';
  lensTitle: string;
  prompt: string;
  reflectionText: string;
  actionStep: string;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  longitudinalStep?: 'ASSESS' | 'UNDERSTAND' | 'PLAN' | 'ACT' | 'MEASURE' | 'REFLECT' | 'REASSESS' | 'GROW';
}

export interface KnowledgeItem {
  id: string;
  title: string;
  category: 'foundational' | 'developmental' | 'quran' | 'seerah' | 'legal' | 'sme' | 'recovery';
  summary: string;
  authorOrSource: string;
  evidenceLevel: string;
  reviewStatus: 'VERIFIED' | 'REVIEW_IN_PROGRESS' | 'SOURCE_INDEXED';
  reviewNote: string;
  readTime: string;
  content: string;
}

export interface MarketplaceEntity {
  id: string;
  type: 'NEED' | 'CAPACITY' | 'SERVICE' | 'PRODUCT' | 'PROJECT' | 'RESOURCE';
  title: string;
  description: string;
  providerName: string;
  district: string;
  pillarId: string;
  pricingOrTerms: string;
  status: 'PUBLISHED' | 'NEEDS REVIEW' | 'NEEDS EVIDENCE' | 'PILOT';
  verificationLevel: string;
  createdAt: string;
}

export interface JourneyTask {
  id: string;
  dayNumber: number;
  phase: 'Understand' | 'Learn' | 'Reflect' | 'Act';
  title: string;
  description: string;
  isCompleted: boolean;
  notes?: string;
}
