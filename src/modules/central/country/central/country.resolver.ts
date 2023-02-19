import { Resolver } from '@nestjs/graphql';
import BaseAdminResolver from 'src/common/baseCRUD.resolver';
import { User } from 'src/modules/common/user/user.model';
import { CountryOrderInput, CreateCountryInput, UpdateCountryInput } from './country.input';
import { Country, PaginatedCountry } from '../country.model';
import { BaseService } from 'src/common/base.service';

@Resolver(() => Country)
export class CountryResolver extends BaseAdminResolver(Country, PaginatedCountry, CountryOrderInput, CreateCountryInput, UpdateCountryInput) {
  protected populateFields(): any[] {
      return [
        'plan',
        'currency',
        'shopCurrencies',
        'paymentMethods',
        'payoutMethods',
      ]
  }
}



