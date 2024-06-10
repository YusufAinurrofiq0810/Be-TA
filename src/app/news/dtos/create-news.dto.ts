import { ApiProperty } from '@nestjs/swagger';
import { Status_Berita } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNewsDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  crowdfounding_id: number;

  @ApiProperty()
  @IsNumber()
  category_id: number;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty({ enum: Status_Berita })
  @IsNotEmpty()
  @IsEnum(Status_Berita)
  status_berita: Status_Berita;
}
