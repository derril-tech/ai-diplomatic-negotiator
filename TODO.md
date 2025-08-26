# TODO — AI DIPLOMATIC NEGOTIATOR
> Granular backlog; [Code] = deterministic systems, [Crew] = agent work.






## Phase 3 — Positioning
- [x] [Crew] position-drafter agent for public vs. private briefs.
- [x] [UI] **PositionEditor** with Historian context sidebar.

## Phase 4 — Negotiation Rounds
- [x] [Crew] US/EU agents propose offers.
- [x] [UI] **TranscriptStream**, **OfferBuilder**, **OfferCard**, **UtilityMatrix**, **ConcessionTimeline**, **MediatorConsole**.
- [x] [Code] WS streaming for transcript + offers.

## Phase 5 — Optimizer & ZOPA
- [x] [Crew] bundle-optimizer agent (Nash/Kalai/WSW).
- [x] [Code] zopa-checker worker.
- [x] [UI] **ParetoPlot**, **ZopaBadge**.

## Phase 6 — Risk & Scenarios
- [x] [Crew] risk-engine agent builds risk trees + outcomes.
- [x] [UI] **RiskTree**, **TornadoRisk**.

## Phase 7 — Drafting & Approvals
- [x] [Crew] Mediator agent consolidates Final Package.
- [x] [UI] **PackageEditor**, **ApprovalPanel**.
- [x] [Code] approval chain enforcement.

## Phase 8 — Exports
- [x] [Crew] reporter + exporter workers.
- [x] [UI] **ExportHub** for PDF/MDX/CSV/JSON/ZIP.
- [x] [Code] signed URLs + audit logs.

## Testing
- **Unit**: utility normalization, Nash/Kalai/WSW, ZOPA detection, risk propagation.
- **Contract**: OpenAPI, Zod schemas.
- **E2E**: framing → positioning → rounds → optimizer → risk → drafting → approvals → export.
- **Load**: k6 (concurrent negotiations).
- **Chaos**: missing prefs, conflicting redlines.
- **Security**: ZAP scans, dep scans, secret scanning.

## Seeds
- Demo scenario: US vs EU on clean energy tariffs (3 issues).
- Example precedent notes (generic, anonymized).
- Risk tree templates (baseline/optimistic/adverse).

## Runbooks
- ZOPA false negatives → mediator override flow.
- Frontier too dense → Pareto cap at 500 points.
- Redis eviction → warm start utilities matrix.
