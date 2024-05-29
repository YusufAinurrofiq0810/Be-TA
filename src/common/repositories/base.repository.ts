import { Inject } from '@nestjs/common';
import { PrismaService } from 'src/platform/database/services/prisma.service';
import { PaginatedEntity } from '../entities/paginated.entity';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { RequireAtLeastOne } from '../types/utils.type';

export class BaseRepository<Where, Select, OrderBy, Include, Create> {
  private _where: Partial<Where> = {};
  private _select: Partial<Select> = undefined;
  private _orderBy: Partial<OrderBy> = {};
  private _include: Partial<Include> = {};

  @Inject(PrismaService)
  public readonly prismaService: PrismaService;

  constructor(private readonly model: string) {}

  where(w: Where) {
    Object.assign(this._where, w);
    return this;
  }

  orderBy(o: OrderBy) {
    Object.assign(this._orderBy, o);
    return this;
  }

  select(s: RequireAtLeastOne<Select> | undefined) {
    if (!this._select) this._select = {};
    Object.assign(this._select, s);
    return this;
  }

  include(i: Include) {
    Object.assign(this._include, i);
    return this;
  }

  async count() {
    return this.prismaService[this.model].count({
      where: this._where,
    });
  }

  all() {
    return this.prismaService[this.model].findMany({
      where: this._where,
      select: this._select,
      orderBy: this._orderBy,
    });
  }

  first() {
    return this.prismaService[this.model].findFirst({
      where: this._where,
      select: this._select,
      orderBy: this._orderBy,
    });
  }

  firstOrThrow() {
    return this.prismaService[this.model].findFirstOrThrow({
      where: this._where,
      select: this._select,
      orderBy: this._orderBy,
    });
  }

  async delete(id: string) {
    return this.prismaService[this.model].delete({
      where: {
        id,
      },
    });
  }

  async deleteMany() {
    return this.prismaService[this.model].deleteMany({
      where: this._where,
    });
  }

  async create(c: Create) {
    return this.prismaService[this.model].create({
      data: c as any,
      select: this._select,
    });
  }

  async paginate({ limit = 10, page = 1 }: PaginationQueryDto) {
    try {
      const [data, totalData] = await Promise.all([
        this.prismaService[this.model].findMany({
          where: this._where,
          select: this._select,
          orderBy: this._orderBy,
          take: +limit,
          skip: (+page - 1) * +limit,
        }),
        this.prismaService[this.model].count({
          where: this._where,
        }),
      ]);

      return new PaginatedEntity(data, {
        limit,
        page,
        totalData,
      });
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, c: Partial<Create>) {
    return this.prismaService[this.model].update({
      where: {
        id,
      },
      data: c as any,
      select: this._select,
    });
  }

  async updateMany(c: Partial<Create>) {
    return this.prismaService[this.model].updateMany({
      where: this._where,
      data: c,
    });
  }
}
