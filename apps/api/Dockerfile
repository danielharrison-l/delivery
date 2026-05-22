FROM node:22-alpine

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @repo/shared build
RUN pnpm --filter @repo/api db:generate
RUN pnpm --filter @repo/api build

EXPOSE 3333

CMD ["sh", "-c", "pnpm --filter @repo/api db:deploy && pnpm --filter @repo/api start"]
