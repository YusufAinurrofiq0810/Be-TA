import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { error } from 'console';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

type Filter = {
  where?: Prisma.CategoryWhereInput;
  orderBy?: Prisma.CategoryOrderByWithRelationInput;
  cursor?: Prisma.CategoryWhereUniqueInput;
  take?: number;
  skip?: number;
};

@Injectable()
export class CategoryRepository {
  constructor(private readonly PrismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.PrismaService.$transaction([
      this.PrismaService.category.findMany({
        skip: (+page - 1) * limit,
        take: +limit,
        ...filter,
      }),
      this.PrismaService.category.count(),
    ]);
    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.CategoryCreateInput) {
    return this.PrismaService.category.create({ data });
  }

  public async update(
    where: Prisma.CategoryWhereUniqueInput,
    data: Prisma.CategoryUpdateInput,
  ) {
    return this.PrismaService.category.update({ where, data });
  }

  public async delete(where: Prisma.CategoryWhereUniqueInput) {
    return this.PrismaService.category.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async firtsOrThrow(
    where: Partial<Prisma.CategoryWhereUniqueInput>,
    select?: Prisma.CategorySelect,
  ) {
    const data = await this.PrismaService.category.findFirst({ where, select });
    if (!data) throw new error('data.not_found');
    return data;
  }

  public async find(filter: Omit<Filter, 'include'>) {
    return this.PrismaService.category.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.PrismaService.category.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return this.PrismaService.category.count(filter);
  }
}
