import { Injectable } from '@nestjs/common';
import { NewsRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateNewsDto, UpdateNewsDto } from '../dtos';
@Injectable()
export class NewsService {
  constructor(private readonly newsRepository: NewsRepository) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.newsRepository.paginate(paginateDto);
  }

  public detail(id: string) {
    try {
      return this.newsRepository.firstOrThrow({
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

  public async create(CreateNewsDto: CreateNewsDto) {
    try {
      return this.newsRepository.create(CreateNewsDto);
    } catch (error) {
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
