/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  // HttpException,
  // HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { DonateService } from '../services';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/app/auth';
import { CreateInvoiceDto } from '../dtos/create-invoice.dtos';
import { Response } from 'express';
// import { ResponseEntity } from 'src/common/entities/response.entity';
import { CreateDonateDto } from '../dtos';
import { User } from 'src/app/auth/decorators';
import { Public } from 'src/app/auth/decorators/public.decorator';

@ApiTags('Donate')
@ApiSecurity('JWT')
@Controller({
  path: 'donate',
  version: '1',
})
export class DonateController {
  constructor(private readonly donateService: DonateService) {}
  @Post('create-invoice')
  @Public()
  // @UseGuards(AuthGuard)
  async createInvoice(
    @Body() body: CreateInvoiceDto,
    @Res() res: Response,
    @User() user: { id: string },
  ) {
    try {
      console.log(user);
      const result = await this.donateService.createInvoice(body, user.id);

      console.log(result.invoiceUrl);

      res.status(200).redirect(result.invoiceUrl);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  @Post('invoice-webhook')  
  async invoicewebhook(@Body() Body: CreateDonateDto) {
    try {
      const data = await this.donateService.invoicewebhook(Body);
      console.log(data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
