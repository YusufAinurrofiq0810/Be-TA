import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/app/users/services';
import { SignInDto } from '../dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { SignUpDto } from '../dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{
    token: string;
    user: User;
  }> {
    const user = await this.userService.signIn(signInDto);
    const token = this.jwtService.sign({
      email: user.email,
      id: user.id,
      name: user.fullName,
    });

    delete user.password;
    return {
      token,
      user,
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<{
    token: string;
    user: User;
  }> {
    const user = await this.userService.signUp(signUpDto);
    const token = this.jwtService.sign({
      email: user.email,
      id: user.id,
      name: user.fullName,
    });
    return {
      token,
      user,
    };
  }

  async profile(user: User): Promise<User> {
    return this.userService.detail(user.id);
  }
}
