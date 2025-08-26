# DONE — AI DIPLOMATIC NEGOTIATOR

## Phase 0 — Infra & Repo

[2024-12-19] [Claude] Monorepo scaffold: `apps/{web,gateway,orchestrator,workers}`.
[2024-12-19] [Claude] docker-compose.dev (Postgres, Redis, NATS, MinIO).
[2024-12-19] [Claude] GitHub Actions: lint/typecheck/test, Docker build, SBOM + cosign.

## Phase 1 — DB & Auth

[2024-12-19] [Claude] SQL migrations (negotiations, parties, issues, prefs, offers, rounds, transcript, optimizations, risk, precedents, approvals, exports).
[2024-12-19] [Claude] RBAC roles (mediator, delegate, analyst, observer).
[2024-12-19] [Claude] Auth.js with JWT + RLS enforcement.

## Phase 2 — Scenario Framing

[2024-12-19] [Claude] intake-normalizer worker.
[2024-12-19] [Claude] **ScenarioWizard**, **PartyTable**, **IssueGrid**, **WeightSliders**, **BatnaEditor**.

## Phase 3 — Positioning

[2024-12-19] [Claude] position-drafter agent for public vs. private briefs.
[2024-12-19] [Claude] **PositionEditor** with Historian context sidebar.

## Phase 4 — Negotiation Rounds

[2024-12-19] [Claude] US/EU agents propose offers.
[2024-12-19] [Claude] **TranscriptStream**, **OfferBuilder**, **OfferCard**, **UtilityMatrix**, **ConcessionTimeline**, **MediatorConsole**.
[2024-12-19] [Claude] WS streaming for transcript + offers.

## Phase 5 — Optimizer & ZOPA

[2024-12-19] [Claude] bundle-optimizer agent (Nash/Kalai/WSW).
[2024-12-19] [Claude] zopa-checker worker.
[2024-12-19] [Claude] **ParetoPlot**, **ZopaBadge** UI components.

## Phase 6 — Risk & Scenarios

[2024-12-19] [Claude] risk-engine worker builds risk trees + outcomes.
[2024-12-19] [Claude] **RiskTree**, **TornadoRisk** UI components.

## Phase 7 — Drafting & Approvals

[2024-12-19] [Claude] Mediator agent consolidated final package.
[2024-12-19] [Claude] **PackageEditor**, **ApprovalPanel** UI.
[2024-12-19] [Claude] Minimal approvals API and enforcement in gateway.

## Phase 8 — Exports

[2024-12-19] [Claude] reporter + exporter workers.
[2024-12-19] [Claude] **ExportHub** UI for PDF/MDX/CSV/JSON/ZIP.
[2024-12-19] [Claude] Exports API with signed URL stubs and audit logs.
