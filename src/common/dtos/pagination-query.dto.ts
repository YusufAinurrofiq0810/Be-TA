import { IsNumberString, IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @IsNumberString()
  @IsOptional()
  page: number;

  @IsNumberString()
  @IsOptional()
  limit: number;
}
