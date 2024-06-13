import { Module } from '@nestjs/common';
import { DonateController } from './controller';
import { DonateService } from './services';

@Module({
  imports: [],
  controllers: [DonateController],
  providers: [DonateService],
  exports: [],
})
export class DonateModule {}
