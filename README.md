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

## Deploy

### Banco no Neon

Crie um projeto PostgreSQL no Neon e copie a connection string. Use a URL com SSL, normalmente neste formato:

```txt
postgresql://user:password@host/dbname?sslmode=require
```

Essa URL será usada como `DATABASE_URL` na API.

### API no Render

Crie um Web Service no Render apontando para este repositório.

Configuração recomendada:

```txt
Environment: Docker
Dockerfile Path: apps/api/Dockerfile
```

Variáveis de ambiente:

```txt
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
PORT=3333
CORS_ORIGIN=https://sua-url-da-vercel.vercel.app
AUTH_ACCESS_TOKEN_SECRET=troque-por-uma-chave-grande
AUTH_ACCESS_TOKEN_EXPIRES_IN_SECONDS=900
AUTH_REFRESH_TOKEN_EXPIRES_IN_SECONDS=604800
AUTH_REFRESH_TOKEN_COOKIE_SECURE=true
```

O container da API executa migrations e seed ao iniciar.

Após publicar, teste:

```txt
https://sua-api.onrender.com/api/health
https://sua-api.onrender.com/api/docs
```

### Frontend na Vercel

O projeto já possui `vercel.json` na raiz.

Configuração esperada:

```txt
Build Command: pnpm build:web
Output Directory: apps/web/dist
Install Command: pnpm install --frozen-lockfile
```

Variável de ambiente:

```txt
VITE_API_URL=https://sua-api.onrender.com/api
```

Depois do deploy da Vercel, volte no Render e atualize `CORS_ORIGIN` com a URL final do frontend.

## Scripts

```bash
pnpm dev
pnpm build
pnpm build:api
pnpm build:web
pnpm typecheck
pnpm db:generate
pnpm db:migrate
pnpm db:studio
pnpm docker:up
pnpm docker:down
```
