import { ApiProperty } from '@nestjs/swagger';
import { statusberita } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateNewsDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  crowdfoundingId: string;

  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({ enum: statusberita })
  @IsNotEmpty()
  @IsEnum(statusberita)
  statusBerita: statusberita;
}
