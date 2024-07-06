import { Injectable } from '@nestjs/common';
import { Crowdfounding, Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PrismaService } from 'src/platform/database/services/prisma.service';

type Filter = {
  where?: Prisma.CrowdfoundingWhereInput;
  orderBy?: Prisma.CrowdfoundingOrderByWithRelationInput;
  cursor?: Prisma.CrowdfoundingWhereUniqueInput;
  take?: number;
  skip?: number;
};
@Injectable()
export class CrowdfoundingRepository {
  constructor(private readonly PrismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.PrismaService.$transaction([
      this.PrismaService.crowdfounding.findMany({
        skip: (+page - 1) * +limit,
        take: +limit,
        where: { deletedAt: null, ...filter?.where },
        ...filter,
      }),
      this.PrismaService.crowdfounding.count(),
    ]);
    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.CrowdfoundingCreateInput) {
    return this.PrismaService.crowdfounding.create({ data });
  }

  public async update(
    where: Prisma.CrowdfoundingWhereUniqueInput,
    data: Prisma.CrowdfoundingUpdateInput,
  ) {
    return this.PrismaService.crowdfounding.update({ where, data });
  }

  public async delete(where: Prisma.CrowdfoundingWhereUniqueInput) {
    return this.PrismaService.crowdfounding.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  // public async findById(id: string): Promise<Crowdfounding | null>{
  //   return this.PrismaService.crowdfounding.findUnique({
  //     where: {id},
  //   });
  // }
  public async updatedonationcollected(id:string, newAmount: string): Promise<Crowdfounding> {
    return this.PrismaService.crowdfounding.update({
      where: {id},
      data: { donationCollected: newAmount }
    });
  }

  public async firtsOrThrow(
    where: Partial<Prisma.CrowdfoundingWhereUniqueInput>,
    select?: Prisma.CrowdfoundingSelect,
  ) {
    const data = await this.PrismaService.crowdfounding.findFirst({
      where,
      select,
    });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Omit<Filter, 'include'>) {
    return this.PrismaService.crowdfounding.findMany(filter);
  }
  public async count(filter: Omit<Filter, 'include'>) {
    return this.PrismaService.crowdfounding.count(filter);
  }
  public async any(filter: Omit<Filter, 'include'>) {
    return this.PrismaService.crowdfounding.count(filter);
  }
}
