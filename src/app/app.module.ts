import { Controller, Get, Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { ApiTags } from '@nestjs/swagger';
import { AuthModule } from './auth';
import { NewsModule } from './news/news.module';
import { CategoryModule } from './category';
import { CrowdfoundingModule } from './crowdfounding';
import { DonateModule } from './donate/donate.module';

@ApiTags('App Spec')
@Controller()
class AppController {
  constructor() {}

  @Get()
  getHello() {
    return new ResponseEntity({
      data: {
        appVersion: 1,
        swaggerUrl: '/api',
      },
    });
  }
}

@Module({
  imports: [
    UsersModule,
    AuthModule,
    NewsModule,
    CategoryModule,
    CrowdfoundingModule,
    DonateModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
