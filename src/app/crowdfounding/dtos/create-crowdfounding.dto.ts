import { ApiProperty } from '@nestjs/swagger';
import { status } from '@prisma/client';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCrowdfoundingDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ enum: status })
  @IsNotEmpty()
  @IsEnum(status)
  status: status;

  @ApiProperty()
  @IsString()
  donationTarget: string;

  @ApiProperty()
  @IsString()
  donationCollected: string;

  @ApiProperty()
  @IsOptional()
  image: string;

  @ApiProperty()
  @IsDateString()
  donationStartDate: Date;

  @ApiProperty()
  @IsString()
  donationFinishedDate: Date;
}
