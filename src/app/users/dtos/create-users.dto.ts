import { ApiProperty } from '@nestjs/swagger';
import { role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateUsersDto {
  @ApiProperty()
  @IsString()
  fullname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber('ID')
  phone: string;

  @ApiProperty()
  @IsString()
  alamat: string;

  @ApiProperty({ enum: role })
  @IsNotEmpty()
  @IsEnum(role)
  role: role;
}
