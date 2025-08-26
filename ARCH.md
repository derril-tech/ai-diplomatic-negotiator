# Architecture — AI DIPLOMATIC NEGOTIATOR

## Topology
- **Frontend**: Next.js 14 (TS), shadcn/ui + Tailwind (briefing room aesthetic), TanStack Query + Zustand, WS + SSE fallback, Recharts (utility/risk), TipTap editors, Monaco (package debug).  
- **API Gateway**: NestJS, REST /v1, OpenAPI 3.1, Zod/AJV validation, RBAC, Idempotency-Key, Problem+JSON.  
- **Auth**: Auth.js + JWT, SAML/OIDC, SCIM.  
- **Orchestrator**: CrewAI (FastAPI) coordinating agents: US Diplomat, EU Diplomat, Mediator, Historian, Risk Analyst.  
- **Workers**: intake-normalizer, position-drafter, bundle-optimizer, zopa-checker, risk-engine, transcript-writer, reporter, exporter.  
- **Infra**: Postgres + pgvector, Redis (Upstash), NATS, Celery, S3/R2, OTel/Prom/Grafana, Sentry, Vault/KMS.  

## Data Model
- **Core**: `negotiations`, `scenarios`, `parties`, `issues`, `party_issue_prefs`.  
- **Positions/Offers**: `positions`, `offers`, `evaluations`.  
- **Optimization**: `optimizations`, `pareto_points`.  
- **Transcript**: `rounds`, `transcript`.  
- **Risk/Context**: `risk_nodes`, `risk_outcomes`, `precedents`.  
- **Collab/Exports**: `comments`, `approvals`, `exports`, `audit_log`.  

## API Surface
- **Negotiations**: `POST /negotiations`, `POST /negotiations/:id/scenario`, `POST /negotiations/:id/parties`, `POST /negotiations/:id/issues`, `POST /negotiations/:id/prefs`  
- **Positions**: `POST /parties/:id/positions/public`, `/private`  
- **Offers**: `POST /negotiations/:id/offers`, `POST /offers/:id/evaluate`, `GET /negotiations/:id/offers`  
- **Optimization**: `POST /negotiations/:id/optimize`, `POST /negotiations/:id/zopa`, `GET /negotiations/:id/pareto`  
- **Rounds**: `POST /negotiations/:id/rounds`, `POST /rounds/:id/transcript`  
- **Risk**: `POST /negotiations/:id/risk`, `POST /negotiations/:id/precedents`  
- **Approvals**: `POST /negotiations/:id/approvals`, `/approve`  
- **Exports**: `POST /negotiations/:id/export`, `GET /exports/:id`  

## Agent Tools
- `Scenario.parse` → parties, issues, weights, redlines, BATNA  
- `Position.public/private` → stance, interests  
- `Offer.create/evaluate` → terms, utility, redline hits  
- `Bundle.optimize` → package + utilities + Pareto flag  
- `Zopa.detect` → overlap region or blockers  
- `Risk.scenarios` → tree, outcomes, KPIs  
- `Transcript.append` → structured log line  
- `Report.render` / `Export.bundle` → signed URLs  

## Realtime Channels
- `neg:{id}:rounds`, `neg:{id}:opt`, `neg:{id}:risk`, `neg:{id}:transcript`, `export:{id}:status`.  
Presence indicators; mediator locks advancement.  

## Security
- RBAC roles: Owner/Admin/Mediator/Delegate/Analyst/Observer.  
- Caucus notes visible only to mediator + designated party.  
- TLS 1.2+, AES-256 at rest, KMS secrets, RLS.  
- Disclaimer banners on all pages.  

## Deployment & SLOs
- FE: Vercel. APIs/Workers: Render/Fly → GKE for scale.  
- DB: Postgres + pgvector; PITR.  
- Cache: Redis. Storage: S3/R2.  
- **SLOs**: ZOPA <2s, 200 Pareto pts <6s, risk <5s, export <12s, WS latency <250ms P95, 5xx <0.5%/1k.  
