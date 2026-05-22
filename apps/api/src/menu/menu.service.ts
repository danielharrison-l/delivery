import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async findCategories() {
    return this.prisma.menuCategory.findMany({
      orderBy: { name: "asc" }
    });
  }

  async findItems(categoryId?: string) {
    return this.prisma.menuItem.findMany({
      where: {
        available: true,
        categoryId
      },
      include: {
        category: true
      },
      orderBy: [{ category: { name: "asc" } }, { name: "asc" }]
    });
  }
}
