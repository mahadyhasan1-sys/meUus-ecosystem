/**
 * meUus Ecosystem Algorithm Kernel v1
 *
 * Framework-independent, local-only, and intentionally adapter-safe. It
 * models governed decisions; it does not activate remote services.
 */

export type ISODate = string;
export type EvidenceStatus = 'VERIFIED_FACT' | 'REPORTED_CLAIM' | 'INFERENCE' | 'UNKNOWN' | 'HISTORICAL' | 'SUPERSEDED' | 'REVIEW_PENDING';
export type CapabilityStatus = 'LIVE_BOUNDED' | 'LOCAL_ONLY' | 'REVIEW_PENDING' | 'EVIDENCE_REQUIRED' | 'UNAVAILABLE' | 'FUTURE';
export type RiskLevel = 'LOW' | 'MODERATE' | 'CONSEQUENTIAL' | 'RESTRICTED';
export type ApprovalLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
export type PermissionStatus = 'ALLOWED' | 'DENIED' | 'AWAITING_CONFIRMATION' | 'RESTRICTED';
export type ActionState = 'PROPOSED' | 'PREPARED' | 'AWAITING_CONFIRMATION' | 'AUTHORIZED' | 'EXECUTING' | 'SUCCEEDED' | 'FAILED' | 'VERIFIED' | 'REVIEW_REQUIRED' | 'PAUSED' | 'CANCELLED' | 'RESTRICTED';
export type VerificationStatus = 'PASS' | 'FAIL' | 'PARTIAL' | 'UNKNOWN';
export type MemoryClass = 'CONVERSATION' | 'PREFERENCE' | 'GOAL' | 'PROGRESS' | 'STRUCTURED_PROFILE' | 'RELATIONSHIP' | 'PROJECT' | 'SERVICE' | 'KNOWLEDGE_INTERACTION';
export type MemoryTier = 'short_term' | 'long_term' | 'structured' | 'episodic' | 'preference' | 'goal' | 'progress';

export type HumanGrowthState = 'START' | 'EXPRESS' | 'OBSERVE' | 'UNDERSTAND' | 'LEARN' | 'REFLECT' | 'REASON' | 'CHOOSE' | 'PLAN' | 'ACT' | 'VERIFY' | 'REVIEW' | 'REMEMBER' | 'ADAPT' | 'CONTINUE';
export type StartingPointState = 'ME' | 'INTENTION' | 'REALITY' | 'NEED_CAPACITY' | 'ONE_DIRECTION' | 'ONE_NEXT_STEP' | 'ACTION' | 'EVIDENCE' | 'LEARN' | 'CONTINUE';
export type Surface = 'UNDERSTAND' | 'LEARN' | 'REFLECT_ACT' | 'FOUNDER';

export interface BaseRecord { id: string; timestamp: ISODate; status: string; provenance: string[]; }
export interface HumanIntent extends BaseRecord { text: string; requestedOutcome?: string; sensitivity?: 'ordinary' | 'personal' | 'high_risk'; }
export interface HumanContext extends BaseRecord { locale?: string; statedReality?: string; constraints?: string[]; }
export interface SoulContext extends BaseRecord { humanContextId: string; reflectionEnabled: boolean; profileRetentionAllowed: boolean; }
export interface Need extends BaseRecord { category: string; statement: string; risk: RiskLevel; }
export interface Capacity extends BaseRecord { statement: string; evidenceRefs: string[]; }
export interface Goal extends BaseRecord { statement: string; evidenceRefs: string[]; }
export interface EvidenceItem extends BaseRecord { sourceType: 'user_statement' | 'local_fixture' | 'public_page' | 'document' | 'professional' | 'unknown'; reference: string; evidenceStatus: EvidenceStatus; contradictionRefs: string[]; }
export interface Claim extends BaseRecord { statement: string; evidenceRefs: string[]; evidenceStatus: EvidenceStatus; contradictionRefs: string[]; lastUpdated: ISODate; }
export interface KnowledgeReference extends BaseRecord { title: string; href?: string; evidenceStatus: EvidenceStatus; }
export interface Reflection extends BaseRecord { prompt: string; response?: string; nonDiagnostic: true; }
export interface ReasoningOption extends BaseRecord { label: string; benefits: string[]; limits: string[]; risk: RiskLevel; }
export interface Choice extends BaseRecord { optionId: string; reason: string; reversible: boolean; }
export interface Plan extends BaseRecord { goalId?: string; actionIds: string[]; }
export interface ActionResult extends BaseRecord { actionId: string; observed: string; success: boolean; adapter: string; }
export interface VerificationResult extends BaseRecord { actionId: string; expected: string; observed: string; status: VerificationStatus; evidenceRefs: string[]; nextStep: string; }
export interface ReviewResult extends BaseRecord { summary: string; requiresHumanReview: boolean; }
export interface MemoryItem extends BaseRecord { memoryClass: MemoryClass; tier: MemoryTier; purpose: string; content: string; sensitive: boolean; retentionDecision: 'RETAIN_LOCAL' | 'DO_NOT_RETAIN' | 'FORGET'; }
export interface ContinuationState extends BaseRecord { outcome: 'CONTINUE' | 'PAUSED' | 'STOPPED' | 'REVIEW_REQUIRED'; blocker?: string; nextStep?: string; }

export interface PermissionDecision extends BaseRecord { approvalLevel: ApprovalLevel; status: PermissionStatus; reason: string; humanConfirmationRequired: boolean; adapterAvailable: boolean; }
export interface ToolDescriptor { id: string; purpose: string; localOnly: boolean; allowed: boolean; prohibitedActions: string[]; }
export interface AgentDescriptor { id: string; family: 'UNDERSTANDING_REFLECTION' | 'PLANNING' | 'OPERATIONS' | 'KNOWLEDGE_INTELLIGENCE' | 'GOVERNANCE' | 'ENGINEERING'; purpose: string; allowedInputs: string[]; allowedOutputs: string[]; allowedTools: string[]; prohibitedActions: string[]; dataScope: string; memoryScope: string; approvalRequirements: ApprovalLevel; risk: RiskLevel; fallback: string; auditRequired: true; }
export interface WorkflowDescriptor { id: string; purpose: string; agentIds: string[]; requiredApproval: ApprovalLevel; localOnly: boolean; fallback: string; }

export interface CapabilityDefinition {
  id: string;
  purpose: string;
  status: CapabilityStatus;
  allowed: string[];
  prohibited: string[];
  evidenceBasis: string[];
  requiredApproval: ApprovalLevel;
  adapter: 'NONE' | 'LOCAL_MEMORY' | 'LOCAL_MOCK' | 'EXISTING_BOUNDED';
  fallback: string;
}

export interface DomainRoute { surface: Surface; domain: string; purpose: string; liveCapabilityRequired?: string; reason: string; }
export interface PillarRoute { id: string; name: string; capabilityId: string; maturity: CapabilityStatus; fallback: string; }
export interface ActionStep extends BaseRecord { capabilityId: string; description: string; risk: RiskLevel; approvalLevel: ApprovalLevel; state: ActionState; expectedResult: string; adapter: 'NONE' | 'LOCAL_MOCK'; permission: PermissionDecision; }
export interface AuditEvent extends BaseRecord { runId: string; kind: 'STATE_TRANSITION' | 'ORCHESTRATION' | 'POLICY' | 'ROUTING' | 'ACTION' | 'VERIFICATION' | 'MEMORY' | 'CONTINUATION'; from?: string; to?: string; detail: string; }
export interface AlgorithmRun extends BaseRecord { mode: 'FULL' | 'STARTING_POINT'; currentState: HumanGrowthState; startingPointState?: StartingPointState; learnVisits: number; intent: HumanIntent; context: HumanContext; needs: Need[]; capacities: Capacity[]; route?: DomainRoute; selectedCapabilityId?: string; actions: ActionStep[]; evidence: EvidenceItem[]; verifications: VerificationResult[]; reviews: ReviewResult[]; memory: MemoryItem[]; continuation?: ContinuationState; audit: AuditEvent[]; }

export interface CreateRunInput { intent: string; mode?: 'FULL' | 'STARTING_POINT'; context?: Partial<HumanContext>; sensitivity?: HumanIntent['sensitivity']; }
export interface AdvanceEvent { note?: string; capabilityId?: string; }
export interface Confirmation { confirmed: boolean; actor: string; reason?: string; }
export interface VerifyInput { expected: string; observed: string; observedMatchesExpected: boolean; evidence: EvidenceItem[]; }
export interface ContinuationEvent { outcome: 'DID_IT' | 'NOT_DONE' | 'DOES_NOT_FIT' | 'DIFFERENT_DIRECTION'; detail: string; }

const now = (): ISODate => new Date().toISOString();
let sequence = 0;
const id = (prefix: string): string => `${prefix}-${++sequence}`;
const record = <T extends Omit<BaseRecord, 'id' | 'timestamp' | 'status' | 'provenance'>>(prefix: string, value: T, status = 'ACTIVE', provenance: string[] = ['R59A local kernel']): BaseRecord & T => ({ id: id(prefix), timestamp: now(), status, provenance, ...value });

export const HUMAN_GROWTH_LOOP: readonly HumanGrowthState[] = ['START', 'EXPRESS', 'OBSERVE', 'UNDERSTAND', 'LEARN', 'REFLECT', 'REASON', 'CHOOSE', 'PLAN', 'ACT', 'VERIFY', 'REVIEW', 'LEARN', 'REMEMBER', 'ADAPT', 'CONTINUE'];
export const STARTING_POINT_LOOP: readonly StartingPointState[] = ['ME', 'INTENTION', 'REALITY', 'NEED_CAPACITY', 'ONE_DIRECTION', 'ONE_NEXT_STEP', 'ACTION', 'EVIDENCE', 'LEARN', 'CONTINUE'];

const capability = (definition: Omit<CapabilityDefinition, 'evidenceBasis'> & { evidenceBasis?: string[] }): CapabilityDefinition => ({ evidenceBasis: ['Current architecture and R59A local-only policy'], ...definition });

export const DEFAULT_CAPABILITIES: readonly CapabilityDefinition[] = [
  capability({ id: 'UNDERSTAND', purpose: 'Public orientation and truth-aware explanation.', status: 'LIVE_BOUNDED', allowed: ['route to public understanding'], prohibited: ['claim unverified public outcomes'], requiredApproval: 'L1', adapter: 'EXISTING_BOUNDED', fallback: 'Explain current bounded public truth.' }),
  capability({ id: 'LEARN', purpose: 'Structured learning and knowledge routing.', status: 'LIVE_BOUNDED', allowed: ['route to learning material'], prohibited: ['certification or guaranteed outcome claims'], requiredApproval: 'L1', adapter: 'EXISTING_BOUNDED', fallback: 'Offer a bounded learning next step.' }),
  capability({ id: 'SOUL_PROFILE', purpose: 'Personal profile context.', status: 'EVIDENCE_REQUIRED', allowed: ['local fixture context only'], prohibited: ['production profile writes'], requiredApproval: 'L4', adapter: 'NONE', fallback: 'Ask for only the context needed now.' }),
  capability({ id: 'AUTH_SESSION', purpose: 'Authenticated session.', status: 'EVIDENCE_REQUIRED', allowed: ['describe boundary'], prohibited: ['assume user identity'], requiredApproval: 'L4', adapter: 'NONE', fallback: 'Continue without identity-dependent execution.' }),
  capability({ id: 'JOURNEY', purpose: 'Reflection and bounded next-step support.', status: 'LOCAL_ONLY', allowed: ['local reflection'], prohibited: ['diagnosis or automated decisions'], requiredApproval: 'L2', adapter: 'LOCAL_MEMORY', fallback: 'Offer a one-step reflection exercise.' }),
  capability({ id: 'TASKS', purpose: 'Task workflow.', status: 'EVIDENCE_REQUIRED', allowed: ['prepare a task locally'], prohibited: ['remote task creation'], requiredApproval: 'L3', adapter: 'LOCAL_MOCK', fallback: 'Return a local prepared task only.' }),
  capability({ id: 'DLAS_LEARNING', purpose: 'Development Lens and Assessment System learning/reflection.', status: 'LIVE_BOUNDED', allowed: ['educational reflection'], prohibited: ['diagnosis, scoring, clinical judgement, life decisions'], requiredApproval: 'L2', adapter: 'EXISTING_BOUNDED', fallback: 'Route to non-diagnostic DLAS learning.' }),
  capability({ id: 'DLAS_RUNTIME', purpose: 'Automated DLAS runtime.', status: 'UNAVAILABLE', allowed: [], prohibited: ['automated assessment, human-worth scoring, professional judgement'], requiredApproval: 'L5', adapter: 'NONE', fallback: 'State that automated DLAS is unavailable.' }),
  capability({ id: 'MEYOO', purpose: 'Named assistant concept.', status: 'UNAVAILABLE', allowed: ['describe boundary'], prohibited: ['autonomous execution'], requiredApproval: 'L5', adapter: 'NONE', fallback: 'Use a non-autonomous local workflow.' }),
  capability({ id: 'AI_ASSIST', purpose: 'Bounded AI assistance.', status: 'LOCAL_ONLY', allowed: ['local fixture reasoning'], prohibited: ['unrestricted external AI or autonomous action'], requiredApproval: 'L2', adapter: 'NONE', fallback: 'Use deterministic rules and human review.' }),
  capability({ id: 'MEMORY', purpose: 'Purpose-bound local memory.', status: 'LOCAL_ONLY', allowed: ['in-memory retention with forget'], prohibited: ['production database writes or sensitive default retention'], requiredApproval: 'L2', adapter: 'LOCAL_MEMORY', fallback: 'Do not retain.' }),
  capability({ id: 'MARKETPLACE', purpose: 'Marketplace matching.', status: 'UNAVAILABLE', allowed: [], prohibited: ['fabricate providers or transactions'], requiredApproval: 'L5', adapter: 'NONE', fallback: 'Offer learning or a future-safe availability notice.' }),
  capability({ id: 'SERVICES', purpose: 'Services routing.', status: 'EVIDENCE_REQUIRED', allowed: ['learning direction'], prohibited: ['claim service availability'], requiredApproval: 'L4', adapter: 'NONE', fallback: 'State service availability is not proven.' }),
  capability({ id: 'JOBS', purpose: 'Work and employment direction.', status: 'EVIDENCE_REQUIRED', allowed: ['bounded preparation learning'], prohibited: ['guarantee work or income'], requiredApproval: 'L2', adapter: 'NONE', fallback: 'Route to employability learning.' }),
  capability({ id: 'PROJECTS', purpose: 'Project support.', status: 'LOCAL_ONLY', allowed: ['prepare a local plan'], prohibited: ['external project writes'], requiredApproval: 'L3', adapter: 'LOCAL_MOCK', fallback: 'Return a reversible local plan.' }),
  capability({ id: 'OPPORTUNITIES', purpose: 'Opportunity awareness.', status: 'REVIEW_PENDING', allowed: ['state evidence boundary'], prohibited: ['claim current listings'], requiredApproval: 'L2', adapter: 'NONE', fallback: 'Use verified public sources later.' }),
  capability({ id: 'NINE_PILLARS', purpose: 'Pillar learning directions.', status: 'LIVE_BOUNDED', allowed: ['route to a Pillar learning direction'], prohibited: ['claim nine operating institutions'], requiredApproval: 'L1', adapter: 'EXISTING_BOUNDED', fallback: 'Route to learning/status context.' }),
  capability({ id: 'HUMAN_REVIEW', purpose: 'Human review requirement.', status: 'LOCAL_ONLY', allowed: ['queue review'], prohibited: ['pretend review occurred'], requiredApproval: 'L4', adapter: 'NONE', fallback: 'Stop and request human review.' }),
  capability({ id: 'PROFESSIONAL_REVIEW', purpose: 'Qualified professional authority.', status: 'REVIEW_PENDING', allowed: ['recommend escalation'], prohibited: ['automated professional determination'], requiredApproval: 'L5', adapter: 'NONE', fallback: 'State qualified review is required.' }),
  capability({ id: 'FAITH_REVIEW', purpose: 'Religious/source review.', status: 'REVIEW_PENDING', allowed: ['route to source-aware learning'], prohibited: ['fatwa or final authority'], requiredApproval: 'L5', adapter: 'NONE', fallback: 'State religious/source review is pending.' }),
  capability({ id: 'PAYMENTS', purpose: 'Payment handling.', status: 'UNAVAILABLE', allowed: [], prohibited: ['payment creation or processing'], requiredApproval: 'L5', adapter: 'NONE', fallback: 'State payments are unavailable.' }),
  capability({ id: 'EXTERNAL_ACTION', purpose: 'External-world writes.', status: 'UNAVAILABLE', allowed: [], prohibited: ['email, deployment, database, marketplace, account, or external write'], requiredApproval: 'L5', adapter: 'NONE', fallback: 'Prepare only; do not execute.' }),
  capability({ id: 'EVIDENCE', purpose: 'Claim and evidence handling.', status: 'LOCAL_ONLY', allowed: ['local evidence evaluation'], prohibited: ['promotion beyond evidence'], requiredApproval: 'L1', adapter: 'NONE', fallback: 'Mark as unknown or review pending.' }),
  capability({ id: 'AUDIT', purpose: 'Local audit records.', status: 'LOCAL_ONLY', allowed: ['in-memory audit export'], prohibited: ['claim immutable external audit'], requiredApproval: 'L1', adapter: 'LOCAL_MEMORY', fallback: 'Export local audit only.' }),
] as const;

export const DEFAULT_AGENTS: readonly AgentDescriptor[] = [
  { id: 'understanding-reflection', family: 'UNDERSTANDING_REFLECTION', purpose: 'Clarify intent and safe reflection.', allowedInputs: ['intent', 'context'], allowedOutputs: ['reflection', 'route'], allowedTools: [], prohibitedActions: ['diagnosis', 'external execution'], dataScope: 'run-local', memoryScope: 'purpose-bound local', approvalRequirements: 'L1', risk: 'LOW', fallback: 'Ask one clarifying question.', auditRequired: true },
  { id: 'planning', family: 'PLANNING', purpose: 'Prepare reversible options and plans.', allowedInputs: ['need', 'capacity'], allowedOutputs: ['options', 'plan'], allowedTools: [], prohibitedActions: ['commit external action'], dataScope: 'run-local', memoryScope: 'goal/progress local', approvalRequirements: 'L2', risk: 'LOW', fallback: 'Offer one reversible next step.', auditRequired: true },
  { id: 'operations', family: 'OPERATIONS', purpose: 'Coordinate only permitted local actions.', allowedInputs: ['authorized action'], allowedOutputs: ['local result'], allowedTools: ['local-mock'], prohibitedActions: ['external write'], dataScope: 'run-local', memoryScope: 'none by default', approvalRequirements: 'L3', risk: 'MODERATE', fallback: 'Pause with exact adapter blocker.', auditRequired: true },
  { id: 'knowledge-intelligence', family: 'KNOWLEDGE_INTELLIGENCE', purpose: 'Route evidence-aware knowledge.', allowedInputs: ['intent', 'evidence'], allowedOutputs: ['knowledge reference'], allowedTools: [], prohibitedActions: ['invent sources'], dataScope: 'public/local fixture', memoryScope: 'knowledge interaction local', approvalRequirements: 'L1', risk: 'LOW', fallback: 'Mark evidence as unknown.', auditRequired: true },
  { id: 'governance', family: 'GOVERNANCE', purpose: 'Apply policy, review, and audit gates.', allowedInputs: ['action', 'risk'], allowedOutputs: ['permission decision'], allowedTools: [], prohibitedActions: ['auto-approve L4/L5'], dataScope: 'run-local', memoryScope: 'audit local', approvalRequirements: 'L4', risk: 'CONSEQUENTIAL', fallback: 'Await human confirmation or restrict.', auditRequired: true },
  { id: 'engineering', family: 'ENGINEERING', purpose: 'Prepare bounded technical work.', allowedInputs: ['plan'], allowedOutputs: ['prepared local action'], allowedTools: ['local-mock'], prohibitedActions: ['deployment', 'secret access', 'network write'], dataScope: 'local fixture', memoryScope: 'project local', approvalRequirements: 'L3', risk: 'MODERATE', fallback: 'Return a dry-run only.', auditRequired: true },
] as const;

export const DEFAULT_WORKFLOWS: readonly WorkflowDescriptor[] = [
  { id: 'intent-to-learning', purpose: 'Route an expressed learning need to a bounded domain/capability.', agentIds: ['understanding-reflection', 'knowledge-intelligence'], requiredApproval: 'L1', localOnly: true, fallback: 'Offer a local learning direction.' },
  { id: 'governed-action', purpose: 'Prepare, permission-check, verify, and audit a bounded action.', agentIds: ['planning', 'governance', 'operations'], requiredApproval: 'L3', localOnly: true, fallback: 'Pause without execution.' },
] as const;

export const NINE_PILLARS: readonly PillarRoute[] = [
  { id: 'legal-hub', name: 'Legal Hub', capabilityId: 'NINE_PILLARS', maturity: 'LIVE_BOUNDED', fallback: 'Legal literacy/awareness learning; obtain qualified legal help for consequential matters.' },
  { id: 'business-hub', name: 'Business Hub', capabilityId: 'NINE_PILLARS', maturity: 'LIVE_BOUNDED', fallback: 'Business learning direction; no provider or profit guarantee.' },
  { id: 'unemployment-buster', name: 'Unemployment Buster', capabilityId: 'JOBS', maturity: 'EVIDENCE_REQUIRED', fallback: 'Employability learning and one bounded preparation step; no job guarantee.' },
  { id: 'mind-beautifier', name: 'Mind Beautifier', capabilityId: 'JOURNEY', maturity: 'LOCAL_ONLY', fallback: 'Reflection learning; no clinical service claim.' },
  { id: 'drug-buster', name: 'Drug Buster', capabilityId: 'PROFESSIONAL_REVIEW', maturity: 'REVIEW_PENDING', fallback: 'Safety/professional escalation boundary; no treatment claim.' },
  { id: 'family-harmony', name: 'Family Harmony', capabilityId: 'JOURNEY', maturity: 'LOCAL_ONLY', fallback: 'Communication/reflection learning; no counselling claim.' },
  { id: 'green-solutions', name: 'Green Solutions', capabilityId: 'NINE_PILLARS', maturity: 'LIVE_BOUNDED', fallback: 'Learning/status direction; no operating programme claim.' },
  { id: 'idea-lab', name: 'Idea Lab', capabilityId: 'PROJECTS', maturity: 'LOCAL_ONLY', fallback: 'Local idea preparation; no investment or incubation claim.' },
  { id: 'alive-bangladesh', name: 'aLive Bangladesh', capabilityId: 'NINE_PILLARS', maturity: 'LIVE_BOUNDED', fallback: 'Civic/community learning direction; no operating programme claim.' },
] as const;

export const canPublishClaim = (claim: Claim, evidence: readonly EvidenceItem[]): boolean => claim.evidenceStatus === 'VERIFIED_FACT' && claim.evidenceRefs.length > 0 && claim.evidenceRefs.every(ref => evidence.some(item => item.id === ref && item.evidenceStatus === 'VERIFIED_FACT')) && claim.contradictionRefs.length === 0;
export const evidenceStatus = (claim: Claim, evidence: readonly EvidenceItem[]): EvidenceStatus => canPublishClaim(claim, evidence) ? 'VERIFIED_FACT' : claim.contradictionRefs.length > 0 ? 'REVIEW_PENDING' : claim.evidenceStatus;
export const requiresReview = (claim: Claim): boolean => claim.evidenceStatus === 'REVIEW_PENDING' || claim.contradictionRefs.length > 0 || claim.evidenceStatus === 'INFERENCE';
export const markSuperseded = (claim: Claim): Claim => ({ ...claim, status: 'SUPERSEDED', evidenceStatus: 'SUPERSEDED', lastUpdated: now() });
export const attachContradiction = (claim: Claim, evidenceId: string): Claim => ({ ...claim, contradictionRefs: [...claim.contradictionRefs, evidenceId], evidenceStatus: 'REVIEW_PENDING', lastUpdated: now() });

export class LocalMemoryStore {
  private readonly items = new Map<string, MemoryItem>();
  retain(item: Omit<MemoryItem, keyof BaseRecord | 'retentionDecision'>): MemoryItem {
    const retained = record('memory', { ...item, retentionDecision: item.sensitive ? 'DO_NOT_RETAIN' : 'RETAIN_LOCAL' }, item.sensitive ? 'NOT_RETAINED' : 'RETAINED') as MemoryItem;
    if (!item.sensitive) this.items.set(retained.id, retained);
    return retained;
  }
  list(): MemoryItem[] { return [...this.items.values()]; }
  forget(memoryId: string): boolean { return this.items.delete(memoryId); }
  forgetAll(): void { this.items.clear(); }
}

export class EcosystemAlgorithmKernel {
  private readonly runs = new Map<string, AlgorithmRun>();
  readonly memory = new LocalMemoryStore();
  readonly capabilities = new Map(DEFAULT_CAPABILITIES.map(item => [item.id, item]));
  readonly agents = new Map(DEFAULT_AGENTS.map(item => [item.id, item]));
  readonly workflows = new Map(DEFAULT_WORKFLOWS.map(item => [item.id, item]));

  createRun(input: CreateRunInput): AlgorithmRun {
    const intent = record('intent', { text: input.intent, requestedOutcome: undefined, sensitivity: input.sensitivity ?? 'ordinary' }, 'EXPRESSED') as HumanIntent;
    const context = record('context', { locale: input.context?.locale, statedReality: input.context?.statedReality, constraints: input.context?.constraints ?? [] }, 'ACTIVE') as HumanContext;
    const run = record('run', { mode: input.mode ?? 'FULL', currentState: 'START' as HumanGrowthState, startingPointState: input.mode === 'STARTING_POINT' ? 'ME' as StartingPointState : undefined, learnVisits: 0, intent, context, needs: [], capacities: [], actions: [], evidence: [], verifications: [], reviews: [], memory: [], audit: [] }, 'ACTIVE') as AlgorithmRun;
    this.runs.set(run.id, run);
    this.audit(run, 'STATE_TRANSITION', undefined, 'START', 'Run created.');
    return run;
  }

  getCurrentState(runId: string): AlgorithmRun { return this.mustRun(runId); }
  getNextAllowedTransitions(runId: string): HumanGrowthState[] {
    const run = this.mustRun(runId);
    if (run.currentState === 'CONTINUE') return [];
    if (run.currentState === 'ACT' && run.actions.some(action => action.state === 'AWAITING_CONFIRMATION' || action.state === 'RESTRICTED' || action.state === 'PAUSED')) return [];
    return [this.nextState(run)];
  }

  advanceRun(runId: string, event: AdvanceEvent = {}): AlgorithmRun {
    const run = this.mustRun(runId);
    const next = this.getNextAllowedTransitions(runId)[0];
    if (!next) throw new Error(`Run ${runId} cannot advance from ${run.currentState}; resolve its action/review blocker first.`);
    const from = run.currentState;
    run.currentState = next;
    if (next === 'LEARN') run.learnVisits += 1;
    if (event.capabilityId) this.selectCapability(run, event.capabilityId);
    this.applyStateWork(run, next);
    this.audit(run, 'STATE_TRANSITION', from, next, event.note ?? `Advanced ${from} → ${next}.`);
    return run;
  }

  advanceStartingPoint(runId: string, note?: string): AlgorithmRun {
    const run = this.mustRun(runId);
    if (run.mode !== 'STARTING_POINT' || !run.startingPointState) throw new Error('Run is not a Starting Point run.');
    const currentIndex = STARTING_POINT_LOOP.indexOf(run.startingPointState);
    if (currentIndex === STARTING_POINT_LOOP.length - 1) return run;
    const nextFast = STARTING_POINT_LOOP[currentIndex + 1];
    const targets: Record<Exclude<StartingPointState, 'ME' | 'CONTINUE'>, HumanGrowthState> = { INTENTION: 'EXPRESS', REALITY: 'OBSERVE', NEED_CAPACITY: 'UNDERSTAND', ONE_DIRECTION: 'LEARN', ONE_NEXT_STEP: 'CHOOSE', ACTION: 'ACT', EVIDENCE: 'VERIFY', LEARN: 'REVIEW' };
    const target = nextFast === 'CONTINUE' ? 'CONTINUE' : targets[nextFast as Exclude<StartingPointState, 'ME' | 'CONTINUE'>];
    while (run.currentState !== target) this.advanceRun(run.id, { note: `Starting Point: ${nextFast}.` });
    run.startingPointState = nextFast;
    this.audit(run, 'ORCHESTRATION', undefined, nextFast, note ?? `Starting Point advanced to ${nextFast}.`);
    return run;
  }

  requestAction(runId: string, input: { capabilityId: string; description: string; risk: RiskLevel; approvalLevel: ApprovalLevel; expectedResult: string; allowLocalMock?: boolean }): ActionStep {
    const run = this.mustRun(runId);
    const capability = this.capabilities.get(input.capabilityId);
    if (!capability) throw new Error(`Unknown capability: ${input.capabilityId}`);
    this.audit(run, 'ORCHESTRATION', undefined, 'USER_INTENT', 'User intent entered the governed pipeline.');
    this.audit(run, 'ORCHESTRATION', undefined, 'CONTEXT', 'Run-local context supplied to the governed pipeline.');
    this.audit(run, 'ORCHESTRATION', undefined, 'ORCHESTRATOR', 'Orchestrator selected the governed action workflow.');
    this.audit(run, 'ORCHESTRATION', undefined, 'WORKFLOW_SELECTION', `Workflow selection considered capability ${input.capabilityId}.`);
    const unavailable = capability.status === 'UNAVAILABLE' || capability.adapter === 'NONE';
    const restricted = input.approvalLevel === 'L5';
    const needsConfirmation = input.approvalLevel === 'L4';
    const localMockAllowed = input.approvalLevel === 'L3' && capability.adapter === 'LOCAL_MOCK' && input.allowLocalMock === true;
    const decision = record('permission', { approvalLevel: input.approvalLevel, status: restricted ? 'RESTRICTED' : needsConfirmation ? 'AWAITING_CONFIRMATION' : unavailable && !localMockAllowed ? 'DENIED' : 'ALLOWED', reason: restricted ? 'L5 is restricted to human/admin/qualified-professional authority.' : needsConfirmation ? 'L4 requires explicit human confirmation before action.' : unavailable && !localMockAllowed ? `No permitted adapter is available for ${capability.id}.` : localMockAllowed ? 'Explicit local reversible mock adapter is permitted.' : 'Preparation only; level classification does not grant external execution.', humanConfirmationRequired: needsConfirmation, adapterAvailable: localMockAllowed || capability.adapter === 'LOCAL_MEMORY' || capability.adapter === 'EXISTING_BOUNDED' }, restricted ? 'RESTRICTED' : needsConfirmation ? 'AWAITING_CONFIRMATION' : unavailable && !localMockAllowed ? 'DENIED' : 'ALLOWED') as PermissionDecision;
    const state: ActionState = restricted ? 'RESTRICTED' : needsConfirmation ? 'AWAITING_CONFIRMATION' : unavailable && !localMockAllowed ? 'PAUSED' : 'PREPARED';
    const action = record('action', { capabilityId: capability.id, description: input.description, risk: input.risk, approvalLevel: input.approvalLevel, state, expectedResult: input.expectedResult, adapter: localMockAllowed ? 'LOCAL_MOCK' : 'NONE', permission: decision }, state) as ActionStep;
    run.actions.push(action);
    this.audit(run, 'POLICY', undefined, decision.status, decision.reason);
    this.audit(run, 'ORCHESTRATION', undefined, 'DATA_TOOL_PERMISSION', decision.adapterAvailable ? 'Only the declared local/bounded adapter is permitted.' : 'No adapter/tool permission was granted.');
    this.audit(run, 'ACTION', undefined, action.state, `Action ${action.id} was ${action.state.toLowerCase()}.`);
    return action;
  }

  confirmAction(runId: string, actionId: string, confirmation: Confirmation): ActionStep {
    const run = this.mustRun(runId); const action = this.mustAction(run, actionId);
    if (action.state !== 'AWAITING_CONFIRMATION') throw new Error(`Action ${actionId} is not awaiting confirmation.`);
    if (!confirmation.confirmed || !confirmation.actor.trim()) throw new Error('Explicit confirmation with an actor is required.');
    action.state = 'AUTHORIZED'; action.status = 'AUTHORIZED'; action.permission.status = 'ALLOWED'; action.permission.status = 'ALLOWED';
    this.audit(run, 'POLICY', 'AWAITING_CONFIRMATION', 'HUMAN_CONFIRMATION', `Confirmed by ${confirmation.actor}. ${confirmation.reason ?? ''}`.trim());
    this.audit(run, 'POLICY', 'HUMAN_CONFIRMATION', 'AUTHORIZED', 'Action is authorized only within its declared adapter boundary.');
    return action;
  }

  cancelAction(runId: string, actionId: string, reason = 'Cancelled by caller.'): ActionStep { const run = this.mustRun(runId); const action = this.mustAction(run, actionId); action.state = 'CANCELLED'; action.status = 'CANCELLED'; this.audit(run, 'ACTION', undefined, 'CANCELLED', reason); return action; }

  executeLocalMock(runId: string, actionId: string): ActionResult {
    const run = this.mustRun(runId); const action = this.mustAction(run, actionId);
    if (action.approvalLevel !== 'L3' || action.adapter !== 'LOCAL_MOCK' || action.state !== 'PREPARED') throw new Error('Only an explicitly permitted L3 local mock action may execute.');
    action.state = 'EXECUTING'; this.audit(run, 'ACTION', 'PREPARED', 'EXECUTING', 'Executing reversible local mock adapter.');
    action.state = 'SUCCEEDED'; action.status = 'SUCCEEDED';
    const result = record('result', { actionId, observed: `Local mock completed: ${action.description}`, success: true, adapter: 'LOCAL_MOCK' }, 'SUCCEEDED') as ActionResult;
    this.audit(run, 'ACTION', 'EXECUTING', 'SUCCEEDED', 'Local mock completed; no network or production mutation occurred.');
    return result;
  }

  verifyAction(runId: string, actionId: string, input: VerifyInput): VerificationResult {
    const run = this.mustRun(runId); const action = this.mustAction(run, actionId);
    const status: VerificationStatus = input.observedMatchesExpected ? 'PASS' : input.observed ? 'PARTIAL' : 'FAIL';
    run.evidence.push(...input.evidence);
    const verification = record('verification', { actionId, expected: input.expected, observed: input.observed, status, evidenceRefs: input.evidence.map(item => item.id), nextStep: status === 'PASS' ? 'Review and continue.' : 'Review difference and adapt; do not claim success.' }, status) as VerificationResult;
    run.verifications.push(verification);
    action.state = status === 'PASS' ? 'VERIFIED' : 'REVIEW_REQUIRED'; action.status = action.state;
    this.audit(run, 'VERIFICATION', action.state, status, verification.nextStep);
    return verification;
  }

  reviewRun(runId: string): ReviewResult { const run = this.mustRun(runId); const requiresHumanReview = run.actions.some(action => action.state === 'RESTRICTED' || action.state === 'AWAITING_CONFIRMATION' || action.state === 'REVIEW_REQUIRED') || run.verifications.some(item => item.status !== 'PASS'); const review = record('review', { summary: requiresHumanReview ? 'Review required; completion is not claimed.' : 'Bounded local result reviewed.' , requiresHumanReview }, requiresHumanReview ? 'REVIEW_REQUIRED' : 'REVIEWED') as ReviewResult; run.reviews.push(review); this.audit(run, 'ORCHESTRATION', undefined, 'REVIEW', review.summary); return review; }

  continueRun(runId: string): ContinuationState {
    const run = this.mustRun(runId); const review = run.reviews.at(-1); const blockedAction = run.actions.find(action => ['AWAITING_CONFIRMATION', 'RESTRICTED', 'PAUSED', 'REVIEW_REQUIRED'].includes(action.state));
    const continuation = record('continuation', blockedAction ? { outcome: ['AWAITING_CONFIRMATION', 'RESTRICTED', 'REVIEW_REQUIRED'].includes(blockedAction.state) ? 'REVIEW_REQUIRED' : 'PAUSED', blocker: blockedAction.permission.reason, nextStep: 'Resolve the explicit boundary or stop cleanly.' } : review?.requiresHumanReview ? { outcome: 'REVIEW_REQUIRED', blocker: review.summary, nextStep: 'Queue human review.' } : { outcome: 'CONTINUE', nextStep: 'Propose one bounded next step.' }, blockedAction ? 'BLOCKED' : review?.requiresHumanReview ? 'REVIEW_REQUIRED' : 'CONTINUE') as ContinuationState;
    run.continuation = continuation; this.audit(run, 'CONTINUATION', undefined, continuation.outcome, continuation.blocker ?? continuation.nextStep ?? 'Continue.'); return continuation;
  }

  recordContinuationEvent(runId: string, event: ContinuationEvent): AlgorithmRun {
    const run = this.mustRun(runId);
    this.audit(run, 'CONTINUATION', undefined, event.outcome, event.detail);
    return run;
  }

  exportAudit(runId: string): readonly AuditEvent[] { return [...this.mustRun(runId).audit]; }

  routeIntent(text: string): DomainRoute {
    const value = text.toLowerCase();
    if (/(founder|history|provenance|archive)/.test(value)) return { surface: 'FOUNDER', domain: 'rujbel.org', purpose: 'Founder/archive/provenance', reason: 'Intent requests history or provenance.' };
    if (/(learn|communication|professional|knowledge|legal|work|job|business|শিখ|যোগাযোগ|পেশা|জ্ঞান|আইন|কাজ|চাকরি|ব্যবসা)/.test(value)) return { surface: 'LEARN', domain: 'meuussoul.com', purpose: 'Structured learning', liveCapabilityRequired: 'LEARN', reason: 'Intent is best served by bounded learning material.' };
    if (/(reflect|uncertain|direction|journey|next step|don.?t know|what to do|কী করব|কি করব|বুঝতে পারছি না|দিকনির্দেশ)/.test(value)) return { surface: 'REFLECT_ACT', domain: 'meuus.app', purpose: 'Reflection and controlled action', liveCapabilityRequired: 'JOURNEY', reason: 'Intent calls for a reflection-first path; runtime availability remains checked.' };
    return { surface: 'UNDERSTAND', domain: 'meuus.org', purpose: 'Public truth and orientation', liveCapabilityRequired: 'UNDERSTAND', reason: 'Default safe orientation route.' };
  }

  recommendPillar(text: string): PillarRoute | undefined { const value = text.toLowerCase(); if (/(legal|law|rights|আইন|আইনি)/.test(value)) return NINE_PILLARS[0]; if (/(job|work|unemploy|কাজ|চাকরি|আয়|আয়)/.test(value)) return NINE_PILLARS[2]; if (/(business|entrepreneur|ব্যবসা)/.test(value)) return NINE_PILLARS[1]; if (/(family|relationship|পরিবার|সম্পর্ক)/.test(value)) return NINE_PILLARS[5]; if (/(drug|addiction|মাদক|নেশা)/.test(value)) return NINE_PILLARS[4]; return undefined; }

  private nextState(run: AlgorithmRun): HumanGrowthState { const sequence: readonly HumanGrowthState[] = ['START', 'EXPRESS', 'OBSERVE', 'UNDERSTAND', 'LEARN', 'REFLECT', 'REASON', 'CHOOSE', 'PLAN', 'ACT', 'VERIFY', 'REVIEW', 'REMEMBER', 'ADAPT', 'CONTINUE']; if (run.currentState === 'LEARN') return run.learnVisits <= 1 ? 'REFLECT' : 'REMEMBER'; if (run.currentState === 'REVIEW') return 'LEARN'; const index = sequence.indexOf(run.currentState); if (index < 0 || index === sequence.length - 1) throw new Error(`No next state for ${run.currentState}.`); return sequence[index + 1]; }
  private applyStateWork(run: AlgorithmRun, state: HumanGrowthState): void { if (state === 'OBSERVE') { const need = this.inferNeed(run.intent.text); run.needs.push(need); } if (state === 'UNDERSTAND') { run.route = this.routeIntent(run.intent.text); this.audit(run, 'ROUTING', undefined, run.route.domain, run.route.reason); const pillar = this.recommendPillar(run.intent.text); if (pillar) this.audit(run, 'ROUTING', undefined, pillar.name, `${pillar.name}: ${pillar.fallback}`); } if (state === 'REMEMBER') { const item = this.memory.retain({ memoryClass: 'PROGRESS', tier: 'progress', purpose: 'Continue a bounded local run.', content: `Run ${run.id} reached reviewed learning.`, sensitive: false }); run.memory.push(item); this.audit(run, 'MEMORY', undefined, item.retentionDecision, 'Progress retained locally with explicit purpose.'); } }
  private inferNeed(text: string): Need { const value = text.toLowerCase(); const category = /(legal|law|আইন|আইনি)/.test(value) ? 'LEGAL_AWARENESS' : /(job|work|unemploy|কাজ|চাকরি|আয়|আয়)/.test(value) ? 'WORK_DIRECTION' : /(professional|communication|যোগাযোগ|পেশা)/.test(value) ? 'PROFESSIONAL_LEARNING' : /(reflect|uncertain|direction|don.?t know|what to do|কী করব|কি করব|বুঝতে পারছি না)/.test(value) ? 'REFLECTION' : 'LEARNING'; const risk: RiskLevel = /(medical|legal advice|crisis|diagnos|চিকিৎসা|জরুরি)/.test(value) ? 'RESTRICTED' : 'LOW'; return record('need', { category, statement: text, risk }, 'OBSERVED') as Need; }
  private selectCapability(run: AlgorithmRun, capabilityId: string): void { if (!this.capabilities.has(capabilityId)) throw new Error(`Unknown capability: ${capabilityId}`); run.selectedCapabilityId = capabilityId; this.audit(run, 'ORCHESTRATION', undefined, capabilityId, `Capability ${capabilityId} selected.`); }
  private audit(run: AlgorithmRun, kind: AuditEvent['kind'], from: string | undefined, to: string | undefined, detail: string): void { run.audit.push(record('audit', { runId: run.id, kind, from, to, detail }, 'RECORDED') as AuditEvent); }
  private mustRun(runId: string): AlgorithmRun { const run = this.runs.get(runId); if (!run) throw new Error(`Unknown run: ${runId}`); return run; }
  private mustAction(run: AlgorithmRun, actionId: string): ActionStep { const action = run.actions.find(item => item.id === actionId); if (!action) throw new Error(`Unknown action: ${actionId}`); return action; }
}

export const createKernel = (): EcosystemAlgorithmKernel => new EcosystemAlgorithmKernel();
