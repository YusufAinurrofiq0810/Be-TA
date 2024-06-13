import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateDonateDto {
  @ApiProperty()
  @IsString()
  user_id: number;

  @ApiProperty()
  @IsString()
  crowdfounding_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1000)
  amount: number;

  @ApiProperty()
  @IsString()
  message: string;
}
