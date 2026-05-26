# Fullstack Monorepo

Monorepo fullstack para um site de restaurante com Node.js, TypeScript no backend, NestJS, Prisma ORM, PostgreSQL, React com JavaScript, Vite, Tailwind CSS, Zod, pnpm workspaces e Turborepo.

## Estrutura

```txt
apps/
  api/       NestJS + Prisma + Zod
  web/       React + Vite + Tailwind + Zod em JavaScript
docs/
  api.md    Contrato humano da API
packages/
  shared/   Schemas e tipos compartilhados
```

## Requisitos

- Node.js 22+
- pnpm 10+
- Docker, se quiser usar PostgreSQL ou rodar tudo em containers

## Instalacao

```bash
pnpm install
```

## Variaveis de ambiente

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Na API, configure tambem `AUTH_ACCESS_TOKEN_SECRET`, `AUTH_ACCESS_TOKEN_EXPIRES_IN_SECONDS` e `AUTH_REFRESH_TOKEN_EXPIRES_IN_SECONDS`.

O access token e retornado no JSON de login/cadastro/refresh. O refresh token fica em cookie `HttpOnly` e exige `credentials: "include"` no frontend.

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

Opcionalmente, rode o seed:

```bash
pnpm --filter @repo/api db:seed
```

O seed cria uma conta administrativa:

```txt
E-mail: admin@terraco.test
Senha: Admin12345
```

Rode as aplicacoes:

```bash
pnpm dev
```

- Web: `http://localhost:5173`
- API: `http://localhost:3333/api`
- Health: `http://localhost:3333/api/health`

## Documentacao da API

Com a API rodando:

- Scalar: `http://localhost:3333/api/docs`
- Swagger UI: `http://localhost:3333/api/swagger`
- OpenAPI JSON: `http://localhost:3333/api/openapi.json`
- Contrato Markdown: `docs/api.md`

## Docker

Para rodar tudo via Docker:

```bash
pnpm docker:up
```

Ou diretamente:

```bash
docker compose up --build
```

Esse comando sobe PostgreSQL, API e web. A API aplica as migrations e executa o seed automaticamente.

- Web: `http://localhost:5173`
- API: `http://localhost:3333/api`
- Scalar: `http://localhost:3333/api/docs`
- Swagger UI: `http://localhost:3333/api/swagger`

Conta administrativa criada pelo seed:

```txt
E-mail: admin@terraco.test
Senha: Admin12345
```

Para rodar em segundo plano:

```bash
docker compose up -d --build
```

Para parar os containers:

```bash
pnpm docker:down
```

Para apagar também o banco local do Docker:

```bash
docker compose down -v
```

Se alguma porta estiver ocupada:

```bash
WEB_PORT=5174 API_PORT=3334 POSTGRES_PORT=5433 docker compose up --build
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm typecheck
pnpm db:generate
pnpm db:migrate
pnpm db:studio
pnpm docker:up
pnpm docker:down
```
