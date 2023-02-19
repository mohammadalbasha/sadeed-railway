import { Module } from '@nestjs/common';
import { BusinessTypeResolver } from './central/businessType/central/businessType.resolver';
import { CountryResolver } from './central/country/central/country.resolver';
import { SpecialityResolver } from './central/speciality/central/speciality.resolver';
import { PlanResolver } from './central/plan/central/plan.resolver';
import { ModelsModule } from './models.module';
import { TicketCategoryResolver } from './tickets/central/ticketCategory.resolver';
import { CurrencyResolver } from './central/currency/central/currency.resolver';
import { PaymentMethodResolver } from './central/paymentMethod/central/paymentMethod.resolver';
import { PayoutMethodResolver } from './central/payoutMethod/central/payoutMethod.resolver';
import { TicketResolver } from './tickets/central/ticket.resolver';
import { TicketMessageResolver } from './tickets/central/ticketMessage.resolve';
import { LogResolver } from './central/log/central/log.resolver';
import { UserDocumentResolver } from './shop/document/central/document.resolver';
import { UserDocumentTypeResolver } from './shop/document/central/documentType.resolver';
import { CentralRoleResolver } from './central/central-role/central-role.resolver';
import { CentralRoleService } from './central/central-role/central-role.service';
import { CentralRoleModule } from './central/central-role/central-role.module';
import { IpResolver } from './common/auth/ip/ip.resolver';

@Module({
  imports: [
      ModelsModule,
      CentralRoleModule, /*mohammad albacha*/
  ],
  providers: [
      LogResolver,
      PlanResolver,
      CurrencyResolver,
      PaymentMethodResolver,
      PayoutMethodResolver,

      CountryResolver,
      BusinessTypeResolver,
      SpecialityResolver,
      
      TicketResolver,
      TicketMessageResolver,
      TicketCategoryResolver,

      UserDocumentTypeResolver,
      UserDocumentResolver,

      /* mohammad albacha */ 
      //CentralRoleResolver,
      //CentralRoleService

      /* mohammad albacha*/
      IpResolver
      

  ],
})
export class CentralModule {}
