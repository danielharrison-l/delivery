import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { handlePrismaError } from "../common/errors/prisma-error.utils";
import { createPaginatedResult } from "../common/pagination/pagination.utils";
import { deliveryErrors } from "./delivery.errors";
import { deliveryMapper } from "./delivery.mapper";
import type { DeliveryRepositoryContract } from "./delivery.repository.contract";
import { DELIVERY_REPOSITORY } from "./delivery.tokens";
import type {
  DeliveryMenuItemPriceRecord,
  DeliveryAddressRecord,
  DeliveryOrderCreateData,
  DeliveryOrderDto,
  DeliveryOrderFindManyQuery,
  DeliveryOrderRecord,
  DeliveryOrdersPageDto,
  DeliveryOrderStatusUpdateData
} from "./delivery.types";

@Injectable()
export class DeliveryService {
  private readonly logger = new Logger(DeliveryService.name);

  constructor(
    @Inject(DELIVERY_REPOSITORY)
    private readonly deliveryRepository: DeliveryRepositoryContract
  ) {}

  async findMany(query: DeliveryOrderFindManyQuery): Promise<DeliveryOrdersPageDto> {
    try {
      const orders = await this.deliveryRepository.findManyPaginated(query);
      return createPaginatedResult(
        orders.data.map((order) => deliveryMapper.toDto(order)),
        query,
        orders.total
      );
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findOne(id: string): Promise<DeliveryOrderDto> {
    const order = await this.findRecordOrFail(id);
    return deliveryMapper.toDto(order);
  }

  async findOneForCustomer(id: string, customerId: string): Promise<DeliveryOrderDto> {
    const order = await this.findRecordForCustomerOrFail(id, customerId);
    return deliveryMapper.toDto(order);
  }

  async create(data: DeliveryOrderCreateData): Promise<DeliveryOrderDto> {
    await this.ensureCustomerExists(data.customerId);
    const deliveryAddress = await this.resolveDeliveryAddress(data);
    const menuItems = await this.findAvailableMenuItemsOrFail(data);
    const menuItemById = new Map(menuItems.map((item) => [item.id, item]));
    const totalAmount = this.calculateTotalAmount(data, menuItemById);

    try {
      const order = await this.deliveryRepository.create(
        deliveryMapper.toCreateData(data, deliveryAddress, totalAmount, this.toOrderItems(data, menuItemById))
      );
      return deliveryMapper.toDto(order);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async updateStatus(id: string, data: DeliveryOrderStatusUpdateData): Promise<DeliveryOrderDto> {
    await this.findRecordOrFail(id);

    try {
      const order = await this.deliveryRepository.updateStatus(id, deliveryMapper.toStatusUpdateData(data));
      return deliveryMapper.toDto(order);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async updateStatusForCustomer(
    id: string,
    customerId: string,
    data: DeliveryOrderStatusUpdateData
  ): Promise<DeliveryOrderDto> {
    await this.findRecordForCustomerOrFail(id, customerId);

    try {
      const order = await this.deliveryRepository.updateStatus(id, deliveryMapper.toStatusUpdateData(data));
      return deliveryMapper.toDto(order);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async remove(id: string): Promise<void> {
    await this.findRecordOrFail(id);

    try {
      await this.deliveryRepository.delete(id);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async removeForCustomer(id: string, customerId: string): Promise<void> {
    await this.findRecordForCustomerOrFail(id, customerId);

    try {
      await this.deliveryRepository.delete(id);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  private async ensureCustomerExists(id: string): Promise<void> {
    try {
      const exists = await this.deliveryRepository.customerExists(id);

      if (!exists) {
        throw new NotFoundException(deliveryErrors.customerNotFound);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.handleDatabaseError(error);
    }
  }

  private async findAvailableMenuItemsOrFail(data: DeliveryOrderCreateData): Promise<DeliveryMenuItemPriceRecord[]> {
    try {
      const itemIds = data.items.map((item) => item.menuItemId);
      const menuItems = await this.deliveryRepository.findAvailableMenuItemsByIds(itemIds);

      if (menuItems.length !== new Set(itemIds).size) {
        throw new BadRequestException(deliveryErrors.unavailableItems);
      }

      return menuItems;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      this.handleDatabaseError(error);
    }
  }

  private async resolveDeliveryAddress(data: DeliveryOrderCreateData): Promise<string> {
    if (data.addressId) {
      const address = await this.findAddressForCustomerOrFail(data.addressId, data.customerId);
      return deliveryMapper.toAddressText(address);
    }

    if (data.deliveryAddress) {
      return data.deliveryAddress;
    }

    throw new BadRequestException(deliveryErrors.addressNotFound);
  }

  private async findAddressForCustomerOrFail(id: string, customerId: string): Promise<DeliveryAddressRecord> {
    try {
      const address = await this.deliveryRepository.findCustomerAddressById(id);

      if (!address || address.customerId !== customerId) {
        throw new NotFoundException(deliveryErrors.addressNotFound);
      }

      return address;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.handleDatabaseError(error);
    }
  }

  private calculateTotalAmount(
    data: DeliveryOrderCreateData,
    menuItemById: Map<string, DeliveryMenuItemPriceRecord>
  ): Prisma.Decimal {
    return data.items.reduce((total, item) => {
      const menuItem = menuItemById.get(item.menuItemId);
      const price = new Prisma.Decimal(menuItem?.price ?? 0);

      return total.add(price.mul(item.quantity));
    }, new Prisma.Decimal(0));
  }

  private toOrderItems(
    data: DeliveryOrderCreateData,
    menuItemById: Map<string, DeliveryMenuItemPriceRecord>
  ): Array<{ menuItemId: string; quantity: number; unitPrice: Prisma.Decimal }> {
    return data.items.map((item) => {
      const menuItem = menuItemById.get(item.menuItemId);

      if (!menuItem) {
        throw new BadRequestException(deliveryErrors.unavailableItems);
      }

      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: menuItem.price
      };
    });
  }

  private async findRecordOrFail(id: string): Promise<DeliveryOrderRecord> {
    try {
      const order = await this.deliveryRepository.findById(id);

      if (!order) {
        throw new NotFoundException(deliveryErrors.notFound);
      }

      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.handleDatabaseError(error);
    }
  }

  private async findRecordForCustomerOrFail(id: string, customerId: string): Promise<DeliveryOrderRecord> {
    const order = await this.findRecordOrFail(id);

    if (order.customerId !== customerId) {
      throw new NotFoundException(deliveryErrors.notFound);
    }

    return order;
  }

  private handleDatabaseError(error: unknown): never {
    return handlePrismaError(error, {
      context: DeliveryService.name,
      logger: this.logger,
      knownErrors: {
        P2025: () => new NotFoundException(deliveryErrors.notFound)
      }
    });
  }
}
