import { Module } from '@nestjs/common';
import { DashboardController } from './controllers';
import { DashboardService } from './services';
import { DashboardRepository } from './repositories';
import { UsersModule } from '../users';
@Module({
  imports: [UsersModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository],
  exports: [DashboardService, DashboardRepository],
})
export class DashboardModule { }
