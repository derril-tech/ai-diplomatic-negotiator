# Project Plan — AI DIPLOMATIC NEGOTIATOR

> Scope: A multi-agent diplomatic simulator (US Diplomat, EU Diplomat, Mediator, Historian, Risk Analyst) producing transcripts, compromise packages, historical/legal context, and risk assessments — with **utility scoring, ZOPA detection, and Pareto-frontier visualizations**.

## Product Goal
Provide a **transparent, replayable negotiation lab** where parties bargain across issues, mediated by algorithms and agents, yielding compromise packages, historical analogies, and risk trees. Exportable for teaching, training, or scenario testing.

## Safety & Scope
- **Simulation only**, not advice.  
- No real diplomacy, classified info, or sensitive live data.  
- Jurisdiction-agnostic; historical/legal notes are **contextual, not advisory**.  
- Explicit disclaimer banners throughout.  

## 80/20 Build Strategy
- **80% deterministic/code**: scenario structuring, weights/curves, ZOPA detection, optimization (Nash/Kalai/WSW), Pareto frontier, transcripts, approvals, exports.  
- **20% Crew agents**: drafting briefs, generating offers/rationales, mediator sequencing, precedent notes, risk narratives.  

## Immediate Next 3 Tasks
1. Scaffold monorepo + infra (`apps/{web,gateway,orchestrator,workers}`) with docker-compose (Postgres + Redis + NATS + MinIO).  
2. Implement NestJS API Gateway with OpenAPI 3.1, RBAC roles, Idempotency-Key, Problem+JSON.  
3. Build **ScenarioWizard**: parties, issues, weights, BATNA, constraints → normalized & persisted.  

## Phases
- **P0** Infra, CI, repo structure  
- **P1** DB schema + auth + RBAC  
- **P2** Scenario framing (parties, issues, weights, BATNA)  
- **P3** Position briefs (public vs private) + Historian context  
- **P4** Negotiation rounds (offers, evaluations, transcript)  
- **P5** Optimizer (Pareto, Nash/Kalai/WSW, ZOPA detection)  
- **P6** Risk pass (tree + outcomes + TornadoRisk)  
- **P7** Drafting Final Package + approvals workflow  
- **P8** Exports (PDF/MDX/CSV/JSON/ZIP) + observability  

## Definition of Done (MVP)
- Scenario wizard structures parties, issues, weights, BATNA.  
- US/EU generate public/private briefs; Historian adds precedents.  
- Negotiation room supports rounds, offers, counteroffers, transcript streaming.  
- Optimizer runs Nash/Kalai/WSW, plots Pareto frontier, checks ZOPA.  
- Risk Analyst produces outcome trees + TornadoRisk visual.  
- Mediator assembles final package, tracks diffs, approval chain enforced.  
- ExportHub generates PDF/MDX/CSV/JSON/ZIP.  
- SLOs: ZOPA < 2s, 200 Pareto pts < 6s, risk < 5s, export < 12s.  

## Non-Goals (MVP)
- No integration with real political datasets or negotiation forums.  
- No external ML scraping of treaties/corp data (user may upload context).  
- No multilingual UI in first release.  

## Key Risks & Mitigations
- **Overcomplex UI** → phased UX (framing → rounds → risk → drafting).  
- **ZOPA miscalc** → enforce math tests; fallback to mediator override.  
- **Users mistake for real policy advice** → banners + disclaimers.  
- **Compute bottlenecks** → async Celery lanes; cache Pareto sets; frontier capped ≤ 500 points.  

## KPIs
- ≥ 70% of runs reach a package within ≤5 rounds if ZOPA exists.  
- ≥ 90% of packages explain utilities per party + red-line notes.  
- ≥ 60% of users replay/branch scenarios.  
- ≥ 99% export reliability.  
