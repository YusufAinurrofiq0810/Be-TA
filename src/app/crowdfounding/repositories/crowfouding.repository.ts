import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Crowdfounding, Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.CrowdfoundingWhereInput;
  orderBy?: Prisma.CrowdfoundingOrderByWithRelationInput;
  cursor?: Prisma.CrowdfoundingWhereUniqueInput;
  take?: number;
  skip?: number;
};

@Injectable()
export class CrowdfoundingRepository {
  constructor(private readonly prisma: PrismaService) { }

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prisma.$transaction([
      this.prisma.crowdfounding.findMany({
        skip: (+page - 1) * +limit,
        take: +limit,
        include: {
          Donation: {
            select: {
              id: true,
              amount: true,
              status: true,
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
        where: { deletedAt: null, ...filter?.where },
        ...filter,
      }),
      this.prisma.crowdfounding.count({
        where: { deletedAt: null, ...filter?.where },
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.CrowdfoundingCreateInput) {
    return this.prisma.crowdfounding.create({ data });
  }

  public async update(
    where: Prisma.CrowdfoundingWhereUniqueInput,
    data: Prisma.CrowdfoundingUpdateInput,
    oldData: Prisma.CrowdfoundingCreateInput,
  ) {
    if (!data) {
      throw new BadRequestException('Invalid update data');
    }
    if (!oldData) {
      throw new NotFoundException('Existing data not found');
    }

    return this.prisma.crowdfounding.update({
      where,
      data: {
        title: data.title ?? oldData.title,
        image: data.image ?? oldData.image,
        statusDonasi: data.statusDonasi ?? oldData.statusDonasi,
        donationTarget: data.donationTarget !== undefined ? Number(data.donationTarget) : oldData.donationTarget,
        donationCollected: data.donationCollected !== undefined ? Number(data.donationCollected) : oldData.donationCollected,
        donationStartDate: data.donationStartDate ?? oldData.donationStartDate,
        donationFinishedDate: data.donationFinishedDate ?? oldData.donationFinishedDate,
      },
    });
  }

  public async delete(where: Prisma.CrowdfoundingWhereUniqueInput) {
    return this.prisma.crowdfounding.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async updatedonationcollected(id: string, newAmount: string): Promise<Crowdfounding> {
    return this.prisma.crowdfounding.update({
      where: { id },
      data: { donationCollected: +newAmount },
    });
  }

  public async firtsOrThrow(
    where: Partial<Prisma.CrowdfoundingWhereUniqueInput>,
    select?: Prisma.CrowdfoundingSelect,
  ): Promise<Crowdfounding> {
    const data = await this.prisma.crowdfounding.findFirst({
      where,
      select: {
        id: true,
        title: true,
        image: true,
        statusDonasi: true,
        donationTarget: true,
        donationCollected: true,
        donationStartDate: true,
        donationFinishedDate: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        Donation: {
          select: {
            id: true,
            amount: true,
            status: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });
    if (!data) throw new NotFoundException('Data not found');
    return data;
  }

  public async find(filter: Omit<Filter, 'include'>) {
    return this.prisma.crowdfounding.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prisma.crowdfounding.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return this.prisma.crowdfounding.count(filter);
  }
}
