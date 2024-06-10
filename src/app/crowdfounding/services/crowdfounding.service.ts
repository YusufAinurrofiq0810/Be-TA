import { Injectable } from '@nestjs/common';
import { CrowdfoundingRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateCrowdfoundingDto, UpdateCrowdfoundingDto } from '../dtos';

@Injectable()
export class CrowdfoundingService {
  constructor(
    private readonly crowdfoundingRepository: CrowdfoundingRepository,
  ) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.crowdfoundingRepository.paginate(paginateDto);
  }
  public detail(id: string) {
    const crowdfoundingId: number = Number(id);
    try {
      return this.crowdfoundingRepository.firtsOrThrow({
        id: crowdfoundingId,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  public async destroy(id: string) {
    const crowdfoundingId: number = Number(id);
    try {
      return this.crowdfoundingRepository.delete({
        id: crowdfoundingId,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  public async create(CreateCrowdfoundingDto: CreateCrowdfoundingDto) {
    try {
      return this.crowdfoundingRepository.create({
        title: CreateCrowdfoundingDto.Title,
        status_donasi: CreateCrowdfoundingDto.Status,
        donation_target: CreateCrowdfoundingDto.Donation_Target,
        donation_collected: CreateCrowdfoundingDto.Donation_Collected,
        donation_start_date: CreateCrowdfoundingDto.Donation_Start_Date,
        donation_finished_date: CreateCrowdfoundingDto.Donation_Finished_Date,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  public async update(
    id: string,
    UpdateCrowdfoundingDto: UpdateCrowdfoundingDto,
  ) {
    const crowdfoundingId: number = Number(id);
    try {
      return this.crowdfoundingRepository.update(
        { id: crowdfoundingId },
        UpdateCrowdfoundingDto,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
