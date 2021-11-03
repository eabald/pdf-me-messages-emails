import { Controller } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailWithTokenDto } from '@eabald/pdf-me-shared';

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @MessagePattern({ cmd: 'emails-send-reset-password' })
  async resetPasswordEmail(@Payload() payload: EmailWithTokenDto) {
    return this.emailsService.resetPasswordEmail(payload);
  }

  @MessagePattern({ cmd: 'emails-send-confirm-email' })
  async sendConfirmEmail(@Payload() payload: EmailWithTokenDto) {
    return this.emailsService.sendConfirmEmail(payload);
  }

  @MessagePattern({ cmd: 'emails-send-invoices' })
  async sendInvoices() {
    return this.emailsService.sendInvoices();
  }
}
