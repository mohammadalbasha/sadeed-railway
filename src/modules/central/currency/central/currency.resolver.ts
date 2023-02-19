import { Resolver } from '@nestjs/graphql';
import BaseAdminResolver from 'src/common/baseCRUD.resolver';
import { User } from 'src/modules/common/user/user.model';
import { CurrencyOrderInput, CreateCurrencyInput, UpdateCurrencyInput } from './currency.input';
import { PaginatedCurrency, Currency } from '../currency.model';

@Resolver(() => Currency)
export class CurrencyResolver extends BaseAdminResolver(Currency, PaginatedCurrency, CurrencyOrderInput, CreateCurrencyInput, UpdateCurrencyInput) {

}



