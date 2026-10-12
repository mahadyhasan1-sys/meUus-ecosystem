import {
  type ActionState,
  type ActionStep,
  type AlgorithmRun,
  type ApprovalLevel,
  type CapabilityDefinition,
  type CapabilityStatus,
  type DomainRoute,
  type EvidenceItem,
  type PillarRoute,
  type VerificationResult,
  createKernel,
  type EcosystemAlgorithmKernel,
} from './kernel';

export type JourneyLocale = 'en' | 'bn';
export type JourneyContinuationChoice = 'DID_IT' | 'NOT_DONE' | 'DOES_NOT_FIT' | 'DIFFERENT_DIRECTION';

export interface HumanJourneyResult {
  locale: JourneyLocale;
  statement: string;
  whatHeard: string;
  direction: string;
  capability: string;
  capabilityStatus: CapabilityStatus;
  oneNextStep: string;
  approval: ApprovalLevel;
  why: string;
  route: DomainRoute;
  pillar?: PillarRoute;
  action: ActionStep;
  runId: string;
}

export interface HumanJourneySession {
  kernel: EcosystemAlgorithmKernel;
  runId: string;
  actionId: string;
  initial: HumanJourneyResult;
}

export interface HumanJourneyContinuation {
  choice: JourneyContinuationChoice;
  verification: VerificationResult;
  nextStep: string;
  status: string;
  requiresReview: boolean;
  restartRecommended: boolean;
  auditEventNames: string[];
}

const isBangla = (text: string): boolean => /[\u0980-\u09FF]/.test(text);
const localeOf = (text: string, preferred?: JourneyLocale): JourneyLocale => preferred ?? (isBangla(text) ? 'bn' : 'en');
const normalized = (text: string): string => text.toLowerCase();

type DirectionProfile = {
  label: Record<JourneyLocale, string>;
  capabilityId: 'LEARN' | 'NINE_PILLARS' | 'JOURNEY' | 'PROFESSIONAL_REVIEW';
  approval: ApprovalLevel;
  next: Record<JourneyLocale, string>;
  capability: Record<JourneyLocale, string>;
  why: Record<JourneyLocale, string>;
};

const profileFor = (statement: string): DirectionProfile => {
  const value = normalized(statement);
  if (/(medical|health|crisis|diagnos|treatment|চিকিৎসা|জরুরি|রোগ নির্ণয়|রোগ নির্ণয়)/.test(value)) return {
    label: { en: 'Professional review required', bn: 'পেশাগত পর্যালোচনা প্রয়োজন' },
    capabilityId: 'PROFESSIONAL_REVIEW', approval: 'L5',
    next: { en: 'Pause here and seek the appropriate qualified or emergency support for your situation.', bn: 'এখানে থামুন এবং আপনার পরিস্থিতির জন্য উপযুক্ত যোগ্য বা জরুরি সহায়তা নিন।' },
    capability: { en: 'This local journey cannot diagnose, treat, or make a professional decision.', bn: 'এই স্থানীয় যাত্রা রোগ নির্ণয়, চিকিৎসা বা পেশাগত সিদ্ধান্ত দিতে পারে না।' },
    why: { en: 'Your statement may require qualified authority, so this slice must not automate a decision.', bn: 'আপনার কথাটির জন্য যোগ্য কর্তৃত্ব লাগতে পারে, তাই এই অংশ কোনো সিদ্ধান্ত স্বয়ংক্রিয় করতে পারে না।' },
  };
  if (/(legal advice|legal decision|আইনি পরামর্শ|আইনি সিদ্ধান্ত)/.test(value)) return {
    label: { en: 'Professional legal review required', bn: 'পেশাগত আইনগত পর্যালোচনা প্রয়োজন' },
    capabilityId: 'PROFESSIONAL_REVIEW', approval: 'L5',
    next: { en: 'Pause here and seek qualified legal help for consequential advice or action.', bn: 'এখানে থামুন এবং গুরুত্বপূর্ণ পরামর্শ বা পদক্ষেপের জন্য যোগ্য আইনগত সহায়তা নিন।' },
    capability: { en: 'This local journey can offer awareness only; it cannot make a legal decision.', bn: 'এই স্থানীয় যাত্রা শুধু সচেতনতা দিতে পারে; এটি আইনগত সিদ্ধান্ত দিতে পারে না।' },
    why: { en: 'A consequential legal decision requires qualified human authority.', bn: 'গুরুত্বপূর্ণ আইনগত সিদ্ধান্তের জন্য যোগ্য মানব কর্তৃত্ব প্রয়োজন।' },
  };
  if (/(legal|law|rights|আইন|আইনি)/.test(value)) return {
    label: { en: 'Legal awareness / Legal Hub', bn: 'আইনি সচেতনতা / লিগ্যাল হাব' },
    capabilityId: 'NINE_PILLARS', approval: 'L1',
    next: { en: 'Write one factual legal question you need to understand, then read a verified learning source before acting.', bn: 'আপনার বোঝার প্রয়োজন এমন একটি তথ্যভিত্তিক আইনি প্রশ্ন লিখুন, তারপর কোনো পদক্ষেপের আগে যাচাইকৃত শেখার উৎস পড়ুন।' },
    capability: { en: 'Learning and awareness guidance only. Qualified legal help is required for consequential advice or action.', bn: 'শুধু শেখা ও সচেতনতার দিকনির্দেশনা। গুরুত্বপূর্ণ পরামর্শ বা পদক্ষেপের জন্য যোগ্য আইনগত সহায়তা প্রয়োজন।' },
    why: { en: 'Your statement asks to understand an issue; this slice can support awareness, not legal advice.', bn: 'আপনার কথাটি একটি বিষয় বোঝার প্রয়োজন দেখায়; এই অংশ সচেতনতা দিতে পারে, আইনগত পরামর্শ নয়।' },
  };
  if (/(job|work|unemploy|earning|কাজ|চাকরি|আয়|আয়)/.test(value)) return {
    label: { en: 'Unemployment Buster / Work & earning', bn: 'আনএমপ্লয়মেন্ট বাস্টার / কাজ ও আয়' },
    capabilityId: 'NINE_PILLARS', approval: 'L1',
    next: { en: 'Write the three skills you can offer now and choose the strongest one to test today.', bn: 'এখন আপনি যে তিনটি দক্ষতা দিতে পারেন তা লিখুন এবং আজ পরীক্ষা করার জন্য সবচেয়ে শক্তিশালী একটি বেছে নিন।' },
    capability: { en: 'Guidance and planning are available. Live marketplace matching is not yet proven as available.', bn: 'দিকনির্দেশনা ও পরিকল্পনা পাওয়া যায়। লাইভ মার্কেটপ্লেস মিলিয়ে দেওয়ার সুবিধা এখনো প্রমাণিত নয়।' },
    why: { en: 'Your statement points to work direction. The current safe capability is preparation, not a job guarantee.', bn: 'আপনার কথাটি কাজের দিকনির্দেশনা চায়। বর্তমান নিরাপদ সক্ষমতা হলো প্রস্তুতি, চাকরির নিশ্চয়তা নয়।' },
  };
  if (/(communicat|professional|যোগাযোগ|পেশা)/.test(value)) return {
    label: { en: 'Learn / Professional communication', bn: 'শেখা / পেশাগত যোগাযোগ' },
    capabilityId: 'LEARN', approval: 'L1',
    next: { en: 'Choose one conversation today and write one clear opening sentence before you begin.', bn: 'আজকের একটি কথোপকথন বেছে নিন এবং শুরু করার আগে একটি স্পষ্ট প্রথম বাক্য লিখুন।' },
    capability: { en: 'Learning guidance is available now.', bn: 'শেখার দিকনির্দেশনা এখন পাওয়া যায়।' },
    why: { en: 'Your statement names a skill that can be practiced through bounded learning.', bn: 'আপনার কথাটি এমন একটি দক্ষতার কথা বলছে যা সীমিত শেখার মাধ্যমে অনুশীলন করা যায়।' },
  };
  if (/(don.t know|uncertain|what to do|next|কী করব|কি করব|বুঝতে পারছি না|দিকনির্দেশ)/.test(value)) return {
    label: { en: 'Reflect / Journey', bn: 'ভাবনা / যাত্রা' },
    capabilityId: 'JOURNEY', approval: 'L2',
    next: { en: 'Write one small thing that feels most important to understand today.', bn: 'আজ যে একটি ছোট বিষয় বোঝা সবচেয়ে জরুরি মনে হচ্ছে তা লিখুন।' },
    capability: { en: 'A local reflection journey is available for this test session only.', bn: 'শুধু এই পরীক্ষামূলক সেশনের জন্য একটি স্থানীয় ভাবনা-যাত্রা পাওয়া যায়।' },
    why: { en: 'Your statement asks for direction, so a reflection-first step is safer than assuming an answer.', bn: 'আপনার কথাটি দিকনির্দেশনা চায়, তাই উত্তর ধরে নেওয়ার চেয়ে ভাবনা দিয়ে শুরু করা নিরাপদ।' },
  };
  return {
    label: { en: 'Learn', bn: 'শেখা' }, capabilityId: 'LEARN', approval: 'L1',
    next: { en: 'Name one part of this situation you want to understand first.', bn: 'এই পরিস্থিতির কোন একটি অংশ আপনি আগে বুঝতে চান তা লিখুন।' },
    capability: { en: 'Bounded learning guidance is available now.', bn: 'সীমিত শেখার দিকনির্দেশনা এখন পাওয়া যায়।' },
    why: { en: 'There is not enough evidence to assume more than a learning-first direction.', bn: 'শেখা দিয়ে শুরু করার চেয়ে বেশি কিছু ধরে নেওয়ার যথেষ্ট প্রমাণ নেই।' },
  };
};

const advanceToOneNextStep = (kernel: EcosystemAlgorithmKernel, runId: string): AlgorithmRun => {
  for (const fastState of ['INTENTION', 'REALITY', 'NEED_CAPACITY', 'ONE_DIRECTION', 'ONE_NEXT_STEP'] as const) kernel.advanceStartingPoint(runId, `Human journey advanced to ${fastState}.`);
  return kernel.getCurrentState(runId);
};

export const startHumanJourney = (statement: string, preferredLocale?: JourneyLocale, kernel = createKernel()): HumanJourneySession => {
  const trimmed = statement.trim();
  if (!trimmed) throw new Error('A word or sentence is required to begin.');
  const locale = localeOf(trimmed, preferredLocale);
  const run = kernel.createRun({ intent: trimmed, mode: 'STARTING_POINT', context: { locale } });
  advanceToOneNextStep(kernel, run.id);
  const current = kernel.getCurrentState(run.id);
  const profile = profileFor(trimmed);
  const pillar = kernel.recommendPillar(trimmed);
  const capability = kernel.capabilities.get(profile.capabilityId) as CapabilityDefinition;
  const action = kernel.requestAction(run.id, {
    capabilityId: profile.capabilityId,
    description: profile.next[locale],
    risk: 'LOW',
    approvalLevel: profile.approval,
    expectedResult: 'The person reports what happened with their self-owned local next step.',
  });
  const route = current.route ?? kernel.routeIntent(trimmed);
  const initial: HumanJourneyResult = {
    locale, statement: trimmed,
    whatHeard: locale === 'bn' ? `আপনি বলেছেন: “${trimmed}”` : `You said: “${trimmed}”`,
    direction: profile.label[locale], capability: profile.capability[locale], capabilityStatus: capability.status,
    oneNextStep: profile.next[locale], approval: profile.approval, why: profile.why[locale], route, pillar, action, runId: run.id,
  };
  return { kernel, runId: run.id, actionId: action.id, initial };
};

const advanceForContinuation = (session: HumanJourneySession): void => {
  const run = session.kernel.getCurrentState(session.runId);
  if (run.startingPointState === 'ONE_NEXT_STEP') session.kernel.advanceStartingPoint(session.runId, 'The person selected a local continuation outcome.');
  if (session.kernel.getCurrentState(session.runId).startingPointState === 'ACTION') session.kernel.advanceStartingPoint(session.runId, 'The person supplied a local result or reflection.');
};

export const continueHumanJourney = (session: HumanJourneySession, choice: JourneyContinuationChoice, evidenceText = ''): HumanJourneyContinuation => {
  advanceForContinuation(session);
  const locale = session.initial.locale;
  const observed = evidenceText.trim() || (choice === 'DID_IT'
    ? (locale === 'bn' ? 'ব্যক্তি বলেছেন যে ধাপটি করেছেন; স্বাধীনভাবে যাচাই করা হয়নি।' : 'The person reported doing the step; it was not independently verified.')
    : choice === 'NOT_DONE'
      ? (locale === 'bn' ? 'ব্যক্তি বলেছেন যে ধাপটি এখনো করা হয়নি।' : 'The person reported that the step has not been completed.')
      : choice === 'DOES_NOT_FIT'
        ? (locale === 'bn' ? 'ব্যক্তি বলেছেন যে ধাপটি উপযুক্ত নয়।' : 'The person reported that the step does not fit.')
        : (locale === 'bn' ? 'ব্যক্তি ভিন্ন দিক চেয়েছেন।' : 'The person requested a different direction.'));
  session.kernel.recordContinuationEvent(session.runId, { outcome: choice, detail: observed });
  const evidence: EvidenceItem = {
    id: `user-result-${session.runId}`, timestamp: new Date().toISOString(), status: 'REPORTED', provenance: ['R60A local test journey'],
    sourceType: 'user_statement', reference: observed, evidenceStatus: 'REPORTED_CLAIM', contradictionRefs: [],
  };
  const verification = session.kernel.verifyAction(session.runId, session.actionId, {
    expected: session.initial.action.expectedResult, observed, observedMatchesExpected: false, evidence: [evidence],
  });
  session.kernel.reviewRun(session.runId);
  const run = session.kernel.getCurrentState(session.runId);
  if (run.startingPointState === 'EVIDENCE') session.kernel.advanceStartingPoint(session.runId, 'Review the reported local result without claiming independent verification.');
  if (session.kernel.getCurrentState(session.runId).startingPointState === 'LEARN') session.kernel.advanceStartingPoint(session.runId, 'Continue after a bounded review.');
  const continuation = session.kernel.continueRun(session.runId);
  const copy = locale === 'bn'
    ? {
      DID_IT: ['আপনার বলা ফলাফলটি স্থানীয়ভাবে নথিবদ্ধ হয়েছে; এটি স্বাধীনভাবে যাচাই করা হয়নি।', 'একটি ছোট পরবর্তী পদক্ষেপ বেছে নেওয়ার আগে কী শিখলেন তা লিখুন।'],
      NOT_DONE: ['কোনো সাফল্য দাবি করা হয়নি। ধাপটি স্থানীয়ভাবে অসম্পূর্ণ হিসেবে নথিবদ্ধ হয়েছে।', 'একই ধাপটি রাখুন বা এটিকে আরও ছোট করুন।'],
      DOES_NOT_FIT: ['ধাপটি উপযুক্ত নয় বলে নথিবদ্ধ হয়েছে।', 'ভাবনা দিয়ে শুরু করুন: আজ কোন একটি বিষয় আগে পরিষ্কার করতে চান?'],
      DIFFERENT_DIRECTION: ['আপনি ভিন্ন দিক চেয়েছেন; আগের ধাপটি সম্পন্ন হিসেবে চিহ্নিত হয়নি।', 'নতুন একটি শব্দ বা বাক্য দিয়ে আবার শুরু করুন।'],
    }
    : {
      DID_IT: ['Your reported result is recorded locally; it has not been independently verified.', 'Write what you learned before choosing one small follow-up step.'],
      NOT_DONE: ['No success is claimed. The step is recorded locally as not yet completed.', 'Keep the same step or make it smaller.'],
      DOES_NOT_FIT: ['The step is recorded as not fitting.', 'Reflect first: what is one thing you need to clarify today?'],
      DIFFERENT_DIRECTION: ['You asked for a different direction; the earlier step is not marked complete.', 'Start again with one new word or sentence.'],
    };
  return {
    choice, verification, status: copy[choice][0], nextStep: copy[choice][1], requiresReview: continuation.outcome === 'REVIEW_REQUIRED',
    restartRecommended: choice === 'DIFFERENT_DIRECTION', auditEventNames: session.kernel.exportAudit(session.runId).map(event => event.kind),
  };
};

export const approvalBoundary = (state: ActionState, locale: JourneyLocale): string | undefined => {
  if (state === 'AWAITING_CONFIRMATION') return locale === 'bn'
    ? 'নিশ্চিতকরণ ছাড়া কোনো পদক্ষেপ এগোবে না।'
    : 'No action can continue without explicit confirmation.';
  if (state === 'RESTRICTED') return locale === 'bn'
    ? 'এই বিষয়টি সীমাবদ্ধ; স্থানীয় যাত্রা কোনো পেশাগত সিদ্ধান্ত বা বাহ্যিক পদক্ষেপ নেবে না।'
    : 'This is restricted; the local journey will not make a professional decision or external action.';
  return undefined;
};
