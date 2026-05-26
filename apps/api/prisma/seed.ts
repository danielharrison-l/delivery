import { PrismaClient } from "@prisma/client";
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const prisma = new PrismaClient();
const scryptAsync = promisify(scrypt);
const adminEmail = "admin@terraco.test";
const adminPassword = "Admin12345";

const categories = [
  {
    name: "Entradas",
    description: "Porções leves para começar a refeição",
    items: [
      {
        name: "Bruschetta",
        description: "Pão tostado com tomate, manjericão e azeite",
        price: "24.90"
      },
      {
        name: "Polenta Crocante",
        description: "Palitos de polenta dourados com molho da casa",
        price: "22.90"
      }
    ]
  },
  {
    name: "Pratos principais",
    description: "Pratos autorais da cozinha",
    items: [
      {
        name: "Bife Grelhado",
        description: "Bife com batatas assadas e chimichurri",
        price: "68.90"
      },
      {
        name: "Risoto de Cogumelos",
        description: "Risoto cremoso com cogumelos frescos e parmesão",
        price: "54.90"
      }
    ]
  },
  {
    name: "Bebidas",
    description: "Bebidas geladas e opções da casa",
    items: [
      {
        name: "Limonada Fresca",
        description: "Limonada com hortelã e água com gás",
        price: "14.90"
      },
      {
        name: "Chá Gelado",
        description: "Chá preto com cítricos e gelo",
        price: "12.90"
      }
    ]
  },
  {
    name: "Sobremesas",
    description: "Opções doces para finalizar",
    items: [
      {
        name: "Brownie de Chocolate",
        description: "Brownie morno com creme de baunilha",
        price: "26.90"
      },
      {
        name: "Panna Cotta",
        description: "Sobremesa cremosa com calda de frutas vermelhas",
        price: "24.90"
      }
    ]
  }
];

async function main() {
  await prisma.customer.upsert({
    where: { email: adminEmail },
    update: {
      role: "ADMIN"
    },
    create: {
      name: "Admin Terraço",
      email: adminEmail,
      passwordHash: await hashPassword(adminPassword),
      role: "ADMIN"
    }
  });

  for (const category of categories) {
    const menuCategory = await prisma.menuCategory.upsert({
      where: { name: category.name },
      update: {
        description: category.description
      },
      create: {
        name: category.name,
        description: category.description
      }
    });

    for (const item of category.items) {
      const existingItem = await prisma.menuItem.findFirst({
        where: {
          name: item.name,
          categoryId: menuCategory.id
        }
      });

      if (existingItem) {
        await prisma.menuItem.update({
          where: { id: existingItem.id },
          data: item
        });
        continue;
      }

      await prisma.menuItem.create({
        data: {
          ...item,
          categoryId: menuCategory.id
        }
      });
    }
  }
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const key = (await scryptAsync(password, salt, 64)) as Buffer;

  return `scrypt$${salt}$${Buffer.from(key).toString("hex")}`;
}

void main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
