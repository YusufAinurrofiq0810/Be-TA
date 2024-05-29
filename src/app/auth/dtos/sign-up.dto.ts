import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateUsersDto } from 'src/app/users/dtos';

export class SignUpDto extends CreateUsersDto {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
