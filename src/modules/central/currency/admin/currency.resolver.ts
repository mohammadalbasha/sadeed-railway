import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import BaseAdminResolver from 'src/common/baseCRUD.resolver';
import { User } from 'src/modules/common/user/user.model';
import { CurrencyFilterInput, CurrencyOrderInput } from './currency.input';
import { Currency, PaginatedCurrency } from '../currency.model';
import BaseReadResolver from 'src/common/baseRead.resolver';
import { Loader } from 'src/common/dataLoader/dataLoader.decorator';
import { Country } from '../../country/country.model';

@Resolver(() => Currency)
export class CurrencyResolver extends BaseReadResolver(Currency, PaginatedCurrency, CurrencyOrderInput, CurrencyFilterInput, {
  nullableFilter: true
}) {




  // protected populateFields(): any[] {
  //     return [
  //       'plan',
  //       'currency',
  //       'shopCurrencies',
  //       'paymentMethods',
  //       'payoutMethods',
  //     ]
  // }


  // @ResolveField(() => Country)
  // async country(@Parent() currency: Currency, @Loader(Country) loader) {
  //   return await loader.load(currency.currency_id)
  // }

}



