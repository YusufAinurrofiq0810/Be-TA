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
    const crowdfoundings: any = await this.crowdfoundingRepository.firtsOrThrow({ id: id, Donation: {} });
    if (!crowdfoundings) throw new NotFoundException('Crowdfounding not found');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Crowdfounding ${crowdfoundings.title}`);

    // Menambahkan informasi detail crowdfounding di bagian atas worksheet
    worksheet.addRow(['Laporan informasi detail donasi']);
    worksheet.getRow(1).font = { bold: true, size: 14 };

    worksheet.addRow(['Nama Donasi', crowdfoundings.title]);

    worksheet.addRow(['Status Donasi', crowdfoundings.statusDonasi]);

    worksheet.addRow(['Donasi Target', `Rp${crowdfoundings.donationTarget.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}`]);

    worksheet.addRow(['Donasi Terkumpul', `Rp${crowdfoundings.donationCollected.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}`]);

    worksheet.addRow(['Donasi dimulai', crowdfoundings.donationStartDate]);

    worksheet.addRow(['Donasi berakhir', crowdfoundings.donationFinishedDate]);

    // Menambahkan jarak antara informasi detail crowdfounding dan tabel donasi
    worksheet.addRow([]);

    // Menambahkan header tabel donasi
    worksheet.addRow(['Nama pengirim', 'Jumlah donasi', 'Status Pembayaran']);
    worksheet.columns = [
      { key: 'donorUsername', width: 20 },
      { key: 'donationAmount', width: 20 },
      { key: 'status', width: 20 }
    ];

    // Menambahkan data donasi ke tabel
    crowdfoundings?.Donation?.forEach((Donation: any) => {
      worksheet.addRow({
        donorUsername: Donation.user.username,
        donationAmount: Donation.amount,
        status: Donation.status,
      });
    });

    // Set header styling untuk tabel donasi
    worksheet.getRow(9).font = { bold: true }; // Mengatur baris header pada baris ke-9 agar tebal

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

