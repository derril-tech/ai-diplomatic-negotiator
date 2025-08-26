AI DIPLOMATIC NEGOTIATOR — END‑TO‑END PRODUCT BLUEPRINT
(React 18 + Next.js 14 App Router; CrewAI multi‑agent orchestration; TypeScript‑first contracts.)
1) Product Description & Presentation
One‑liner
A multi‑agent diplomatic simulator where US Diplomat, EU Diplomat, Mediator, Historian, and Risk Analyst negotiate complex disputes (e.g., “Trade dispute over clean energy”), producing a round‑by‑round negotiation transcript, compromise package(s), historical & legal context, and risk assessment with scenario outcomes—complete with utility scoring, ZOPA detection, and Pareto‑frontier visualizations.
What it produces
•
Positions & Interests Dossiers for each party (public stances vs. true interests).
•
Issue Map (e.g., tariffs, subsidies, IP, standards, supply‑chain, carbon border rules), with weights, red‑lines, BATNAs.
•
Offers & Counteroffers (multi‑issue bundles), with utility scores per party.
•
Mediator Briefs (common ground, tradeoffs, sequencing plan).
•
Historian Context (precedents, treaties, comparable settlements; jurisdiction‑neutral summaries).
•
Risk Assessment (short/medium‑term scenarios; compliance/retaliation risks; escalation ladders).
•
Final Package (terms, enforcement, monitoring, review clauses) and After‑Action Report.
•
Exports: PDF/MDX package, CSV of issues/offers, JSON bundle (replayable).
Scope/Safety
•
Simulation only; non‑advisory, jurisdiction‑agnostic; no classified information; avoids live actors’ sensitive data.
2) Target User
•
Policy schools & think-tanks teaching negotiation/mediation.
•
Corporate/government training (trade, standards, compliance).
•
Journalists/creators demonstrating negotiation outcomes transparently.
•
Students & hobbyists exploring geopolitical bargaining.
3) Features & Functionalities (Extensive)
Intake & Problem Framing
•
Scenario wizard: conflict title, parties (2–N), roles (e.g., US/EU), issues (catalog or custom), objectives, constraints (legal/regulatory), red‑lines, BATNA sketches, time horizon (T0, T+6, T+24 months).
•
Issue typing: distributive (zero‑sum), integrative (expandable), linked issues (e.g., tariff ↔ standards recognition), side‑payments allowed? phased commitments allowed?
•
Utility scaffolding: party‑specific issue weights (0–100), concavity/convexity of utility curves (e.g., diminishing returns), and reservation values; sliders + CSV upload.
Positioning & Briefs
•
Public position draft vs. internal “interests” brief for each party.
•
Historian brief: high‑level precedent list, comparable deals, recurring traps (e.g., subsidy verification).
•
Legal context (generic): treaties/agreements that may apply conceptually (names omitted or user‑provided).
Negotiation Engine
•
Round manager (R1…R5+): openings, offers, counteroffers, side conversations (mediator caucus), timeouts.
•
Bundle builder: multi‑issue packages with contingent clauses, verification mechanisms, review windows, sunset triggers.
•
ZOPA detector: checks overlap of parties’ reservation values; flags “no-zone” with mediator strategies.
•
Algorithms (advisory, hyper‑parameterized):
o
Nash Bargaining (maximize product of gains over BATNA).
o
Kalai–Smorodinsky (proportionate ideal points).
o
Weighted social welfare (Mediator weights).
o
Pareto frontier generator across issues/constraints.
•
Concession sequencing: suggest order of concessions, linkages, and confidence‑building steps.
Risk & Scenario Analysis
•
Risk tree: escalation paths (retaliatory tariffs, WTO‑like disputes, supply‑chain shocks), probability sliders.
•
Outcome scenarios: baseline, optimistic, adverse; macro variables (growth, energy prices), compliance risk, reputational risk.
•
Monitoring & enforcement plan: joint committee, audits, dispute escalation window.
Transcript & Artifacts
•
Live transcript with speaker tags and caucus/private notes (private vs. public transcript modes).
•
Compromise package(s): Draft v1…vN with change‑tracking and utility deltas.
•
After‑Action Report: what worked, residual issues, review schedule, lessons learned.
Collaboration & Governance
•
Roles: Mediator (chair), Party delegates (US/EU), Analysts, Observers.
•
Change requests, inline comments, versioning & diffs, approval gates (Mediator sign‑off → Parties sign‑off).
•
Replay any negotiation with step controls and alternative algorithm weights.
Exports
•
PDF/MDX (Final package, transcript excerpts, context, risk).
•
CSV (issues, weights, offers, utilities).
•
JSON (full state; re‑playable seed).
4) Backend Architecture (Extremely Detailed & Deployment‑Ready)
4.1 Topology
•
Frontend/BFF: Next.js 14 (Vercel), server actions for small mutations & S3 signed URLs.
•
API Gateway: Node/NestJS
o
REST /v1, OpenAPI 3.1, Zod/AJV validation, RBAC, rate limits, Idempotency‑Key, Problem+JSON errors.
•
Auth: Auth.js (OAuth/passwordless) + short‑lived JWT (rotating refresh); SAML/OIDC; SCIM for orgs.
•
Orchestration: CrewAI Orchestrator (Python FastAPI) coordinating agents:
o
US Diplomat (positioning, offers, red‑lines, domestic constraints)
o
EU Diplomat (positioning, offers, standards alignment, trade instruments)
o
Mediator (agenda, bundling, sequencing, deal texts, fairness criteria)
o
Historian (generic precedent mapping, pitfalls, analogies)
o
Risk Analyst (scenarios, escalation tree, monitoring/enforcement design)
•
Workers (Python):
o
intake-normalizer (scenario → structured issues/weights/red‑lines/BATNAs)
o
position-drafter (public vs private interests per party)
o
bundle-optimizer (Nash/Kalai/WSW + constraints)
o
zopa-checker (overlap detection; mediator advisories)
o
risk-engine (scenario tree, probabilities, outcome KPIs)
o
transcript-writer (turn stitching, caucus & plenary)
o
reporter (MDX/PDF)
o
exporter (CSV/JSON/ZIP)
•
Event Bus: NATS (scenario.*, position.*, bundle.*, zopa.*, risk.*, transcript.*, export.*).
•
Task Queue: Celery (NATS/Redis backend) with lanes: interactive (rounds), models (optimizers), exports.
•
DB: Postgres (Neon/Cloud SQL) + pgvector (embeddings for precedent snippets & narrative chunks).
•
Object Storage: S3/R2 (uploads, exports).
•
Cache: Upstash Redis (hot negotiation state, utility matrices, last frontier).
•
Realtime: WebSocket gateway (NestJS) + SSE fallback (round updates, transcripts, optimizer ticks).
•
Observability: OpenTelemetry traces; Prometheus/Grafana; Sentry; structured logs.
•
Secrets: Cloud Secrets Manager/Vault; KMS‑wrapped; no plaintext secrets at rest.
4.2 CrewAI Agents & Tools (Strict Interfaces)
Agents
•
US Diplomat / EU Diplomat — articulate stances, generate offers, evaluate packages via party utility model, propose sequencing.
•
Mediator — sets agenda, enforces speaking order, bundles issues, proposes compromise draft(s), applies fairness criteria.
•
Historian — supplies generic precedent frames & pitfalls (no jurisdiction‑specific advice), compares structures (e.g., verification committees, phased tariff rollback).
•
Risk Analyst — builds risk tree, computes outcome scores (economic, political, compliance), recommends monitoring/enforcement.
Tool Interfaces
•
Scenario.parse(text|form) → {parties[], issues[], weights{party→issue:0..1}, redlines{party→issue:bounds}, batna{party}, constraints}
•
Position.public(party, scenario) / Position.private(party, scenario) → {stance, interests, talking_points}
•
Offer.create(party, bundleSpec) → {offer_id, terms[], rationale}
•
Offer.evaluate(offer_id, party) → {utility, redline_hits[], notes}
•
Bundle.optimize(method, scenario, weights, constraints) → {package, utilities{party}, pareto_point:boolean}
•
Zopa.detect(scenario) → {exists:boolean, region, blockers[]}
•
Risk.scenarios(scenario, package?, params) → {tree, outcomes[], probs[], kpis}
•
Transcript.append(turn) → persisted speaker‑labeled text (plenary/caucus)
•
Report.render(negotiationId, targets[]) → artifacts
•
Export.bundle(negotiationId, targets[]) → signed URLs
4.3 Data Model (Postgres + pgvector)
-- Tenancy & Identity CREATE TABLE orgs ( id UUID PRIMARY KEY, name TEXT NOT NULL, plan TEXT, created_at TIMESTAMPTZ DEFAULT now() ); CREATE TABLE users ( id UUID PRIMARY KEY, org_id UUID REFERENCES orgs(id), email CITEXT UNIQUE, name TEXT, role TEXT, tz TEXT, created_at TIMESTAMPTZ DEFAULT now() ); CREATE TABLE memberships ( user_id UUID REFERENCES users(id), org_id UUID REFERENCES orgs(id), workspace_role TEXT CHECK (workspace_role IN ('owner','admin','mediator','delegate','analyst','observer')), PRIMARY KEY (user_id, org_id) ); -- Negotiations & Scenarios CREATE TABLE negotiations ( id UUID PRIMARY KEY, org_id UUID, title TEXT, status TEXT CHECK (status IN ('created','framing','positioning','rounds','drafting','finalizing','exported','archived')) DEFAULT 'created', created_by UUID, created_at TIMESTAMPTZ DEFAULT now() ); CREATE TABLE scenarios ( id UUID PRIMARY KEY, negotiation_id UUID REFERENCES negotiations(id), description TEXT, horizon_months INT, constraints JSONB, -- e.g., "side_payments":true created_at TIMESTAMPTZ DEFAULT now() ); -- Parties & Issues CREATE TABLE parties ( id UUID PRIMARY KEY, negotiation_id UUID REFERENCES negotiations(id),
name TEXT, seat_label TEXT, batna_score NUMERIC, notes TEXT ); CREATE TABLE issues ( id UUID PRIMARY KEY, negotiation_id UUID REFERENCES negotiations(id), name TEXT, kind TEXT, -- 'distributive','integrative','linked' unit TEXT, -- e.g., '% tariff','€bn subsidy cap' min_value NUMERIC, max_value NUMERIC ); CREATE TABLE party_issue_prefs ( id UUID PRIMARY KEY, party_id UUID REFERENCES parties(id), issue_id UUID REFERENCES issues(id), weight NUMERIC, -- 0..1 normalized reservation_low NUMERIC, reservation_high NUMERIC, -- acceptable band curve TEXT, -- 'linear','concave','convex' notes TEXT ); -- Positions & Offers CREATE TABLE positions ( id UUID PRIMARY KEY, party_id UUID REFERENCES parties(id), public_stance TEXT, private_interests TEXT, created_at TIMESTAMPTZ DEFAULT now() ); CREATE TABLE offers ( id UUID PRIMARY KEY, negotiation_id UUID, made_by_party_id UUID REFERENCES parties(id), round INT, package JSONB, -- [{issue_id, proposed_value, conditions}] rationale TEXT, created_at TIMESTAMPTZ DEFAULT now() ); CREATE TABLE evaluations ( id UUID PRIMARY KEY, offer_id UUID REFERENCES offers(id), party_id UUID REFERENCES parties(id), utility NUMERIC, redline_hits JSONB, notes TEXT ); -- Optimization Runs & Frontiers
CREATE TABLE optimizations ( id UUID PRIMARY KEY, negotiation_id UUID, method TEXT, -- 'nash','kalai','wsw' params JSONB, package JSONB, utilities JSONB, pareto BOOLEAN, created_at TIMESTAMPTZ DEFAULT now() ); CREATE TABLE pareto_points ( id UUID PRIMARY KEY, negotiation_id UUID, coords JSONB, -- {partyA: u, partyB: u, ...} package JSONB, created_at TIMESTAMPTZ DEFAULT now() ); -- Transcript & Rounds CREATE TABLE rounds ( id UUID PRIMARY KEY, negotiation_id UUID, number INT, phase TEXT, -- 'opening','package','caucus','closing' started_at TIMESTAMPTZ, ended_at TIMESTAMPTZ ); CREATE TABLE transcript ( id UUID PRIMARY KEY, negotiation_id UUID, round_id UUID REFERENCES rounds(id), speaker TEXT, -- 'US','EU','Mediator','Historian','Risk Analyst' mode TEXT, -- 'plenary','caucus' text TEXT, ts_ms BIGINT ); -- Risk & Scenarios CREATE TABLE risk_nodes ( id UUID PRIMARY KEY, negotiation_id UUID, parent_id UUID, label TEXT, probability NUMERIC, impact NUMERIC, kpis JSONB ); CREATE TABLE risk_outcomes ( id UUID PRIMARY KEY, negotiation_id UUID, name TEXT, description TEXT, probability NUMERIC, kpis JSONB, mitigation TEXT ); -- Context & Precedents
CREATE TABLE precedents ( id UUID PRIMARY KEY, negotiation_id UUID, summary TEXT, pattern TEXT, embedding VECTOR(1536) ); -- Collaboration, Exports & Audit CREATE TABLE comments ( id UUID PRIMARY KEY, negotiation_id UUID, entity TEXT, entity_id UUID, author_id UUID, body TEXT, created_at TIMESTAMPTZ DEFAULT now() ); CREATE TABLE approvals ( id UUID PRIMARY KEY, negotiation_id UUID, artifact TEXT, order_idx INT, role_required TEXT, user_id UUID, status TEXT CHECK (status IN ('pending','approved','rejected')) DEFAULT 'pending', comment TEXT, acted_at TIMESTAMPTZ ); CREATE TABLE exports ( id UUID PRIMARY KEY, negotiation_id UUID, kind TEXT, s3_key TEXT, meta JSONB, created_at TIMESTAMPTZ DEFAULT now() ); CREATE TABLE audit_log ( id BIGSERIAL PRIMARY KEY, org_id UUID, user_id UUID, negotiation_id UUID, action TEXT, target TEXT, meta JSONB, created_at TIMESTAMPTZ DEFAULT now() );
Indexes & Constraints (high‑value)
•
CREATE UNIQUE INDEX ON party_issue_prefs (party_id, issue_id);
•
CREATE INDEX ON offers (negotiation_id, round);
•
Vector index on precedents.embedding.
•
Invariants: weights per party normalize to 1; cannot finalize unless package evaluates ≥ reservation for all parties (or mediator overrides recorded).
4.4 API Surface (REST /v1, OpenAPI)
Auth & Orgs
•
POST /v1/auth/login / POST /v1/auth/refresh
•
GET /v1/me
Negotiations & Scenario
•
POST /v1/negotiations {title} → {id}
•
POST /v1/negotiations/:id/scenario {description,horizon_months,constraints}
•
POST /v1/negotiations/:id/parties {parties:[{name, seat_label, batna_score}]}
•
POST /v1/negotiations/:id/issues {issues:[{name,kind,unit,min_value,max_value}]}
•
POST /v1/negotiations/:id/prefs {party_id, prefs:[{issue_id,weight,reservation_low,reservation_high,curve}]}
Positions & Offers
•
POST /v1/parties/:id/positions/public {stance}
•
POST /v1/parties/:id/positions/private {interests}
•
POST /v1/negotiations/:id/offers {made_by_party_id, round, package, rationale}
•
POST /v1/offers/:offerId/evaluate {party_id} → {utility, redline_hits}
•
GET /v1/negotiations/:id/offers?round=
Optimization & ZOPA
•
POST /v1/negotiations/:id/optimize {method, params} → {package, utilities, pareto}
•
POST /v1/negotiations/:id/zopa → {exists, region, blockers}
•
GET /v1/negotiations/:id/pareto → points
Rounds & Transcript
•
POST /v1/negotiations/:id/rounds {number, phase}
•
POST /v1/rounds/:roundId/transcript {speaker, mode, text, ts_ms}
•
GET /v1/negotiations/:id/transcript?round=
Risk & Context
•
POST /v1/negotiations/:id/risk {params} → tree + outcomes
•
POST /v1/negotiations/:id/precedents {summaries[]}
Approvals & Exports
•
POST /v1/negotiations/:id/approvals {artifact, chain:[{order_idx,role_required}]}
•
POST /v1/negotiations/:id/approve {artifact, order_idx, decision, comment}
•
POST /v1/negotiations/:id/export {targets:['pdf','mdx','csv','json','zip']}
•
GET /v1/exports/:id → signed URL
Conventions
•
Mutations require Idempotency‑Key; errors: Problem+JSON; strict RLS by org/negotiation; party‑scoped views for caucus notes.
4.5 Orchestration Logic (CrewAI)
State machine
created → framing → positioning → rounds → drafting → finalizing → exported → archived
Typical sequence
1.
Framing: Scenario.parse → issues, weights, red‑lines, BATNAs.
2.
Positioning: parties generate public & private briefs; Historian adds context.
3.
Rounds: R1 openings → offers; Bundle.optimize proposes Pareto‑efficient packages; ZOPA checked; Mediator sequences concessions; caucus for shuttle diplomacy.
4.
Risk pass: Risk Analyst runs tree & outcomes for top packages.
5.
Drafting: Mediator composes Final Package v1 with verification & review clauses.
6.
Finalizing: approvals (Mediator → Parties) → sign‑off → export artifacts.
4.6 Background Jobs
•
NormalizeScenario(negId)
•
DraftPositions(negId, partyId)
•
OptimizeBundle(negId, method)
•
DetectZOPA(negId)
•
ComputeRisk(negId, package)
•
StitchTranscript(negId, round)
•
BuildReport(negId) / ExportBundle(negId, targets[])
•
Periodics: RetentionSweep, CostRollup, AlertOnFailure.
4.7 Realtime
•
WS channels:
o
neg:{id}:rounds (turns, offers, evaluations)
o
neg:{id}:opt (optimizer ticks; Pareto points stream)
o
neg:{id}:risk (scenario results ready)
o
neg:{id}:transcript (live lines)
o
export:{id}:status
•
Presence indicators; soft locks (only Mediator can advance phase).
4.8 Caching & Performance
•
Redis caches: latest utilities matrix, Pareto frontier (≤500 points), top 3 packages, last transcript window.
•
SLOs (2‑party, ≤10 issues):
o
First ZOPA check < 2 s P95; Pareto set (200 pts) < 6 s P95.
o
Offer evaluation < 500 ms P95.
o
Risk scenarios (3 branches) < 5 s P95.
o
Report export < 12 s P95.
4.9 Observability
•
OTel spans: gateway → orchestrator → workers; tags: neg_id, round, method, tokens/cost.
•
Metrics: ZOPA existence %, average rounds to deal, concession size distribution, package adoption rate, export success.
•
Logs: structured JSON; audit_log for changes, approvals, exports.
5) Frontend Architecture (React 18 + Next.js 14)
5.1 Tech Choices
•
Next.js 14 App Router, TypeScript.
•
UI: shadcn/ui + Tailwind (clean, diplomatic “briefing room” aesthetic).
•
State/data: TanStack Query; Zustand for ephemeral negotiation canvas (selected package, slider positions, live cursors).
•
Realtime: WebSocket client w/ auto‑reconnect/backoff; SSE fallback.
•
Charts: Recharts (utility spider/radar, Pareto scatter, tornado risk bars, concession timelines).
•
Editors: TipTap for draft texts; Monaco for JSON package debug (power users).
•
Tables: virtualized (issues, offers, evaluations, transcript).
5.2 App Structure
/app /(marketing)/page.tsx /(app) dashboard/page.tsx negotiations/ new/page.tsx [negId]/ page.tsx // Overview & status framing/page.tsx // Parties, issues, weights, BATNA positioning/page.tsx // Public vs private briefs rounds/page.tsx // Live negotiation room optimizer/page.tsx // Pareto & algorithm configs risk/page.tsx // Scenario trees & outcomes drafting/page.tsx // Final package editor approvals/page.tsx exports/page.tsx admin/audit/page.tsx /components ScenarioWizard/* PartyTable/*
IssueGrid/* WeightSliders/* BatnaEditor/* PositionEditor/* OfferBuilder/* OfferCard/* UtilityMatrix/* ParetoPlot/* ConcessionTimeline/* ZopaBadge/* RiskTree/* TornadoRisk/* TranscriptStream/* MediatorConsole/* PackageEditor/* ApprovalPanel/* ExportHub/* CommentThread/* /lib api-client.ts ws-client.ts zod-schemas.ts rbac.ts /store useNegotiationStore.ts useOptimizerStore.ts useRiskStore.ts useRealtimeStore.ts
5.3 Key Pages & UX Flows
Dashboard
•
Tiles: “Start negotiation,” “In rounds,” “Awaiting approvals,” “Recent exports.”
•
KPI chips: ZOPA present?, rounds elapsed, best utility pair.
Framing
•
ScenarioWizard: add parties, define issues, min/max, units; upload CSV for party weights.
•
IssueGrid shows issue rows with min/max; WeightSliders per party (kept normalized).
•
BatnaEditor to input BATNA score (0–100) and notes; ZopaBadge indicates overlap existence.
Positioning
•
PositionEditor for public stance vs. private interests (tabs); Historian context sidebar shows precedents summaries.
Rounds (Negotiation Room)
•
Split view:
o
Left: TranscriptStream (live, plenary/caucus tabs), OfferBuilder (compose multi‑issue bundle).
o
Right: UtilityMatrix (party×issue), OfferCard list with per‑party utilities, ConcessionTimeline.
•
MediatorConsole: advance phase, open caucus, run Bundle.optimize (Nash/Kalai/WSW), push “Mediator Package vX”.
Optimizer
•
ParetoPlot: scatter of utility pairs; select point to inspect package; Adopt → sends to rounds as a mediator offer.
•
Toggle algorithms; adjust fairness weights; view frontier refresh in real time.
Risk
•
RiskTree builder (nodes with prob/impact); TornadoRisk per package; compare top 3 packages.
Drafting
•
PackageEditor (TipTap + structured clauses): terms per issue, verification, monitoring, review; change‑tracking and diff vs. previous draft.
Approvals
•
ApprovalPanel defines chain (Mediator → Party A → Party B).
•
Approvers can approve/reject with comment; lock after final approval.
Exports
•
ExportHub: pick artifacts (PDF/MDX/CSV/JSON/ZIP); progress list; signed links; change log since last export.
5.4 Component Breakdown (Selected)
•
IssueGrid/Row.tsx
Props: { issue, min, max, unit, kind }; validates numbers; shows “linked” pill if issue has dependencies.
•
WeightSliders/PartySliders.tsx
Props: { party, issues[] }; maintains normalization (sum=1) with dynamic redistribution; shows contribution to utility.
•
OfferBuilder/Term.tsx
Props: { issue, value, condition? }; inline validation against party red‑lines; warns if outside [min,max].
•
UtilityMatrix/Table.tsx
Props: { package, partyPrefs }; shows per‑issue and total utilities; tooltips explain curve type & reservation bounds.
•
ParetoPlot/Scatter.tsx
Props: { points, selectedId }; click to open OfferCard with decoded package; keyboard navigation for accessibility.
•
RiskTree/Node.tsx
Props: { label, probability, impact }; drag‑to‑connect; recomputes outcome KPIs on change.
5.5 Data Fetching & Caching
•
Server Components for scenario/party/issue snapshots and read views (frontier & best package).
•
TanStack Query for mutations and streamed results (offers, evaluations, rounds, optimization ticks, risk outcomes).
•
WS pushes patch table/chart data via queryClient.setQueryData; optimistic updates for non‑destructive edits.
•
Prefetch neighbors: framing → positioning → rounds → optimizer → risk → drafting.
5.6 Validation & Error Handling
•
Zod schemas: parties, issues, prefs, offers, packages, rounds, risk nodes, approvals.
•
Problem+JSON with remediation (e.g., “Weights not normalized; auto‑normalize?”).
•
Guardrails:
o
Cannot adopt package that violates any party’s red‑lines unless mediator override is recorded with comment.
o
Approvals blocked until latest package evaluated by all parties.
5.7 Accessibility & i18n
•
Keyboard shortcuts: next offer (J/K), adopt package (A), open caucus (C), add transcript line (Enter).
•
ARIA roles for tables/plots; focus‑visible rings; high‑contrast palettes; color‑blind‑safe charts.
•
next-intl for dates/numbers; RTL support.
6) Integrations
•
Docs/Storage: Google Drive/SharePoint (optional) for evidence/context uploads; exports delivered to S3 or user cloud.
•
Comms: Slack/Email notifications (round advanced, package ready, approvals pending, export finished).
•
Identity/SSO: Auth.js; SAML/OIDC; SCIM provisioning.
•
Payments (SaaS): Stripe (seats + metered optimization runs).
•
No external political databases by default; users provide any domain materials.
7) DevOps & Deployment
•
FE: Vercel (Next.js 14).
•
APIs/Workers: Render/Fly.io (simple) or GKE (scale; CPU pool for optimizers; memory pool for export jobs).
•
DB: Managed Postgres + pgvector; PITR; migration gates.
•
Cache: Upstash Redis.
•
Object Store: S3/R2 with lifecycle (retain exports; purge temp).
•
Event Bus: NATS (managed/self‑hosted).
•
CI/CD: GitHub Actions — lint/typecheck/unit/integration; Docker build; SBOM + cosign; blue/green; migration approvals.
•
IaC: Terraform modules (DB, Redis, NATS, buckets, secrets, DNS/CDN).
•
Testing
o
Unit: utility curves, normalization, Nash/Kalai/WSW outputs, ZOPA detection, risk propagation, drafting formatter.
o
Contract: OpenAPI.
o
E2E (Playwright): framing→positioning→rounds→optimize→risk→drafting→approvals→export.
o
Load: k6 (optimizer & transcript streaming under concurrency).
o
Chaos: missing weights, extreme reservations, conflicting red‑lines.
o
Security: ZAP; container/dependency scans; secret scanning.
•
SLOs (restate)
o
ZOPA <2s; 200 Pareto pts <6s; risk <5s; export <12s; WS P95 <250ms; 5xx <0.5%/1k.
8) Success Criteria
Product KPIs
•
Deal formation: ≥ 70% of simulations reach a package within ≤5 rounds when ZOPA exists.
•
Transparency: ≥ 90% of packages have per‑party utility breakdown & red‑line rationale.
•
Replay rate: ≥ 60% of sessions replay or branch an alternative weighting.
•
Export reliability: ≥ 99% artifact delivery.
Engineering SLOs
•
WS reconnect < 2 s P95; chart interactions < 120 ms perceived latency; optimizer failures < 1% of runs.
9) Security & Compliance
•
RBAC: Owner/Admin/Mediator/Delegate/Analyst/Observer; caucus notes visible only to Mediator + specific party.
•
Encryption: TLS 1.2+; AES‑256 at rest; KMS‑wrapped secrets; signed URLs for uploads/exports.
•
Privacy: no PII required; redact names if user uploads real‑world documents; configurable retention & deletion.
•
Tenant isolation: Postgres RLS; S3 prefix isolation.
•
Auditability: immutable audit_log for offers, evaluations, phase changes, approvals, exports.
•
Supply chain: SLSA provenance; image signing; pinned deps; dependency scans.
•
Disclaimer banners on all pages: simulation only, not policy or legal advice.
10) Visual/Logical Flows
A) Framing
User defines parties/issues/weights → intake-normalizer builds structured scenario → ZopaBadge indicates overlap.
B) Positioning
US/EU agents create public & private briefs; Historian adds precedents; Risk Analyst stub tree.
C) Rounds
R1 openings → offers; MediatorConsole proposes optimized bundle(s); parties evaluate; ConcessionTimeline tracks moves; ZOPA/Frontier updated.
D) Risk Pass
Top packages sent to risk-engine; TornadoRisk and RiskTree render impacts & probabilities; mitigation text produced.
E) Drafting
PackageEditor consolidates terms (verification, monitoring, review); change‑tracking; ApprovalPanel chain set.
F) Finalize & Export
Approvals complete → reporter/exporter build PDF/MDX/CSV/JSON/ZIP → links delivered.