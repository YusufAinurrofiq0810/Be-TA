import { Module } from '@nestjs/common';
import { CategoryController } from './controllers';
import { CategoryService } from './services';
import { CategoryRepository } from './repositories';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
