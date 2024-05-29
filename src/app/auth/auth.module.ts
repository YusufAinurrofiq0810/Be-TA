import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './controllers';
import { AuthService } from './services';
import { UsersModule } from '../users';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
