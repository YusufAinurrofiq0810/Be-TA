import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCrowdfoundingDto } from './create-crowdfounding.dto';

export class UpdateCrowdfoundingDto extends PartialType(
  OmitType(CreateCrowdfoundingDto, ['donationCollected'] as const),
) {}
