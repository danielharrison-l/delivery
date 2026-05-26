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
        price: "24.90",
        imageUrl: "https://images.unsplash.com/photo-1543353071-087092ec393a?auto=format&fit=crop&w=900&q=80",
        popular: true,
        displayOrder: 5
      },
      {
        name: "Polenta Crocante",
        description: "Palitos de polenta dourados com molho da casa",
        price: "22.90",
        imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80"
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
        price: "68.90",
        imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "Risoto de Cogumelos",
        description: "Risoto cremoso com cogumelos frescos e parmesão",
        price: "54.90",
        imageUrl: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "Costela Urbana",
        description: "Costela assada lentamente com legumes, ervas frescas e molho da casa",
        price: "124.00",
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
        featured: true,
        popular: true,
        displayOrder: 1
      },
      {
        name: "Pappardelle Bosco",
        description: "Massa fresca com pesto, tomate e finalização de ervas",
        price: "89.00",
        imageUrl: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80",
        featured: true,
        popular: true,
        displayOrder: 2
      },
      {
        name: "Salmão Glacé",
        description: "Salmão grelhado com legumes frescos e molho cítrico",
        price: "112.00",
        imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80",
        featured: true,
        popular: true,
        displayOrder: 3
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
        price: "14.90",
        imageUrl: "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&w=900&q=80",
        isNew: true,
        displayOrder: 4
      },
      {
        name: "Chá Gelado",
        description: "Chá preto com cítricos e gelo",
        price: "12.90",
        imageUrl: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=900&q=80"
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
        price: "26.90",
        imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80"
      },
      {
        name: "Panna Cotta",
        description: "Sobremesa cremosa com calda de frutas vermelhas",
        price: "24.90",
        imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=80"
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
