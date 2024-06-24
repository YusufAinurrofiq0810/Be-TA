// import { ApiProperty } from '@nestjs/swagger';
// import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateDonateDto {
  id: string;
  external_id: string;
  user_id: string;
  is_high: boolean;
  payment_method: string;
  status: string;
  merchant_name: string;
  amount: number;
  paid_amount: number;
  bank_code: string;
  paid_at: string;
  payer_email: string;
  description: string;
  adjusted_received_amount: number;
  fees_paid_amount: number;
  updated: string;
  created: string;
  currency: string;
  payment_channel: string;
  payment_destination: string;
}
