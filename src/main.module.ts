import { Global, Module } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { DatabaseModule } from './platform/database/database.module';

@Global()
@Module({
  imports: [AppModule, DatabaseModule],
  controllers: [],
  providers: [],
  exports: [DatabaseModule],
})
export class MainModule {}
