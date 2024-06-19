import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { DonateService } from '../services';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/app/auth';
import { CreateInvoiceDto } from '../dtos/create-invoice.dtos';
import { Response } from 'express';

@ApiTags('Donate')
@ApiSecurity('JWT')
@UseGuards(AuthGuard)
@Controller({
  path: 'donate',
  version: 1,
})
export class DonateController {
  constructor(private readonly donateService: DonateService) {}
  @Post('create-invoice')
  async createInvoice(@Body() body: CreateInvoiceDto, @Res() res: Response) {
    try {
      const result = await this.donateService.createInvoice(body);
      console.log(result.invoiceUrl);

      res.status(200).redirect(result.invoiceUrl);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  @Post('handle-callback')
  async handleXenditCallback(@Body() Body: any) {
    try {
      const result = await this.donateService.handleXenditCallback(Body);
      return { InvoiceStatus: 'success', result };
    } catch (error) {
      throw new HttpException(
        'Callback processing failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
