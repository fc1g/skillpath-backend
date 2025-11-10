# SkillPath Backend

SkillPath Backend is the server-side core of the **SkillPath** learning platform.

It is built with **NestJS** and organized as a modular backend monorepo. The backend exposes a single public BFF (
Backend for Frontend) for the Next.js client; internal services stay behind that boundary.

## Architecture

- **BFF** — single entrypoint for the frontend:
    - auth & authorization
    - request/response shaping
    - aggregation of data from internal services
- **Domain services** (NestJS apps/modules), e.g.:
    - Auth, Courses, AI Mentor, Code Runner, Notifications
- **Data layer**
    - relational schema for users, roles, courses, lessons, quizzes, challenges, tags, progress, chats & messages
    - Redis available for cache/fast lookups
- **Infra & monitoring**
    - Docker-based deployment, reverse proxy in front
    - Prometheus + Grafana for metrics and dashboards
    - External AI providers called only from backend

See diagrams in skillpath `docs/` for architecture and entities (work in progress by design).

## Getting Started

### Prerequisites

- Node.js (LTS)
- pnpm
- Docker & Docker Compose (recommended)

### Install

```bash
pnpm install
```

### Environment

- Create `.env.development.local` for services under `apps/`
- Configure DB, Redis, JWT/keys, external APIs, etc.
- (Optional) `certs/` for keys, excluded from VCS

### Development

```bash
pnpm start:dev
```

Use service-specific scripts from `package.json` to run individual apps if needed.

### Testing

```bash
pnpm test
pnpm test:e2e
pnpm test:cov
```

## Structure

- `apps/` — BFF + domain services
- `libs/` — shared modules, DTOs, utilities
- `certs/` — local keys (ignored)

## Related

- `skillpath-frontend` — Next.js client consuming the BFF
- Root `skillpath` — composes frontend, backend, and infrastructure