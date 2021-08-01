import { Module } from '@nestjs/common';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';

@Module({
  imports: [
    ConfigModule,
    SendGridModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        apiKey: configService.get('SENDGRID_API_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [EmailsController],
  providers: [EmailsService],
})
export class EmailsModule {}
