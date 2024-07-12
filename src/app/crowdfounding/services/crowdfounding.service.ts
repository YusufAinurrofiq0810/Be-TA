import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CrowdfoundingRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateCrowdfoundingDto, UpdateCrowdfoundingDto } from '../dtos';
import { wihtdrawCrowdfounding } from '../dtos/create-withdraw.dto';
import { Crowdfounding } from '@prisma/client';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
import { title } from 'process';

@Injectable()
export class CrowdfoundingService {
  constructor(
    private readonly crowdfoundingRepository: CrowdfoundingRepository,
  ) { }

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
        image: CreateCrowdfoundingDto.image,
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

  async withdraw(id: string, body: wihtdrawCrowdfounding) {
    const { amount } = body;
    const crowdfounding: Crowdfounding & { Donation: { user: { username: string } } } = await this.crowdfoundingRepository.firtsOrThrow({ id });

    if (!crowdfounding) throw new NotFoundException('Crowd Founding tidak ditemukan')
    if (+crowdfounding.donationCollected < amount) throw new BadRequestException(`Tidak bisa menarik donasi dengan sejumlah ${amount}. Donasi terkumpul ${crowdfounding.donationCollected}`)

    await this.crowdfoundingRepository.update({ id }, { donationCollected: crowdfounding.donationCollected - amount })

    return { message: `success withdraw ${amount}` }
  }

  // async export(id: string) {
  //   const crowdfounding: Crowdfounding & {
  //     Donation: {
  //       amount: any; status: any; user: { username: string };
  //     }
  //   } = await this.crowdfoundingRepository.firtsOrThrow({ id });

  //   console.log(crowdfounding);


  //   if (!crowdfounding) throw new NotFoundException('Crowdfounding tidak ditemukan')

  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet('Crowdfounding');

  //   worksheet.columns = [
  //     { header: 'Judul Donasi', key: 'title', width: 30 },
  //     { header: 'Donation Collected', key: 'donationCollected', width: 30 },
  //     { header: 'Donation Target', key: 'donationTarget', width: 30 },
  //     { header: 'username', key: 'username', width: 30 },
  //     { header: 'amount', key: 'amount', width: 30 },
  //     { header: 'status', key: 'status', width: 30 },
  //   ];

  //   worksheet.addRow({
  //     title: crowdfounding.title,
  //     donationCollected: crowdfounding.donationCollected,
  //     donationTarget: crowdfounding.donationTarget,
  //     user: crowdfounding.Donation.user.username,
  //     amount: crowdfounding.Donation.amount,
  //     status: crowdfounding.Donation.status,

  //   });

  //   const buffer = await workbook.xlsx.writeBuffer();
  //   return buffer;


  // const workbook = new ExcelJS.Workbook();
  // const worksheet = workbook.addWorksheet('Crowdfounding');
  // worksheet.columns = [
  //   { header: 'ID', key: 'id', width: 5 },
  //   { header: 'Title', key: 'title', width: 30 },
  //   { header: 'Donation Collected', key: 'donationCollected', width: 30 },
  //   { header: 'Donation Target', key: 'donationTarget', width: 30 },
  //   { header: 'Donation Start Date', key: 'donationStartDate', width: 30 },
  //   { header: 'Donation Finished Date', key: 'donationFinishedDate', width: 30 },
  //   { header: 'Created At', key: 'createdAt', width: 30 },
  //   { header: 'Updated At', key: 'updatedAt', width: 30 },
  //   { header: 'Deleted At', key: 'deletedAt', width: 30 },
  // ];
  // worksheet.addRow({
  //   id: crowdfounding.id,
  //   title: crowdfounding.title,
  //   donationCollected: crowdfounding.donationCollected,
  //   donationTarget: crowdfounding.donationTarget,
  //   donationStartDate: crowdfounding.donationStartDate,
  //   donationFinishedDate: crowdfounding.donationFinishedDate,
  //   createdAt: crowdfounding.createdAt,
  //   updatedAt: crowdfounding.updatedAt,
  //   deletedAt: crowdfounding.deletedAt,
  // });

  // const buffer = await workbook.xlsx.writeBuffer();
  // return buffer;
}

