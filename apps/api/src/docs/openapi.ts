import type { INestApplication } from "@nestjs/common";
import { SwaggerModule, type OpenAPIObject } from "@nestjs/swagger";
import type {
  ParameterObject,
  SchemaObject,
  SecurityRequirementObject
} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { apiReference } from "@scalar/nestjs-api-reference";

interface JsonResponse {
  json(body: OpenAPIObject): JsonResponse;
}

const errorResponseSchema = {
  type: "object",
  properties: {
    message: {
      oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }]
    },
    error: { type: "string" },
    statusCode: { type: "number" }
  },
  required: ["message", "statusCode"]
} satisfies SchemaObject;

const paginationMetaSchema = {
  type: "object",
  properties: {
    page: { type: "number", example: 1 },
    limit: { type: "number", example: 10 },
    total: { type: "number", example: 25 },
    totalPages: { type: "number", example: 3 }
  },
  required: ["page", "limit", "total", "totalPages"]
} satisfies SchemaObject;

const customerSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    name: { type: "string", example: "Ana Silva" },
    email: { type: "string", format: "email", example: "ana@example.com" },
    phone: { type: "string", nullable: true, example: "11999998888" },
    address: { type: "string", nullable: true, example: "Rua Central, 100" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" }
  },
  required: ["id", "name", "email", "phone", "address", "createdAt", "updatedAt"]
} satisfies SchemaObject;

const menuCategorySchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    name: { type: "string", example: "Main Dishes" },
    description: { type: "string", nullable: true, example: "Signature dishes from the kitchen" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" }
  },
  required: ["id", "name", "description", "createdAt", "updatedAt"]
} satisfies SchemaObject;

const menuItemSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    name: { type: "string", example: "Mushroom Risotto" },
    description: { type: "string", nullable: true, example: "Creamy risotto with mushrooms" },
    price: { type: "number", example: 54.9 },
    imageUrl: { type: "string", nullable: true, example: "https://example.com/risotto.jpg" },
    available: { type: "boolean", example: true },
    categoryId: { type: "string", format: "uuid" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    category: { $ref: "#/components/schemas/MenuCategory" }
  },
  required: [
    "id",
    "name",
    "description",
    "price",
    "imageUrl",
    "available",
    "categoryId",
    "createdAt",
    "updatedAt"
  ]
} satisfies SchemaObject;

const reservationSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    reservationDate: { type: "string", format: "date-time" },
    peopleCount: { type: "number", example: 4 },
    status: { $ref: "#/components/schemas/ReservationStatus" },
    notes: { type: "string", nullable: true, example: "Mesa perto da janela" },
    customerId: { type: "string", format: "uuid" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    customer: { $ref: "#/components/schemas/Customer" }
  },
  required: [
    "id",
    "reservationDate",
    "peopleCount",
    "status",
    "notes",
    "customerId",
    "createdAt",
    "updatedAt"
  ]
} satisfies SchemaObject;

const deliveryOrderItemSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    quantity: { type: "number", example: 2 },
    unitPrice: { type: "number", example: 26.9 },
    orderId: { type: "string", format: "uuid" },
    menuItemId: { type: "string", format: "uuid" },
    createdAt: { type: "string", format: "date-time" },
    menuItem: { $ref: "#/components/schemas/MenuItem" }
  },
  required: ["id", "quantity", "unitPrice", "orderId", "menuItemId", "createdAt"]
} satisfies SchemaObject;

const deliveryOrderSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    status: { $ref: "#/components/schemas/DeliveryOrderStatus" },
    totalAmount: { type: "number", example: 53.8 },
    deliveryAddress: { type: "string", example: "Rua Central, 100" },
    customerId: { type: "string", format: "uuid" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    customer: { $ref: "#/components/schemas/Customer" },
    items: { type: "array", items: { $ref: "#/components/schemas/DeliveryOrderItem" } }
  },
  required: ["id", "status", "totalAmount", "deliveryAddress", "customerId", "createdAt", "updatedAt"]
} satisfies SchemaObject;

const idParam = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "string", format: "uuid" }
} satisfies ParameterObject;

const pageQuery = {
  name: "page",
  in: "query",
  required: false,
  schema: { type: "integer", minimum: 1, default: 1 }
} satisfies ParameterObject;

const limitQuery = {
  name: "limit",
  in: "query",
  required: false,
  schema: { type: "integer", minimum: 1, maximum: 50, default: 10 }
} satisfies ParameterObject;

const bearerSecurity = [{ BearerAuth: [] }] satisfies SecurityRequirementObject[];

function response(description: string, schemaRef: string) {
  return {
    description,
    content: {
      "application/json": {
        schema: { $ref: schemaRef }
      }
    }
  };
}

function arrayResponse(description: string, schemaRef: string) {
  return {
    description,
    content: {
      "application/json": {
        schema: {
          type: "array",
          items: { $ref: schemaRef }
        }
      }
    }
  };
}

function body(schemaRef: string) {
  return {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: schemaRef }
      }
    }
  };
}

export const openApiDocument: OpenAPIObject = {
  openapi: "3.0.0",
  info: {
    title: "Restaurant API",
    description: "API para clientes, cardapio, reservas e delivery.",
    version: "1.0.0"
  },
  servers: [{ url: "http://localhost:3333" }],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Customers" },
    { name: "Menu Categories" },
    { name: "Menu Items" },
    { name: "Reservations" },
    { name: "Delivery Orders" }
  ],
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Check API status",
        responses: {
          "200": response("API health status", "#/components/schemas/HealthResponse")
        }
      }
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register customer and create session",
        requestBody: body("#/components/schemas/Register"),
        responses: {
          "201": response("Session created", "#/components/schemas/AuthSession"),
          "409": response("Customer email already exists", "#/components/schemas/ErrorResponse")
        }
      }
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login customer",
        requestBody: body("#/components/schemas/Login"),
        responses: {
          "201": response("Session created", "#/components/schemas/AuthSession"),
          "401": response("Invalid credentials", "#/components/schemas/ErrorResponse")
        }
      }
    },
    "/api/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Rotate refresh token and create a new session",
        responses: {
          "201": response("Session refreshed", "#/components/schemas/AuthSession"),
          "401": response("Invalid refresh token", "#/components/schemas/ErrorResponse")
        }
      }
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Revoke refresh token",
        security: bearerSecurity,
        responses: {
          "204": { description: "Session revoked" },
          "401": response("Invalid access token", "#/components/schemas/ErrorResponse")
        }
      }
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get authenticated customer",
        security: bearerSecurity,
        responses: {
          "200": response("Authenticated customer", "#/components/schemas/Customer"),
          "401": response("Invalid access token", "#/components/schemas/ErrorResponse")
        }
      }
    },
    "/api/customers": {
      get: {
        tags: ["Customers"],
        summary: "List customers",
        security: bearerSecurity,
        parameters: [
          pageQuery,
          limitQuery,
          {
            name: "search",
            in: "query",
            required: false,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": response("Paginated customers", "#/components/schemas/PaginatedCustomers")
        }
      },
      post: {
        tags: ["Customers"],
        summary: "Create customer",
        security: bearerSecurity,
        requestBody: body("#/components/schemas/CreateCustomer"),
        responses: {
          "201": response("Customer created", "#/components/schemas/Customer"),
          "409": response("Customer email already exists", "#/components/schemas/ErrorResponse")
        }
      }
    },
    "/api/customers/{id}": {
      get: {
        tags: ["Customers"],
        summary: "Get customer by id",
        security: bearerSecurity,
        parameters: [idParam],
        responses: {
          "200": response("Customer", "#/components/schemas/Customer"),
          "404": response("Customer not found", "#/components/schemas/ErrorResponse")
        }
      },
      patch: {
        tags: ["Customers"],
        summary: "Update customer",
        security: bearerSecurity,
        parameters: [idParam],
        requestBody: body("#/components/schemas/UpdateCustomer"),
        responses: {
          "200": response("Customer updated", "#/components/schemas/Customer"),
          "404": response("Customer not found", "#/components/schemas/ErrorResponse"),
          "409": response("Customer email already exists", "#/components/schemas/ErrorResponse")
        }
      },
      delete: {
        tags: ["Customers"],
        summary: "Delete customer",
        security: bearerSecurity,
        parameters: [idParam],
        responses: {
          "204": { description: "Customer deleted" },
          "404": response("Customer not found", "#/components/schemas/ErrorResponse")
        }
      }
    },
    "/api/menu/categories": {
      get: {
        tags: ["Menu Categories"],
        summary: "List menu categories",
        responses: {
          "200": arrayResponse("Menu categories", "#/components/schemas/MenuCategory")
        }
      },
      post: {
        tags: ["Menu Categories"],
        summary: "Create menu category",
        security: bearerSecurity,
        requestBody: body("#/components/schemas/CreateMenuCategory"),
        responses: {
          "201": response("Menu category created", "#/components/schemas/MenuCategory"),
          "409": response("Menu category already exists", "#/components/schemas/ErrorResponse")
        }
      }
    },
    "/api/menu/categories/{id}": {
      get: {
        tags: ["Menu Categories"],
        summary: "Get menu category by id",
        parameters: [idParam],
        responses: {
          "200": response("Menu category", "#/components/schemas/MenuCategory"),
          "404": response("Menu category not found", "#/components/schemas/ErrorResponse")
        }
      },
      patch: {
        tags: ["Menu Categories"],
        summary: "Update menu category",
        security: bearerSecurity,
        parameters: [idParam],
        requestBody: body("#/components/schemas/UpdateMenuCategory"),
        responses: {
          "200": response("Menu category updated", "#/components/schemas/MenuCategory"),
          "404": response("Menu category not found", "#/components/schemas/ErrorResponse"),
          "409": response("Menu category already exists", "#/components/schemas/ErrorResponse")
        }
      },
      delete: {
        tags: ["Menu Categories"],
        summary: "Delete menu category",
        security: bearerSecurity,
        parameters: [idParam],
        responses: {
          "204": { description: "Menu category deleted" },
          "404": response("Menu category not found", "#/components/schemas/ErrorResponse")
        }
      }
    },
    "/api/menu/items": {
      get: {
        tags: ["Menu Items"],
        summary: "List menu items",
        parameters: [
          {
            name: "categoryId",
            in: "query",
            required: false,
            schema: { type: "string", format: "uuid" }
          },
          {
            name: "available",
            in: "query",
            required: false,
            schema: { type: "boolean" }
          },
          {
            name: "search",
            in: "query",
            required: false,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": arrayResponse("Menu items", "#/components/schemas/MenuItem")
        }
      },
      post: {
        tags: ["Menu Items"],
        summary: "Create menu item",
        security: bearerSecurity,
        requestBody: body("#/components/schemas/CreateMenuItem"),
        responses: {
          "201": response("Menu item created", "#/components/schemas/MenuItem"),
          "404": response("Menu category not found", "#/components/schemas/ErrorResponse")
        }
      }
    },
    "/api/menu/items/{id}": {
      get: {
        tags: ["Menu Items"],
        summary: "Get menu item by id",
        parameters: [idParam],
        responses: {
          "200": response("Menu item", "#/components/schemas/MenuItem"),
          "404": response("Menu item not found", "#/components/schemas/ErrorResponse")
        }
      },
      patch: {
        tags: ["Menu Items"],
        summary: "Update menu item",
        security: bearerSecurity,
        parameters: [idParam],
        requestBody: body("#/components/schemas/UpdateMenuItem"),
        responses: {
          "200": response("Menu item updated", "#/components/schemas/MenuItem"),
          "404": response("Menu item or category not found", "#/components/schemas/ErrorResponse")
        }
      },
      delete: {
        tags: ["Menu Items"],
        summary: "Delete menu item",
        security: bearerSecurity,
        parameters: [idParam],
        responses: {
          "204": { description: "Menu item deleted" },
          "404": response("Menu item not found", "#/components/schemas/ErrorResponse")
        }
      }
    },
    "/api/reservations": {
      get: {
        tags: ["Reservations"],
        summary: "List reservations",
        security: bearerSecurity,
        parameters: [
          pageQuery,
          limitQuery,
          { name: "status", in: "query", required: false, schema: { $ref: "#/components/schemas/ReservationStatus" } },
          { name: "date", in: "query", required: false, schema: { type: "string", format: "date" } }
        ],
        responses: {
          "200": response("Paginated reservations", "#/components/schemas/PaginatedReservations")
        }
      },
      post: {
        tags: ["Reservations"],
        summary: "Create reservation",
        security: bearerSecurity,
        requestBody: body("#/components/schemas/CreateReservation"),
        responses: {
          "201": response("Reservation created", "#/components/schemas/Reservation"),
          "404": response("Customer not found", "#/components/schemas/ErrorResponse")
        }
      }
    },
    "/api/reservations/{id}": {
      get: {
        tags: ["Reservations"],
        summary: "Get reservation by id",
        security: bearerSecurity,
        parameters: [idParam],
        responses: {
          "200": response("Reservation", "#/components/schemas/Reservation"),
          "404": response("Reservation not found", "#/components/schemas/ErrorResponse")
        }
      },
      delete: {
        tags: ["Reservations"],
        summary: "Delete reservation",
        security: bearerSecurity,
        parameters: [idParam],
        responses: {
          "204": { description: "Reservation deleted" },
          "404": response("Reservation not found", "#/components/schemas/ErrorResponse")
        }
      }
    },
    "/api/reservations/{id}/status": {
      patch: {
        tags: ["Reservations"],
        summary: "Update reservation status",
        security: bearerSecurity,
        parameters: [idParam],
        requestBody: body("#/components/schemas/UpdateReservationStatus"),
        responses: {
          "200": response("Reservation updated", "#/components/schemas/Reservation"),
          "404": response("Reservation not found", "#/components/schemas/ErrorResponse")
        }
      }
    },
    "/api/delivery/orders": {
      get: {
        tags: ["Delivery Orders"],
        summary: "List delivery orders",
        security: bearerSecurity,
        parameters: [
          pageQuery,
          limitQuery,
          { name: "status", in: "query", required: false, schema: { $ref: "#/components/schemas/DeliveryOrderStatus" } }
        ],
        responses: {
          "200": response("Paginated delivery orders", "#/components/schemas/PaginatedDeliveryOrders")
        }
      },
      post: {
        tags: ["Delivery Orders"],
        summary: "Create delivery order",
        security: bearerSecurity,
        requestBody: body("#/components/schemas/CreateDeliveryOrder"),
        responses: {
          "201": response("Delivery order created", "#/components/schemas/DeliveryOrder"),
          "400": response("Unavailable menu item", "#/components/schemas/ErrorResponse"),
          "404": response("Customer not found", "#/components/schemas/ErrorResponse")
        }
      }
    },
    "/api/delivery/orders/{id}": {
      get: {
        tags: ["Delivery Orders"],
        summary: "Get delivery order by id",
        security: bearerSecurity,
        parameters: [idParam],
        responses: {
          "200": response("Delivery order", "#/components/schemas/DeliveryOrder"),
          "404": response("Delivery order not found", "#/components/schemas/ErrorResponse")
        }
      },
      delete: {
        tags: ["Delivery Orders"],
        summary: "Delete delivery order",
        security: bearerSecurity,
        parameters: [idParam],
        responses: {
          "204": { description: "Delivery order deleted" },
          "404": response("Delivery order not found", "#/components/schemas/ErrorResponse")
        }
      }
    },
    "/api/delivery/orders/{id}/status": {
      patch: {
        tags: ["Delivery Orders"],
        summary: "Update delivery order status",
        security: bearerSecurity,
        parameters: [idParam],
        requestBody: body("#/components/schemas/UpdateDeliveryOrderStatus"),
        responses: {
          "200": response("Delivery order updated", "#/components/schemas/DeliveryOrder"),
          "404": response("Delivery order not found", "#/components/schemas/ErrorResponse")
        }
      }
    }
  },
  components: {
    schemas: {
      ErrorResponse: errorResponseSchema,
      PaginationMeta: paginationMetaSchema,
      HealthResponse: {
        type: "object",
        properties: {
          status: { type: "string", enum: ["ok"] },
          service: { type: "string", example: "api" },
          timestamp: { type: "string", format: "date-time" }
        },
        required: ["status", "service", "timestamp"]
      },
      Register: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100 },
          email: { type: "string", format: "email", maxLength: 255 },
          password: { type: "string", minLength: 8, maxLength: 72, format: "password" },
          phone: { type: "string", minLength: 8, maxLength: 20 },
          address: { type: "string", minLength: 5, maxLength: 255 }
        },
        required: ["name", "email", "password"]
      },
      Login: {
        type: "object",
        properties: {
          email: { type: "string", format: "email", maxLength: 255 },
          password: { type: "string", minLength: 1, maxLength: 72, format: "password" }
        },
        required: ["email", "password"]
      },
      AuthSession: {
        type: "object",
        properties: {
          customer: { $ref: "#/components/schemas/Customer" },
          accessToken: { type: "string" }
        },
        required: ["customer", "accessToken"]
      },
      Customer: customerSchema,
      CreateCustomer: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100 },
          email: { type: "string", format: "email", maxLength: 255 },
          phone: { type: "string", minLength: 8, maxLength: 20 },
          address: { type: "string", minLength: 5, maxLength: 255 }
        },
        required: ["name", "email"]
      },
      UpdateCustomer: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100 },
          email: { type: "string", format: "email", maxLength: 255 },
          phone: { type: "string", minLength: 8, maxLength: 20 },
          address: { type: "string", minLength: 5, maxLength: 255 }
        }
      },
      PaginatedCustomers: {
        type: "object",
        properties: {
          data: { type: "array", items: { $ref: "#/components/schemas/Customer" } },
          meta: { $ref: "#/components/schemas/PaginationMeta" }
        },
        required: ["data", "meta"]
      },
      MenuCategory: menuCategorySchema,
      CreateMenuCategory: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 2, maxLength: 80 },
          description: { type: "string", maxLength: 500 }
        },
        required: ["name"]
      },
      UpdateMenuCategory: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 2, maxLength: 80 },
          description: { type: "string", maxLength: 500 }
        }
      },
      MenuItem: menuItemSchema,
      CreateMenuItem: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100 },
          description: { type: "string", maxLength: 500 },
          price: { type: "number", minimum: 0.01 },
          imageUrl: { type: "string", format: "uri", maxLength: 255 },
          available: { type: "boolean", default: true },
          categoryId: { type: "string", format: "uuid" }
        },
        required: ["name", "price", "categoryId"]
      },
      UpdateMenuItem: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 2, maxLength: 100 },
          description: { type: "string", maxLength: 500 },
          price: { type: "number", minimum: 0.01 },
          imageUrl: { type: "string", format: "uri", maxLength: 255 },
          available: { type: "boolean" },
          categoryId: { type: "string", format: "uuid" }
        }
      },
      ReservationStatus: {
        type: "string",
        enum: ["PENDING", "CONFIRMED", "CANCELLED"]
      },
      Reservation: reservationSchema,
      CreateReservation: {
        type: "object",
        properties: {
          reservationDate: { type: "string", format: "date-time" },
          peopleCount: { type: "integer", minimum: 1, maximum: 20 },
          notes: { type: "string", maxLength: 500 }
        },
        required: ["reservationDate", "peopleCount"]
      },
      UpdateReservationStatus: {
        type: "object",
        properties: {
          status: { $ref: "#/components/schemas/ReservationStatus" }
        },
        required: ["status"]
      },
      PaginatedReservations: {
        type: "object",
        properties: {
          data: { type: "array", items: { $ref: "#/components/schemas/Reservation" } },
          meta: { $ref: "#/components/schemas/PaginationMeta" }
        },
        required: ["data", "meta"]
      },
      DeliveryOrderStatus: {
        type: "string",
        enum: ["PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"]
      },
      DeliveryOrderItem: deliveryOrderItemSchema,
      DeliveryOrder: deliveryOrderSchema,
      CreateDeliveryOrder: {
        type: "object",
        properties: {
          deliveryAddress: { type: "string", minLength: 5, maxLength: 255 },
          items: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              properties: {
                menuItemId: { type: "string", format: "uuid" },
                quantity: { type: "integer", minimum: 1, maximum: 20 }
              },
              required: ["menuItemId", "quantity"]
            }
          }
        },
        required: ["deliveryAddress", "items"]
      },
      UpdateDeliveryOrderStatus: {
        type: "object",
        properties: {
          status: { $ref: "#/components/schemas/DeliveryOrderStatus" }
        },
        required: ["status"]
      },
      PaginatedDeliveryOrders: {
        type: "object",
        properties: {
          data: { type: "array", items: { $ref: "#/components/schemas/DeliveryOrder" } },
          meta: { $ref: "#/components/schemas/PaginationMeta" }
        },
        required: ["data", "meta"]
      }
    },
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};

export function setupOpenApi(app: INestApplication): void {
  SwaggerModule.setup("api/swagger", app, openApiDocument);

  app.getHttpAdapter().get("/api/openapi.json", (_request: unknown, response: JsonResponse) => {
    response.json(openApiDocument);
  });

  app.use(
    "/api/docs",
    apiReference({
      content: openApiDocument,
      pageTitle: "Restaurant API Docs"
    })
  );
}
