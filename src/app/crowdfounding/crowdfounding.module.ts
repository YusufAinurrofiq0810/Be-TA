import { Module } from '@nestjs/common';
import { CrowdfoundingController } from './controllers';
import { CrowdfoundingService } from './services';
import { CrowdfoundingRepository } from './repositories';

@Module({
  controllers: [CrowdfoundingController],
  providers: [CrowdfoundingService, CrowdfoundingRepository],
  exports: [CrowdfoundingService, CrowdfoundingRepository],
})
export class CrowdfoundingModule {}
