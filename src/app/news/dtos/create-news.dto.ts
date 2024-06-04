import { ApiProperty } from '@nestjs/swagger';
import { Status_Berita } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateNewsDto {
  @ApiProperty()
  @IsString()
  Title: string;

  @ApiProperty()
  @IsString()
  crowdfounding_id: string;

  @ApiProperty()
  @IsString()
  category_id: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty({ enum: Status_Berita })
  @IsNotEmpty()
  @IsEnum(Status_Berita)
  status: Status_Berita;
}
