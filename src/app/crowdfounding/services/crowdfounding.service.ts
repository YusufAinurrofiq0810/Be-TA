import { Injectable } from '@nestjs/common';
import { CrowdfoundingRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateCrowdfoundingDto, UpdateCrowdfoundingDto } from '../dtos';
// import { Response } from 'express';
// import * as ExcelJS from 'exceljs';

@Injectable()
export class CrowdfoundingService {
  constructor(
    private readonly crowdfoundingRepository: CrowdfoundingRepository,
  ) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.crowdfoundingRepository.paginate(paginateDto);
  }
  public detail(id: string) {
    try {
      return this.crowdfoundingRepository.firtsOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  public async destroy(id: string) {
    try {
      return this.crowdfoundingRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  public async create(CreateCrowdfoundingDto: CreateCrowdfoundingDto) {
    try {
      return this.crowdfoundingRepository.create({
        title: CreateCrowdfoundingDto.title,
        statusDonasi: CreateCrowdfoundingDto.status,
        donationTarget: CreateCrowdfoundingDto.donationTarget,
        donationCollected: CreateCrowdfoundingDto.donationCollected,
        donationStartDate: CreateCrowdfoundingDto.donationStartDate,
        donationFinishedDate: CreateCrowdfoundingDto.donationFinishedDate,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  public async update(
    id: string,
    UpdateCrowdfoundingDto: UpdateCrowdfoundingDto,
  ) {
    try {
      return this.crowdfoundingRepository.update(
        { id },
        UpdateCrowdfoundingDto,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // async exportexcel(response: Response) {
  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet('Sample Data');

  //   worksheet.columns = [
  //     { header: 'Title', key: 'title' },
  //     { header: 'Status', key: 'status_donasi' },
  //     { header: 'Donation Target', key: 'donation_target' },
  //     { header: 'Donation Collected', key: 'donation_collected' },
  //     { header: 'Donation Start Date', key: 'donation_start_date' },
  //     { header: 'Donation Finished Date', key: 'donation_finished_date' },
  //   ];
  //   const data = await this.crowdfoundingRepository.find({
  //     select: {
  //       title: true,
  //       status_donasi: true,
  //       donation_target: true,
  //       donation_collected: true,
  //       donation_start_date: true,
  //       donation_finished_date: true,
  //     },
  //   });
  //   worksheet.addRows(data);
  //   workbook.xlsx.write(response).then(function () {
  //     response.status(200).end();
  //   });
  // }
}
