import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from './shop/shop/shop.model';
import { ModelsModule } from './models.module';
import { ShopResolver } from './shop/shop/admin/shop.resolver';
import { TicketResolver } from './tickets/admin/ticket.resolver';
import { TicketMessageResolver } from './tickets/admin/ticketMessage.resolve';
import { CountryResolver } from './central/country/admin/country.resolver';
import { ShopUserResolver } from './shop/user/admin/shopUser.resolver';
import { UserPayoutMethodResolver } from './shop/payout/admin/userPayoutMethod.resolver';
import { UserDocumentResolver } from './shop/document/admin/document.resolver';
import { MailModule } from './common/mail/mail.module';


@Module({
    imports: [
        ModelsModule,
        MailModule,
    ],
    providers: [
        // Central
        CountryResolver,

        // Shop
        ShopResolver,
        ShopUserResolver,

        // Tickets
        TicketResolver,
        TicketMessageResolver,

        UserPayoutMethodResolver,
        UserDocumentResolver,
    ],
})
export class AdminModule {}
