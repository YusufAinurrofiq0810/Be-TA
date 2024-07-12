import { Module } from '@nestjs/common';
import { NewsController } from './controllers';
import { NewsService } from './services';
import { NewsRepository } from './repositories';
import { UsersModule } from '../users';

@Module({
  imports: [UsersModule],
  controllers: [NewsController],
  providers: [NewsService, NewsRepository],
  exports: [NewsService, NewsRepository],
})
export class NewsModule { }
