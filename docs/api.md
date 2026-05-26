# API Contract

Base URL local:

```txt
http://localhost:3333/api
```

Documentacao interativa:

- Scalar: `http://localhost:3333/api/docs`
- Swagger UI: `http://localhost:3333/api/swagger`
- OpenAPI JSON: `http://localhost:3333/api/openapi.json`

## Padroes

Todas as rotas usam JSON. Rotas privadas usam access token no header:

```http
Authorization: Bearer access_token
```

O refresh token fica em cookie `HttpOnly` chamado `refreshToken`. O navegador envia esse cookie automaticamente nas rotas `/auth/refresh` e `/auth/logout` quando o frontend usa `credentials: "include"`.

Erros seguem este formato:

```json
{
  "message": "Mensagem do erro",
  "error": "Bad Request",
  "statusCode": 400
}
```

Rotas paginadas aceitam:

| Campo | Tipo | Padrao | Limite |
| --- | --- | --- | --- |
| `page` | number | `1` | minimo `1` |
| `limit` | number | `10` | entre `1` e `50` |

Resposta paginada:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

Deletes retornam `204 No Content` sem corpo.

## Auth

### `POST /auth/register`

Cria um cliente e retorna a sessao.

Body:

```json
{
  "name": "Ana Silva",
  "email": "ana@example.com",
  "password": "12345678",
  "phone": "11999998888"
}
```

Campos obrigatorios: `name`, `email`, `password`.

### `POST /auth/login`

Autentica um cliente.

Body:

```json
{
  "email": "ana@example.com",
  "password": "12345678"
}
```

Resposta:

```json
{
  "customer": {},
  "accessToken": "jwt"
}
```

O backend tambem envia o cookie `refreshToken`.

### `POST /auth/refresh`

Rotaciona o refresh token e retorna uma nova sessao.

Nao recebe body. O refresh token vem do cookie `HttpOnly`.

### `POST /auth/logout`

Rota privada. Revoga o refresh token atual.

Nao recebe body. O refresh token vem do cookie `HttpOnly` e o backend limpa o cookie ao finalizar.

### `GET /auth/me`

Rota privada. Retorna o cliente autenticado.

### `PATCH /auth/me`

Rota privada. Atualiza os dados do perfil do cliente autenticado. Use essa rota para salvar telefone e endereço padrão de delivery.

Body:

```json
{
  "name": "Ana Silva",
  "email": "ana@example.com",
  "phone": "11999998888",
  "address": "Rua Central, 100"
}
```

Campos obrigatorios: `name`, `email`.

## Health

### `GET /health`

Retorna o status da API.

## Customers

Todas as rotas de clientes são privadas e exigem usuário `ADMIN`. Cadastro público deve usar `POST /auth/register`.

### `GET /customers`

Lista clientes com paginacao.

Query:

| Campo | Tipo | Obrigatorio |
| --- | --- | --- |
| `page` | number | nao |
| `limit` | number | nao |
| `search` | string | nao |

### `GET /customers/:id`

Busca um cliente por `id`.

### `POST /customers`

Cria um cliente.

Body:

```json
{
  "name": "Ana Silva",
  "email": "ana@example.com",
  "phone": "11999998888",
  "address": "Rua Central, 100"
}
```

Campos obrigatorios: `name`, `email`.

### `PATCH /customers/:id`

Atualiza um cliente. Envie pelo menos um campo.

Body:

```json
{
  "name": "Ana Souza",
  "email": "ana.souza@example.com",
  "phone": "11988887777",
  "address": "Rua Nova, 200"
}
```

### `DELETE /customers/:id`

Remove um cliente.

## Menu Categories

Listagem e busca são públicas. Criar, atualizar e remover exigem usuário `ADMIN`.

### `GET /menu/categories`

Lista categorias do cardapio.

### `GET /menu/categories/:id`

Busca uma categoria por `id`.

### `POST /menu/categories`

Cria uma categoria.

Body:

```json
{
  "name": "Main Dishes",
  "description": "Signature dishes from the kitchen"
}
```

Campo obrigatorio: `name`.

### `PATCH /menu/categories/:id`

Atualiza uma categoria. Envie pelo menos um campo.

### `DELETE /menu/categories/:id`

Remove uma categoria.

## Menu Items

Listagem e busca são públicas. Criar, atualizar e remover exigem usuário `ADMIN`.

### `GET /menu/items`

Lista itens do cardapio.

Query:

| Campo | Tipo | Obrigatorio |
| --- | --- | --- |
| `categoryId` | uuid | nao |
| `available` | boolean | nao |
| `search` | string | nao |

### `GET /menu/items/:id`

Busca um item por `id`.

### `POST /menu/items`

Cria um item.

Body:

```json
{
  "name": "Mushroom Risotto",
  "description": "Creamy risotto with mushrooms",
  "price": 54.9,
  "imageUrl": "https://example.com/risotto.jpg",
  "available": true,
  "categoryId": "00000000-0000-0000-0000-000000000000"
}
```

Campos obrigatorios: `name`, `price`, `categoryId`.

### `PATCH /menu/items/:id`

Atualiza um item. Envie pelo menos um campo.

### `DELETE /menu/items/:id`

Remove um item.

## Reservations

Todas as rotas de reservas são privadas. Clientes comuns acessam apenas as próprias reservas. Usuários `ADMIN` listam todas e podem alterar status.

Status aceitos:

- `PENDING`
- `CONFIRMED`
- `CANCELLED`

### `GET /reservations`

Lista reservas com paginacao.

Query:

| Campo | Tipo | Obrigatorio |
| --- | --- | --- |
| `page` | number | nao |
| `limit` | number | nao |
| `status` | enum | nao |
| `date` | `YYYY-MM-DD` | nao |

### `GET /reservations/:id`

Busca uma reserva por `id`.

### `POST /reservations`

Cria uma reserva.

Regras de horário:

- Não aceita data e horário no passado.
- Segunda-feira fechado.
- Terça a quinta: `18:00` às `22:30`.
- Sexta-feira: `18:00` às `23:30`.
- Sábado: `12:00` às `23:30`.
- Domingo: `12:00` às `16:00`.

Body:

```json
{
  "reservationDate": "2026-05-26T20:00:00.000Z",
  "peopleCount": 4,
  "notes": "Mesa perto da janela"
}
```

Campos obrigatorios: `reservationDate`, `peopleCount`.

### `PATCH /reservations/:id/status`

Atualiza o status da reserva. Exige usuário `ADMIN`.

Body:

```json
{
  "status": "CONFIRMED"
}
```

### `DELETE /reservations/:id`

Remove uma reserva.

## Delivery Orders

Todas as rotas de delivery são privadas. Clientes comuns acessam apenas os próprios pedidos. Usuários `ADMIN` listam todos e podem alterar status ou remover pedidos.

Status aceitos:

- `PREPARING`
- `OUT_FOR_DELIVERY`
- `DELIVERED`
- `CANCELLED`

### `GET /delivery/orders`

Lista pedidos de delivery com paginacao.

Query:

| Campo | Tipo | Obrigatorio |
| --- | --- | --- |
| `page` | number | nao |
| `limit` | number | nao |
| `status` | enum | nao |

### `GET /delivery/orders/:id`

Busca um pedido por `id`.

### `POST /delivery/orders`

Cria um pedido. O backend calcula `totalAmount` usando o preco atual dos itens.

Body:

```json
{
  "deliveryAddress": "Rua Central, 100",
  "items": [
    {
      "menuItemId": "00000000-0000-0000-0000-000000000000",
      "quantity": 2
    }
  ]
}
```

Campos obrigatorios: `deliveryAddress`, `items`.

### `PATCH /delivery/orders/:id/status`

Atualiza o status do pedido. Exige usuário `ADMIN`.

Body:

```json
{
  "status": "OUT_FOR_DELIVERY"
}
```

### `DELETE /delivery/orders/:id`

Remove um pedido. Exige usuário `ADMIN`.
