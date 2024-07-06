import { Injectable } from '@nestjs/common';
import { NewsRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateNewsDto, UpdateNewsDto } from '../dtos';
import { PrismaService } from 'src/platform/database/services/prisma.service';
@Injectable()
export class NewsService {
  constructor(
    private readonly newsRepository: NewsRepository,
    private readonly prismaService: PrismaService,
  ) { }

  public paginate(paginateDto: PaginationQueryDto) {
    return this.newsRepository.paginate(paginateDto);
  }

  public detail(id: string) {
    try {
      return this.newsRepository.firtsOrThrow({
        id,
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

  public async create(CreateNewsDto: CreateNewsDto, image: string) {
    const crowdfounding = await this.prismaService.crowdfounding.findUnique({
      where: { id: CreateNewsDto.crowdfoundingId },
    });
    const category = await this.prismaService.category.findUnique({
      where: { id: CreateNewsDto.categoryId },
    });

    if (!crowdfounding) {
      throw new Error('Crowdfounding Not found');
    }

    if (!category) {
      throw new Error('CategoryNot found');
    }
    try {
      return this.newsRepository.create({
        title: CreateNewsDto.title,
        crowdfounding: {
          connect: { id: crowdfounding.id },
        },
        category: {
          connect: { id: category.id },
        },
        content: CreateNewsDto.content,
        image: CreateNewsDto.image,
        statusBerita: CreateNewsDto.statusBerita,
      });
    } catch (error) {
      console.log(error)
      throw new Error(error);
    }
  }

  public async update(id: string, UpdateNewsDto: UpdateNewsDto) {
    try {
      return this.newsRepository.update({ id }, UpdateNewsDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
