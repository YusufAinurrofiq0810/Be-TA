import { Injectable } from '@nestjs/common';
import { NewsRepository } from '../repositories/news.repository';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateNewsDto, UpdateNewsDto } from '../dtos';
import { PrismaService } from 'src/platform/database/services/prisma.service';

@Injectable()
export class NewsService {
  constructor(
    private readonly newsRepository: NewsRepository,
    private readonly prismaService: PrismaService,
  ) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.newsRepository.paginate(paginateDto);
  }

  public async detail(id: string) {
    try {
      return this.newsRepository.findFirstOrThrow({ id });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async destroy(id: string) {
    try {
      return this.newsRepository.delete({ id });
    } catch (error) {
      throw new Error(error.message);
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

  public async update(id: string, updateNewsDto: UpdateNewsDto) {
    try {
      return this.newsRepository.update({ id }, updateNewsDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
