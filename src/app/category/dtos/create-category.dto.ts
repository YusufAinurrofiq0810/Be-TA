import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  Title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsString()
  image: string;
}
