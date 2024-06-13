import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
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
  @Post()
  async createInvoice(@Body() body: CreateInvoiceDto, @Res() res: Response) {
    try {
      return await this.donateService.createInvoice(body);
      // const invoiceUrl = result.invoice.invoice_url;
      // return res.redirect(invoiceUrl);
      // console.log(invoiceUrl);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
