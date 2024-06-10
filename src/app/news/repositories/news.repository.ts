import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PrismaService } from 'src/platform/database/services/prisma.service';

type Filter = {
  where?: Prisma.NewsWhereInput;
  orderBy?: Prisma.NewsOrderByWithRelationInput;
  cursor?: Prisma.NewsWhereUniqueInput;
  take?: number;
  skip?: number;
};

@Injectable()
export class NewsRepository {
  constructor(private readonly PrismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.PrismaService.$transaction([
      this.PrismaService.news.findMany({
        skip: (+page - 1) * +limit,
        take: +limit,
        where: { deletedAt: null, ...filter?.where },
        ...filter,
      }),
      this.PrismaService.news.count(),
    ]);
    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.NewsCreateInput) {
    return this.PrismaService.news.create({ data });
  }

  public async update(
    where: Prisma.NewsWhereUniqueInput,
    data: Prisma.NewsUpdateInput,
  ) {
    return this.PrismaService.news.update({ where, data });
  }

  public async delete(where: Prisma.NewsWhereUniqueInput) {
    return this.PrismaService.news.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async firtsOrThrow(
    where: Partial<Prisma.NewsWhereUniqueInput>,
    select?: Prisma.NewsSelect,
  ) {
    const data = await this.PrismaService.news.findFirst({ where, select });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Omit<Filter, 'include'>) {
    return this.PrismaService.news.findMany(filter);
  }
  public async count(filter: Omit<Filter, 'include'>) {
    return this.PrismaService.news.count(filter);
  }
  public async any(filter: Omit<Filter, 'include'>) {
    return this.PrismaService.news.count(filter);
  }
}
