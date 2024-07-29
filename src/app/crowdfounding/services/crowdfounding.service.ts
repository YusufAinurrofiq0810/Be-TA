import { BadRequestException, Injectable, NotFoundException, Res } from '@nestjs/common';
import { CrowdfoundingRepository, Filter as FilterCrowdfounding } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateCrowdfoundingDto, UpdateCrowdfoundingDto } from '../dtos';
import { wihtdrawCrowdfounding } from '../dtos/create-withdraw.dto';
import { Crowdfounding, Prisma, status } from '@prisma/client';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
import { PrismaService } from 'src/platform/database/services/prisma.service';
// import { title } from 'process';

@Injectable()
export class CrowdfoundingService {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly crowdfoundingRepository: CrowdfoundingRepository, private readonly prismaService: PrismaService,
  ) { }

  public paginate(paginateDto: PaginationQueryDto, search?: string) {
    const querySearch = search?.trim().toLowerCase().split(' ');
    const filter: FilterCrowdfounding = {
      where: {
        deletedAt: null
      }
    }
    if (querySearch && querySearch.length > 0) {
      const queryWhereOrInput: Prisma.CrowdfoundingWhereInput = { OR: [...querySearch.map((item: string): Prisma.CrowdfoundingWhereInput => ({ title: { contains: item, mode: 'insensitive' } }))] }
      filter.where = {
        ...filter.where,
        ...queryWhereOrInput
      }
    }
    return this.crowdfoundingRepository.paginate(paginateDto, filter);
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
      if (new Date(CreateCrowdfoundingDto.donationStartDate) > new Date(CreateCrowdfoundingDto.donationFinishedDate)) {
        throw new BadRequestException('Donation start date must be less than donation finished date');
      }
      return this.crowdfoundingRepository.create({
        title: CreateCrowdfoundingDto.title,
        statusDonasi: CreateCrowdfoundingDto.status,
        image: CreateCrowdfoundingDto.image,
        donationTarget: Number(CreateCrowdfoundingDto.donationTarget),
        donationCollected: Number(CreateCrowdfoundingDto.donationCollected),
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
      const oldData = await this.crowdfoundingRepository.firtsOrThrow({ id });
      console.log(oldData);

      return this.crowdfoundingRepository.update(
        { id },
        UpdateCrowdfoundingDto,
        oldData,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async withdraw(id: string, body: wihtdrawCrowdfounding) {
    const { amount } = body;
    const crowdfounding: Crowdfounding & { Donation: { user: { username: string } } } = await this.crowdfoundingRepository.firtsOrThrow({ id });

    if (!crowdfounding) throw new NotFoundException('Crowd Founding tidak ditemukan')
    if (+crowdfounding.donationCollected < amount) throw new BadRequestException(`Tidak bisa menarik donasi dengan sejumlah ${amount}. Donasi terkumpul ${crowdfounding.donationCollected}`)

    const newData = { donationCollected: +crowdfounding.donationCollected - amount };
    await this.crowdfoundingRepository.update({ id }, newData, crowdfounding);

    return { message: `success withdraw ${amount}` }
  }

  public async exportToExcel(res: Response, id: string) {
    const crowdfoundings: any = await this.crowdfoundingRepository.firtsOrThrow({ id: id, Donation: {} })
    if (!crowdfoundings) throw new NotFoundException('Crowdfounding not found');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Crowdfounding');
    worksheet.columns = [
      { header: 'Nama Donasi', key: 'title', width: 30 },
      {
        header: 'Status Donasi',
        key
          : 'statusDonasi',
        width: 15,
      },
      {
        header: 'Donasi Target',
        key: 'donationTarget',
        width: 15,
      },
      {
        header: 'Donasi Terkumpul',
        key: 'donationCollected',
        width: 15,
      },
      {
        header: 'Donasi dimulai',
        key: 'donationStartDate',
        width: 20,
      },
      {
        header: 'Donasi berakhir',
        key: 'donationFinishedDate',
        width: 20,
      },
      {
        header: 'Nama Pengirim',
        key: 'donorUsername',
        width: 20,
      },
      {
        header: 'Jumlah Donasi',
        key: 'donationAmount',
        width: 20,
      },
      {
        header: 'Status Donasi',
        key: 'status',
        width: 20,
      }
    ];
    crowdfoundings?.Donation?.forEach((Donation: any) => {
      worksheet.addRow({
        title: crowdfoundings.title,
        statusDonasi: crowdfoundings.statusDonasi,
        donationTarget: crowdfoundings.donationTarget,
        donationCollected: crowdfoundings.donationCollected,
        donationStartDate: crowdfoundings.donationStartDate,
        donationFinishedDate: crowdfoundings.donationFinishedDate,
        donorUsername: Donation.user.username,
        donationAmount: Donation.amount,
        status: Donation.status,
      });

    });
    // Set header styling
    worksheet.getRow(1).font = { bold: true };

    // Write to response
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=crowdfounding_all_data.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  }

}

