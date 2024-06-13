import { Injectable } from '@nestjs/common';
import Xendit from 'xendit-node';
import { CreateInvoiceDto } from '../dtos/create-invoice.dtos';
import { Invoice } from 'xendit-node/invoice/models';

@Injectable()
export class DonateService {
  private readonly XENDIT_URL = 'https://api.xendit.co/v2/invoices';
  private readonly XENDIT_APIKEY =
    'xnd_public_development_Jevm2wQGLxrutZaeGKGeRLh4ApEqb3G97hizmr7t8Y05qn080TMTEwg47dqiVu';

  constructor() {}

  public async createInvoice(CreateInvoiceDto: CreateInvoiceDto) {
    const { amount, description, id } = CreateInvoiceDto;

    const xenditClient: Xendit = new Xendit({
      secretKey: process.env.XENDIT_SECRET_KEY,
    });

    const invoice: Invoice = await xenditClient.Invoice.createInvoice({
      data: { externalId: id, amount, description },
    });
    console.log(invoice);
  }
}
