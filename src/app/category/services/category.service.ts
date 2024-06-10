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

  public async detail(id: string) {
    const newId: number = Number(id);
    try {
      const data = await this.categoryRepository.firtsOrThrow({ id: newId });
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    const categoryId: number = Number(id);
    try {
      const data = await this.categoryRepository.delete({
        id: categoryId,
      });
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
  public async create(CreateCategoryDto: CreateCategoryDto) {
    try {
      return this.categoryRepository.create({
        name: CreateCategoryDto.Title,
        description: CreateCategoryDto.content,
        image: CreateCategoryDto.image,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  public async update(id: string, UpdateCategoryDto: UpdateCategoryDto) {
    const categoryId: number = Number(id);
    try {
      return this.categoryRepository.update(
        { id: categoryId },
        UpdateCategoryDto,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
