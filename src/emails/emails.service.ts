import { Injectable, Inject } from '@nestjs/common';
import { EmailWithTokenDto, InvoiceEntity } from '@eabald/pdf-me-shared';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EmailsService {
  constructor(
    @InjectSendGrid() private readonly sendGridService: SendGridService,
    private readonly configService: ConfigService,
    @Inject('INVOICES_SERVICE') private invoicesService: ClientProxy,
    @Inject('FILES_SERVICE') private filesService: ClientProxy,
  ) {}

  private async sendEmail(config) {
    return await this.sendGridService.send(config);
  }

  async resetPasswordEmail({ email, token }: EmailWithTokenDto) {
    try {
      return this.sendEmail({
        to: email,
        subject: 'Reset password',
        from: 'no-reply@pdf-me.com',
        html: `${this.configService.get(
          'FRONT_URL',
        )}/reset-password?token=${encodeURI(token)}`,
      });
    } catch (error) {
      return new RpcException({ statusCode: 500, message: error });
    }
  }

  async sendConfirmEmail({ email, token }: EmailWithTokenDto) {
    try {
      return this.sendEmail({
        to: email,
        subject: 'Confirm email',
        from: 'no-reply@pdf-me.com',
        html: `${this.configService.get(
          'FRONT_URL',
        )}/confirm-email?token=${encodeURI(token)}`,
      });
    } catch (error) {
      return new RpcException({ statusCode: 500, message: error });
    }
  }

  async sendInvoices() {
    // get invoices to send
    const invoices: InvoiceEntity[] = await this.invoicesService
      .send({ cmd: 'payments-get-invoices-to-send' }, '')
      .toPromise();
    // send
    const send = [];
    invoices.forEach(async (invoice) => {
      try {
        const file = await this.filesService
          .send({ cmd: 'files-get-file' }, '')
          .toPromise();
        await this.sendEmail({
          to: invoice.user.email,
          subject: 'New invoice',
          from: 'no-reply@pdf-me.com',
          html: 'new invoice',
          attachments: [
            {
              content: file,
              filename: invoice.filename,
              type: 'application/pdf',
              disposition: 'attachment',
            },
          ],
        });
        send.push(invoice.id);
      } catch (error) {
        console.log(error);
      }
    });

    await this.invoicesService
      .send({ cmd: 'payments-set-send-invoices' }, send)
      .toPromise();
  }
}
