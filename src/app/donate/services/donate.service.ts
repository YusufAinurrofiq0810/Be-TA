import { Injectable } from '@nestjs/common';
import Xendit from 'xendit-node';
import { CreateInvoiceDto } from '../dtos/create-invoice.dtos';
import { Invoice } from 'xendit-node/invoice/models';
import { PrismaService } from 'src/platform/database/services/prisma.service';

@Injectable()
export class DonateService {
  // private readonly XENDIT_URL = 'https://api.xendit.co/v2/invoices';

  constructor(private readonly prismaService: PrismaService) {}

  public async createInvoice(CreateInvoiceDto: CreateInvoiceDto) {
    const { amount, description, id } = CreateInvoiceDto;

    const xenditClient: Xendit = new Xendit({
      secretKey: process.env.XENDIT_SECRET_KEY,
    });
    console.log(process.env.XENDIT_SECRET_KEY);

    const invoice: Invoice = await xenditClient.Invoice.createInvoice({
      data: { externalId: id, amount, description },
    });
    console.log(invoice);

    return invoice;
  }

  public async handleXenditCallback(data: any) {
    const { externalId, status } = data;

    const updateResult = await this.prismaService.donation.updateMany({
      where: { id: externalId },
      data: { status },
    });
    return { externalId, status, updateResult };
  }
}
