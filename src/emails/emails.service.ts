import { Injectable, Inject } from '@nestjs/common';
import { EmailWithTokenDto } from '@pdf-me/shared';
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
    return false;
  }
}
