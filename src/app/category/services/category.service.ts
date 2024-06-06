import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.categoryRepository.paginate(paginateDto);
  }

  public detail(id: string) {
    try {
      return this.categoryRepository.firtsOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      return this.categoryRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  public async create(CreateCategoryDto: CreateCategoryDto) {
    try {
      return this.categoryRepository.create({
        name: CreateCategoryDto.Title,
        description: '',
        image: '',
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  public async update(id: string, UpdateCategoryDto: UpdateCategoryDto) {
    try {
      return this.categoryRepository.update({ id }, UpdateCategoryDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
