import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { env } from 'process';
import { NodemailerTransport } from 'src/configs/config.interface';
require('dotenv').config();
 

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async ( configService: ConfigService ) => {
        const transport = configService.get<NodemailerTransport>('nodemailerTransport');
        return {
          transport : transport,
            defaults: {
        from: 'SEDEED TEAM!',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true
        },
      },
      options: {
        partials: {
          dir: __dirname + '/partials',
          options: {
            strict: true,
          }
        },
    
      }
        }
      }, 
      inject : [ConfigService]
    })
  ],
  providers: [MailService],
  exports: [MailService], // 
})
export class MailModule {}
