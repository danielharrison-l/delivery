import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Starters",
    description: "Small plates to start the meal",
    items: [
      {
        name: "Bruschetta",
        description: "Toasted bread with tomato, basil and olive oil",
        price: "24.90"
      },
      {
        name: "Crispy Polenta",
        description: "Golden polenta sticks with house sauce",
        price: "22.90"
      }
    ]
  },
  {
    name: "Main Dishes",
    description: "Signature dishes from the kitchen",
    items: [
      {
        name: "Grilled Steak",
        description: "Steak with roasted potatoes and chimichurri",
        price: "68.90"
      },
      {
        name: "Mushroom Risotto",
        description: "Creamy risotto with fresh mushrooms and parmesan",
        price: "54.90"
      }
    ]
  },
  {
    name: "Drinks",
    description: "Cold drinks and house beverages",
    items: [
      {
        name: "Fresh Lemonade",
        description: "Lemonade with mint and sparkling water",
        price: "14.90"
      },
      {
        name: "Iced Tea",
        description: "Black tea with citrus and ice",
        price: "12.90"
      }
    ]
  },
  {
    name: "Desserts",
    description: "Sweet options to finish",
    items: [
      {
        name: "Chocolate Brownie",
        description: "Warm brownie with vanilla cream",
        price: "26.90"
      },
      {
        name: "Panna Cotta",
        description: "Cream dessert with red fruit sauce",
        price: "24.90"
      }
    ]
  }
];

async function main() {
  for (const category of categories) {
    await prisma.menuCategory.upsert({
      where: { name: category.name },
      update: {
        description: category.description,
        items: {
          deleteMany: {},
          create: category.items
        }
      },
      create: {
        name: category.name,
        description: category.description,
        items: {
          create: category.items
        }
      }
    });
  }
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
