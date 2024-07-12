import { Module } from '@nestjs/common';
import { DonateController } from './controller';
import { DonateService } from './services';
import { UsersModule } from '../users';

@Module({
  imports: [UsersModule],
  controllers: [DonateController],
  providers: [DonateService],
  exports: [],
})
export class DonateModule { }
