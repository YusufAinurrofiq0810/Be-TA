import { Module } from '@nestjs/common';
import { CrowdfoundingController } from './controllers';
import { CrowdfoundinService } from './services';
import { CrowdfoundingRepository } from './repositories';

@Module({
  controllers: [CrowdfoundingController],
  providers: [CrowdfoundinService, CrowdfoundingRepository],
  exports: [CrowdfoundinService, CrowdfoundingRepository],
})
export class CrowdfoundingModule {}
