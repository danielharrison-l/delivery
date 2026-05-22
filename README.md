# Fullstack Monorepo

Monorepo fullstack com Node.js, TypeScript, NestJS, Prisma ORM, React, Vite, Tailwind CSS, Zod, pnpm workspaces e Turborepo.

## Estrutura

```txt
apps/
  api/       NestJS + Prisma + Zod
  web/       React + Vite + Tailwind + Zod
packages/
  shared/    Schemas e tipos compartilhados
```

## Requisitos

- Node.js 22+
- pnpm 10+
- Docker, se quiser usar PostgreSQL ou rodar tudo em containers

## Instalação

```bash
pnpm install
```

## Variáveis de ambiente

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

## Desenvolvimento local

Suba apenas o banco:

```bash
docker compose up db
```

Gere o Prisma Client e rode a migration:

```bash
pnpm db:generate
pnpm db:migrate
```

Rode as aplicações:

```bash
pnpm dev
```

- Web: http://localhost:5173
- API: http://localhost:3333/api
- Health: http://localhost:3333/api/health

## Docker

Para rodar tudo via Docker:

```bash
pnpm docker:up
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm typecheck
pnpm db:migrate
pnpm db:studio
```
