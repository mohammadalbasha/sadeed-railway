import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Models from './models.service';
import { Shop, ShopSchema } from './shop/shop/shop.model';
import { BusinessType, BusinessTypeSchema } from './central/businessType/businessType.model';
import { Country, CountrySchema } from './central/country/country.model';
import { Speciality, SpecialitySchema } from './central/speciality/speciality.model';
import { Plan, PlanSchema } from './central/plan/plan.model';
import { TicketCategory, TicketCategorySchema } from './tickets/ticketCategory.model';
import { Ticket, TicketSchema } from './tickets/ticket.model';
import { TicketMessage, TicketMessageSchema } from './tickets/ticketMessage.model';
import { Currency, CurrencySchema } from './central/currency/currency.model';
import { PaymentMethod, PaymentMethodSchema } from './central/paymentMethod/paymentMethod.model';
import { PayoutMethod, PayoutMethodSchema } from './central/payoutMethod/payoutMethod.model';
import { Log, LogSchema } from './central/log/log.model';
import { UserPayoutMethod, UserPayoutMethodSchema } from './shop/payout/userPayoutMethod.model';
import { UserPayoutRequest, UserPayoutRequestSchema } from './shop/payout/userPayoutRequest.model';
import { MediaFile, MediaFileSchema } from './common/file/file.model';
import { UserDocument, UserDocumentSchema } from './shop/document/document.model';
import { UserDocumentType, UserDocumentTypeSchema } from './shop/document/documentType.model';
import { CentralRole, CentralRoleSchema } from './central/central-role/central-role.model';
import { Ip, IpSchema } from './common/auth/ip/ip.model';


@Module({
    imports: [
        // Central
        
        MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
        MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }]),
        MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
        MongooseModule.forFeature([{ name: BusinessType.name, schema: BusinessTypeSchema }]),
        MongooseModule.forFeature([{ name: Speciality.name, schema: SpecialitySchema }]),
        MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }]),
        MongooseModule.forFeature([{ name: Currency.name, schema: CurrencySchema }]),
        MongooseModule.forFeature([{ name: PaymentMethod.name, schema: PaymentMethodSchema }]),
        MongooseModule.forFeature([{ name: PayoutMethod.name, schema: PayoutMethodSchema }]),

        //Role
        /*mohammad albacha */
        MongooseModule.forFeature([{ name: CentralRole.name, schema: CentralRoleSchema }]),

        //IP
        /*mohammad albacha*/
        MongooseModule.forFeature([{ name: Ip.name, schema: IpSchema }]),


        // Tickets
        MongooseModule.forFeature([{ name: TicketCategory.name, schema: TicketCategorySchema }]),
        MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
        MongooseModule.forFeature([{ name: TicketMessage.name, schema: TicketMessageSchema }]),

        
        // auto import models
        MongooseModule.forFeature([{ name: UserPayoutMethod.name, schema: UserPayoutMethodSchema }]),
        MongooseModule.forFeature([{ name: UserPayoutRequest.name, schema: UserPayoutRequestSchema }]),

        MongooseModule.forFeature([{ name: UserDocument.name, schema: UserDocumentSchema }]),
        MongooseModule.forFeature([{ name: UserDocumentType.name, schema: UserDocumentTypeSchema }]),
        MongooseModule.forFeature([{ name: MediaFile.name, schema: MediaFileSchema }]),
    ],
    exports: [
        Models,

              //Role
        /*mohammad albacha */
        MongooseModule.forFeature([{ name: CentralRole.name, schema: CentralRoleSchema }]),
        
        MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
        MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }]),
        MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
        MongooseModule.forFeature([{ name: BusinessType.name, schema: BusinessTypeSchema }]),
        MongooseModule.forFeature([{ name: Speciality.name, schema: SpecialitySchema }]),
        MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }]),
        MongooseModule.forFeature([{ name: Currency.name, schema: CurrencySchema }]),
        MongooseModule.forFeature([{ name: PaymentMethod.name, schema: PaymentMethodSchema }]),
        MongooseModule.forFeature([{ name: PayoutMethod.name, schema: PayoutMethodSchema }]),

        MongooseModule.forFeature([{ name: TicketCategory.name, schema: TicketCategorySchema }]),
        MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
        MongooseModule.forFeature([{ name: TicketMessage.name, schema: TicketMessageSchema }]),

        // auto export models
        MongooseModule.forFeature([{ name: UserPayoutMethod.name, schema: UserPayoutMethodSchema }]),
        MongooseModule.forFeature([{ name: UserPayoutRequest.name, schema: UserPayoutRequestSchema }]),

        MongooseModule.forFeature([{ name: UserDocument.name, schema: UserDocumentSchema }]),
        MongooseModule.forFeature([{ name: UserDocumentType.name, schema: UserDocumentTypeSchema }]),
        MongooseModule.forFeature([{ name: MediaFile.name, schema: MediaFileSchema }]),

        
        
    ],
    providers: [
        Models,
    ],
})
export class ModelsModule {}
