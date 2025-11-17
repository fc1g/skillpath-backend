FROM node:23-alpine AS base

WORKDIR /usr/src/app

RUN apk update && apk add --no-cache curl
RUN corepack enable pnpm

FROM base AS deps

ARG SERVICE_NAME
ENV SERVICE_NAME=${SERVICE_NAME}

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.json nest-cli.json ./

COPY apps/${SERVICE_NAME}/package.json apps/${SERVICE_NAME}/package.json

RUN pnpm install --frozen-lockfile

FROM deps AS dev

ARG SERVICE_NAME
ENV SERVICE_NAME=${SERVICE_NAME}

ARG HTTP_PORT
ENV HTTP_PORT=${HTTP_PORT}

ENV NODE_ENV=development

COPY apps/${SERVICE_NAME} apps/${SERVICE_NAME}/
COPY certs certs
COPY libs libs

EXPOSE ${HTTP_PORT}

CMD pnpm start:dev -- $SERVICE_NAME

FROM deps AS e2e

ARG SERVICE_NAME
ENV SERVICE_NAME=${SERVICE_NAME}

ARG HTTP_PORT
ENV HTTP_PORT=${HTTP_PORT}

ENV NODE_ENV=test

COPY apps/${SERVICE_NAME} apps/${SERVICE_NAME}/
COPY certs certs
COPY libs libs

RUN pnpm build -- $SERVICE_NAME

CMD pnpm -C apps/$SERVICE_NAME test:e2e

FROM deps AS builder

ARG SERVICE_NAME
ENV SERVICE_NAME=${SERVICE_NAME}

COPY apps/${SERVICE_NAME} apps/${SERVICE_NAME}
COPY certs certs
COPY libs libs

RUN pnpm build -- $SERVICE_NAME

FROM base AS runner

ARG SERVICE_NAME
ENV SERVICE_NAME=${SERVICE_NAME}

ARG HTTP_PORT
ENV HTTP_PORT=${HTTP_PORT}

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/dist/apps/$SERVICE_NAME ./dist/apps/$SERVICE_NAME
COPY --from=builder /usr/src/app/certs ./certs

COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /usr/src/app/nest-cli.json ./nest-cli.json

COPY --from=deps /usr/src/app/node_modules ./node_modules

EXPOSE ${HTTP_PORT}

CMD node dist/apps/$SERVICE_NAME/main.js