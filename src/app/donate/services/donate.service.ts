import { Injectable } from '@nestjs/common';
import Xendit from 'xendit-node';
import { CreateInvoiceDto } from '../dtos/create-invoice.dtos';
import { Invoice } from 'xendit-node/invoice/models';
import { PrismaService } from 'src/platform/database/services/prisma.service';
import { CreateDonateDto } from '../dtos';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class DonateService {
  // private readonly XENDIT_URL = 'https://api.xendit.co/v2/invoices';

  constructor(private readonly prismaService: PrismaService) {}

  public async createInvoice(
    createInvoiceDto: CreateInvoiceDto,
    userId: string,
  ) {
    const { amount, description } = createInvoiceDto;

    const xenditClient: Xendit = new Xendit({
      secretKey: process.env.XENDIT_SECRET_KEY,
    });
    console.log(process.env.XENDIT_SECRET_KEY);

    const donationId = uuidv4();
    const invoice: Invoice = await xenditClient.Invoice.createInvoice({
      data: { amount, description, externalId: donationId },
    });
    console.log(invoice);
    await this.prismaService.donation.create({
      data: {
        id: donationId,
        amount: createInvoiceDto.amount,
        message: createInvoiceDto.description,
        status: 'PENDING',
        xenditInvoiceId: invoice.invoiceUrl,
        user: {
          connect: { id: userId },
        },
        crowdfounding: {
          connect: { id: createInvoiceDto.id },
        },
      },
    });

    return invoice;
  }

  public async invoicewebhook(createDonateDto: CreateDonateDto) {
    try {
      if (createDonateDto.status == 'SUCCESS') {
      }
      console.log(createDonateDto);

      await this.prismaService.donation.update({
        where: {
          id: createDonateDto.external_id,
        },
        data: {
          status: 'SUCCESS',
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
