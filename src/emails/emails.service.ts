import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import { EmailWithTokenDto } from './dto/emailWithToken.dto';

@Injectable()
export class EmailsService {
  private nodemailerTransport: Mail;

  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      service: configService.get('EMAIL_SERVICE'),
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASSWORD'),
      },
    });
  }
  async resetPasswordEmail({ email, token }: EmailWithTokenDto) {
    return { email, token };
  }

  async sendConfirmEmail({ email, token }: EmailWithTokenDto) {
    return { email, token };
  }
}
