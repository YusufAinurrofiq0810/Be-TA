import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class wihtdrawCrowdfounding {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}