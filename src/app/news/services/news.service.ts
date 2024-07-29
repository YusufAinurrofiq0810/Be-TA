import { Injectable } from '@nestjs/common';
import { NewsRepository, Filter as FileterNews } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateNewsDto, UpdateNewsDto } from '../dtos';
import { PrismaService } from 'src/platform/database/services/prisma.service';
import { filter } from 'rxjs';
import { Prisma } from '@prisma/client';
@Injectable()
export class NewsService {
  constructor(
    private readonly newsRepository: NewsRepository,
    private readonly prismaService: PrismaService,
  ) { }

  public paginate(paginateDto: PaginationQueryDto, search?: string) {
    const querySearch = search?.trim().toLowerCase().split(' ');
    const filter: FileterNews = {
      where: {
        deletedAt: null
      }
    }
    if (querySearch && querySearch.length > 0) {
      const queryWhereOrInput: Prisma.NewsWhereInput = { OR: [...querySearch.map((item: string): Prisma.NewsWhereInput => ({ title: { contains: item, mode: 'insensitive' } }))] }
      filter.where = {
        ...filter.where,
        ...queryWhereOrInput
      }
    }
    return this.newsRepository.paginate(paginateDto, filter);
  }

  public detail(id: string) {
    try {
      return this.newsRepository.firtsOrThrow({
        id,
        deletedAt: null,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      return this.newsRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(createNewsDto: CreateNewsDto) {
    try {
      const crowdfounding = await this.prismaService.crowdfounding.findUnique({
        where: { id: createNewsDto.crowdfoundingId },
      });
      const category = await this.prismaService.category.findUnique({
        where: { id: createNewsDto.categoryId },
      });

      if (!crowdfounding) {
        throw new Error('Crowdfounding not found');
      }

      if (!category) {
        throw new Error('Category not found');
      }

      const newsData = {
        title: createNewsDto.title,
        crowdfounding: { connect: { id: crowdfounding.id } },
        category: { connect: { id: category.id } },
        content: createNewsDto.content,
        image: createNewsDto.image,
        statusBerita: createNewsDto.statusBerita,
      };

      return this.newsRepository.create(newsData);
    } catch (error) {
      console.error('Error creating news:', error);
      throw new Error(error.message);
    }
  }

  public async update(id: string, UpdateNewsDto: UpdateNewsDto) {
    try {
      const oldData = await this.newsRepository.firtsOrThrow({ id });
      return this.newsRepository.update({ id }, UpdateNewsDto, oldData);
    } catch (error) {
      console.log('Error updating news:', error);
      throw new Error(error.message);
    }
  }
}
