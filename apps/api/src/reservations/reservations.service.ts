import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { handlePrismaError } from "../common/errors/prisma-error.utils";
import { createPaginatedResult } from "../common/pagination/pagination.utils";
import { reservationsErrors } from "./reservations.errors";
import { reservationsMapper } from "./reservations.mapper";
import type { ReservationsRepositoryContract } from "./reservations.repository.contract";
import { RESERVATIONS_REPOSITORY } from "./reservations.tokens";
import type {
  ReservationCreateData,
  ReservationDto,
  ReservationFindManyQuery,
  ReservationRecord,
  ReservationsPageDto,
  ReservationStatusUpdateData
} from "./reservations.types";

@Injectable()
export class ReservationsService {
  private readonly logger = new Logger(ReservationsService.name);

  constructor(
    @Inject(RESERVATIONS_REPOSITORY)
    private readonly reservationsRepository: ReservationsRepositoryContract
  ) {}

  async findMany(query: ReservationFindManyQuery): Promise<ReservationsPageDto> {
    try {
      const reservations = await this.reservationsRepository.findManyPaginated(query);
      return createPaginatedResult(
        reservations.data.map((reservation) => reservationsMapper.toDto(reservation)),
        query,
        reservations.total
      );
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findOne(id: string): Promise<ReservationDto> {
    const reservation = await this.findRecordOrFail(id);
    return reservationsMapper.toDto(reservation);
  }

  async findOneForCustomer(id: string, customerId: string): Promise<ReservationDto> {
    const reservation = await this.findRecordForCustomerOrFail(id, customerId);
    return reservationsMapper.toDto(reservation);
  }

  async create(data: ReservationCreateData): Promise<ReservationDto> {
    await this.ensureCustomerExists(data.customerId);

    try {
      const reservation = await this.reservationsRepository.create(reservationsMapper.toCreateData(data));
      return reservationsMapper.toDto(reservation);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async updateStatus(id: string, data: ReservationStatusUpdateData): Promise<ReservationDto> {
    await this.findRecordOrFail(id);

    try {
      const reservation = await this.reservationsRepository.updateStatus(
        id,
        reservationsMapper.toStatusUpdateData(data)
      );
      return reservationsMapper.toDto(reservation);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async updateStatusForCustomer(
    id: string,
    customerId: string,
    data: ReservationStatusUpdateData
  ): Promise<ReservationDto> {
    await this.findRecordForCustomerOrFail(id, customerId);

    try {
      const reservation = await this.reservationsRepository.updateStatus(
        id,
        reservationsMapper.toStatusUpdateData(data)
      );
      return reservationsMapper.toDto(reservation);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async remove(id: string): Promise<void> {
    await this.findRecordOrFail(id);

    try {
      await this.reservationsRepository.delete(id);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async removeForCustomer(id: string, customerId: string): Promise<void> {
    await this.findRecordForCustomerOrFail(id, customerId);

    try {
      await this.reservationsRepository.delete(id);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  private async ensureCustomerExists(id: string): Promise<void> {
    try {
      const exists = await this.reservationsRepository.customerExists(id);

      if (!exists) {
        throw new NotFoundException(reservationsErrors.customerNotFound);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.handleDatabaseError(error);
    }
  }

  private async findRecordOrFail(id: string): Promise<ReservationRecord> {
    try {
      const reservation = await this.reservationsRepository.findById(id);

      if (!reservation) {
        throw new NotFoundException(reservationsErrors.notFound);
      }

      return reservation;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.handleDatabaseError(error);
    }
  }

  private async findRecordForCustomerOrFail(id: string, customerId: string): Promise<ReservationRecord> {
    const reservation = await this.findRecordOrFail(id);

    if (reservation.customerId !== customerId) {
      throw new NotFoundException(reservationsErrors.notFound);
    }

    return reservation;
  }

  private handleDatabaseError(error: unknown): never {
    return handlePrismaError(error, {
      context: ReservationsService.name,
      logger: this.logger,
      knownErrors: {
        P2025: () => new NotFoundException(reservationsErrors.notFound)
      }
    });
  }
}
