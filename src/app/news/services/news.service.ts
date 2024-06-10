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
  ) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.newsRepository.paginate(paginateDto);
  }

  public detail(id: string) {
    const newId: number = Number(id);
    try {
      return this.newsRepository.firtsOrThrow({
        id: newId,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    const newId: number = Number(id);
    try {
      return this.newsRepository.delete({
        id: newId,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(CreateNewsDto: CreateNewsDto) {
    const crowdfounding = await this.prismaService.crowdfounding.findUnique({
      where: { id: CreateNewsDto.crowdfounding_id },
    });
    const category = await this.prismaService.category.findUnique({
      where: { id: CreateNewsDto.category_id },
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
        status_Berita: CreateNewsDto.status_berita,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async update(id: string, UpdateNewsDto: UpdateNewsDto) {
    const newId: number = Number(id);
    try {
      return this.newsRepository.update({ id: newId }, UpdateNewsDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
