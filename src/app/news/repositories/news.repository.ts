import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
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
  constructor(private readonly prisma: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prisma.$transaction([
      this.prisma.news.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { deletedAt: null, ...filter?.where },
        ...filter,
      }),
      this.prisma.news.count({ where: { deletedAt: null, ...filter?.where } }),
    ]);
    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.NewsCreateInput) {
    return this.prisma.news.create({ data });
  }

  public async update(
    where: Prisma.NewsWhereUniqueInput,
    data: Prisma.NewsUpdateInput,
  ) {
    return this.prisma.news.update({ where, data });
  }

  public async delete(where: Prisma.NewsWhereUniqueInput) {
    return this.prisma.news.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async findFirstOrThrow(
    where: Prisma.NewsWhereUniqueInput,
    select?: Prisma.NewsSelect,
  ) {
    const data = await this.prisma.news.findFirst({ where, select });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Omit<Filter, 'include'>) {
    return this.prisma.news.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prisma.news.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prisma.news.count(filter)) > 0;
  }
}
