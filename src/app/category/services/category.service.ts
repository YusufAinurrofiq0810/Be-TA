import { Injectable } from '@nestjs/common';
import { CategoryRepository, Filter as FilterCategory } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { PrismaService } from 'src/platform/database/services/prisma.service';
import { Prisma } from '@prisma/client';
import { contains } from 'class-validator';


@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository, private readonly prismaService: PrismaService) { }

  public paginate(paginateDto: PaginationQueryDto, search?: string) {
    const querySearch = search?.trim().toLowerCase().split(' ');
    const filter: FilterCategory = {
      where: {
        deletedAt: null
      }
    }
    if (querySearch && querySearch.length > 0) {
      const queryWhereOrInput: Prisma.CategoryWhereInput = { OR: [...querySearch.map((item: string): Prisma.CategoryWhereInput => ({ name: { contains: item, mode: 'insensitive' } }))] }
      filter.where = {
        ...filter.where,
        ...queryWhereOrInput
      };
    }

    return this.categoryRepository.paginate(paginateDto, filter);
  }

  public async detail(id: string) {
    try {
      const data = await this.categoryRepository.firtsOrThrow({ id });
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      const data = await this.categoryRepository.delete({
        id,
      });
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
  public async create(CreateCategoryDto: CreateCategoryDto) {
    try {
      const data = await this.prismaService.category.findFirst({ where: { name: CreateCategoryDto.title } });
      if (data) {
        throw new Error('Category already exists');
      }
      return this.categoryRepository.create({
        name: CreateCategoryDto.title,
        description: CreateCategoryDto.content,
      });
    } catch (error) {
      console.log(error);

      throw error;
    }
  }
  public async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      return this.categoryRepository.update({ id }, updateCategoryDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  public async search(query: string) {
    try {
      const querySearch = query.trim().toLowerCase().split(' ');
      const queryWhereOrInput: Prisma.CategoryWhereInput = { OR: [...querySearch.map((item: string): Prisma.CategoryWhereInput => ({ name: { contains: item, mode: 'insensitive' } }))] }

      return this.prismaService.category.findMany({
        where: queryWhereOrInput,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
