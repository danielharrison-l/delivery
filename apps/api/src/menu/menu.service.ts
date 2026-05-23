import { ConflictException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { handlePrismaError } from "../common/errors/prisma-error.utils";
import { menuErrors } from "./menu.errors";
import { menuMapper } from "./menu.mapper";
import type { MenuRepositoryContract } from "./menu.repository.contract";
import { MENU_REPOSITORY } from "./menu.tokens";
import type {
  MenuCategoryCreateData,
  MenuCategoryDto,
  MenuCategoryRecord,
  MenuCategoryUpdateData,
  MenuItemCreateData,
  MenuItemDto,
  MenuItemFindManyQuery,
  MenuItemRecord,
  MenuItemUpdateData
} from "./menu.types";

@Injectable()
export class MenuService {
  private readonly logger = new Logger(MenuService.name);

  constructor(
    @Inject(MENU_REPOSITORY)
    private readonly menuRepository: MenuRepositoryContract
  ) {}

  async findCategories(): Promise<MenuCategoryDto[]> {
    try {
      const categories = await this.menuRepository.findCategories();
      return categories.map((category) => menuMapper.toCategoryDto(category));
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findCategory(id: string): Promise<MenuCategoryDto> {
    const category = await this.findCategoryRecordOrFail(id);
    return menuMapper.toCategoryDto(category);
  }

  async createCategory(data: MenuCategoryCreateData): Promise<MenuCategoryDto> {
    try {
      const category = await this.menuRepository.createCategory(menuMapper.toCategoryCreateData(data));
      return menuMapper.toCategoryDto(category);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async updateCategory(id: string, data: MenuCategoryUpdateData): Promise<MenuCategoryDto> {
    await this.findCategoryRecordOrFail(id);

    try {
      const category = await this.menuRepository.updateCategory(id, menuMapper.toCategoryUpdateData(data));
      return menuMapper.toCategoryDto(category);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async removeCategory(id: string): Promise<void> {
    await this.findCategoryRecordOrFail(id);

    try {
      await this.menuRepository.deleteCategory(id);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findItems(query: MenuItemFindManyQuery): Promise<MenuItemDto[]> {
    try {
      const items = await this.menuRepository.findItems(query);
      return items.map((item) => menuMapper.toItemDto(item));
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findItem(id: string): Promise<MenuItemDto> {
    const item = await this.findItemRecordOrFail(id);
    return menuMapper.toItemDto(item);
  }

  async createItem(data: MenuItemCreateData): Promise<MenuItemDto> {
    await this.findCategoryRecordOrFail(data.categoryId);

    try {
      const item = await this.menuRepository.createItem(menuMapper.toItemCreateData(data));
      return menuMapper.toItemDto(item);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async updateItem(id: string, data: MenuItemUpdateData): Promise<MenuItemDto> {
    await this.findItemRecordOrFail(id);

    if (data.categoryId) {
      await this.findCategoryRecordOrFail(data.categoryId);
    }

    try {
      const item = await this.menuRepository.updateItem(id, menuMapper.toItemUpdateData(data));
      return menuMapper.toItemDto(item);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async removeItem(id: string): Promise<void> {
    await this.findItemRecordOrFail(id);

    try {
      await this.menuRepository.deleteItem(id);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  private async findCategoryRecordOrFail(id: string): Promise<MenuCategoryRecord> {
    try {
      const category = await this.menuRepository.findCategoryById(id);

      if (!category) {
        throw new NotFoundException(menuErrors.categoryNotFound);
      }

      return category;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.handleDatabaseError(error);
    }
  }

  private async findItemRecordOrFail(id: string): Promise<MenuItemRecord> {
    try {
      const item = await this.menuRepository.findItemById(id);

      if (!item) {
        throw new NotFoundException(menuErrors.itemNotFound);
      }

      return item;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.handleDatabaseError(error);
    }
  }

  private handleDatabaseError(error: unknown): never {
    return handlePrismaError(error, {
      context: MenuService.name,
      logger: this.logger,
      knownErrors: {
        P2002: () => new ConflictException(menuErrors.categoryAlreadyExists),
        P2025: () => new NotFoundException(menuErrors.itemNotFound)
      }
    });
  }
}
