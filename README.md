# SkillPath Backend

SkillPath Backend is the server-side core of the **SkillPath** learning
platform, developed as part of my CS50x final project.

The backend is built with **NestJS** and organized as a modular monorepo.  
It exposes a single public **Backend For Frontend (BFF)** that serves the
Next.js client, while all internal domain services remain isolated behind this
boundary.

This design reflects real-world backend architectures where scalability,
separation of concerns, and long-term maintainability are priorities.

---

## Purpose of the Backend

The backend is responsible for all business logic, data management,
authentication, and integrations.

Its main responsibilities include:

- User authentication and authorization
- Course, lesson, and progress management
- Secure API exposure for the frontend
- Asynchronous communication between services
- Preparing infrastructure for future features such as code execution and
  AI-assisted learning

The frontend never communicates directly with internal services.

---

## Architecture Overview

The backend follows a **microservices-oriented architecture** implemented within
a NestJS monorepo.

### BFF (Backend For Frontend)

The BFF acts as the single entry point for the frontend:

- Handles authentication and authorization
- Shapes requests and responses for client needs
- Aggregates data from internal services
- Shields internal services from direct exposure

### Domain Services

Each domain service focuses on a specific responsibility, for example:

- **Auth** — authentication, passwords, tokens
- **Courses** — courses, lessons, progress tracking
- **Notifications** — email and system notifications
- **Code Runner (planned)** — isolated execution of user-submitted code
- **AI Mentor (planned)** — AI-assisted feedback and guidance

This separation prevents the backend from becoming a tightly coupled monolith.

---

## Data Layer

- Relational database schema for:
  - users, roles, courses, lessons
  - challenges, quizzes, tags
  - progress tracking
  - chats and messages
- **Redis** is available for caching, token storage, and fast lookups

---

## Infrastructure and Tooling

- **Docker & Docker Compose** for local development and deployment
- Reverse proxy in front of backend services
- **Prometheus & Grafana** prepared for metrics and monitoring
- External AI providers are accessed only from the backend

Architecture and entity diagrams are stored in the root project `docs/`
directory.

---

## Project Structure

- `apps/`  
  Contains the BFF and all domain services as NestJS applications.

- `libs/`  
  Shared modules, DTOs, utilities, and common logic.

- `certs/`  
  Local keys and certificates (ignored by version control).

---

## Environment Configuration

Each service under `apps/` uses its own `.env.development.local` file.

Environment variables typically include:

- Database connection details
- Redis configuration
- JWT secrets and keys
- External service credentials

Sensitive files are excluded from version control.

---

## Getting Started

### Prerequisites

- Node.js (LTS)
- pnpm
- Docker & Docker Compose (recommended)

### Installation

```bash
pnpm install
```

### Development

Run the entire backend stack:

```bash
pnpm start:dev
```

Individual services can also be started using service-specific scripts from
`package.json`.

---

## Testing

```bash
pnpm test
pnpm test:e2e
pnpm test:cov
```

---

## Design Decisions and Trade-offs

- **Monorepo with microservices**  
  Chosen to balance modularity with shared tooling and type safety.

- **BFF pattern**  
  Keeps the frontend simple and secure while allowing internal services to
  evolve independently.

- **Backend-first complexity**  
  Priority was given to clean architecture and scalability over rapid feature
  expansion.

---

## Relation to the Main Project

This repository represents the backend part of **SkillPath**.

For frontend setup, infrastructure composition, and system-wide documentation,
refer to the root SkillPath repository.

---

## Final Notes

The SkillPath backend was designed to resemble a production-grade system rather
than a minimal academic assignment.  
It reflects my interest in backend engineering, distributed systems, and
long-term software architecture.

Thank you for taking the time to review this project.
