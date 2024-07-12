import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) { }

  public paginate(paginateDto: PaginationQueryDto) {
    return this.categoryRepository.paginate(paginateDto);
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
      return this.categoryRepository.create({
        name: CreateCategoryDto.title,
        description: CreateCategoryDto.content,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  public async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      return this.categoryRepository.update({ id }, updateCategoryDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
