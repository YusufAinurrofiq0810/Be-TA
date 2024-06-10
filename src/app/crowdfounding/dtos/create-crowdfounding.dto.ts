import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateCrowdfoundingDto {
  @ApiProperty()
  @IsString()
  Title: string;

  @ApiProperty({ enum: Status })
  @IsNotEmpty()
  @IsEnum(Status)
  Status: Status;

  @ApiProperty()
  @IsString()
  Donation_Target: string;

  @ApiProperty()
  @IsString()
  Donation_Collected: string;

  @ApiProperty()
  @IsDateString()
  Donation_Start_Date: Date;

  @ApiProperty()
  @IsString()
  Donation_Finished_Date: Date;
}
