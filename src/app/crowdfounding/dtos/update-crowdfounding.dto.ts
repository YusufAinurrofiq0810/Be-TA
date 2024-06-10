import { PartialType } from '@nestjs/mapped-types';
import { CreateCrowdfoundingDto } from './create-crowdfounding.dto';

export class UpdateCrowdfoundingDto extends PartialType(
  CreateCrowdfoundingDto,
) {}
