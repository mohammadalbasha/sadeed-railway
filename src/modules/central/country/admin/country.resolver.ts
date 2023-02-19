import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import BaseAdminResolver from 'src/common/baseCRUD.resolver';
import { User } from 'src/modules/common/user/user.model';
import { CountryFilterInput, CountryOrderInput } from './country.input';
import { Country, PaginatedCountry } from '../country.model';
import BaseReadResolver from 'src/common/baseRead.resolver';
import { Currency } from '../../currency/currency.model';
import { Loader } from 'src/common/dataLoader/dataLoader.decorator';
import { Plan } from '../../plan/plan.model';
import { PaymentMethod } from '../../paymentMethod/paymentMethod.model';
import { PayoutMethod } from '../../payoutMethod/payoutMethod.model';
import { Speciality } from '../../speciality/speciality.model';
import { CurrentAbility } from 'src/modules/common/auth/decorators/currentAbility.decorator';
import { Ability } from '@casl/ability';

@Resolver(() => Country)
export class CountryResolver extends BaseReadResolver(Country, PaginatedCountry, CountryOrderInput, CountryFilterInput, {
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


  @ResolveField(() => Currency)
  async currency(@Parent() country: Country, @Loader(Currency) loader) {
    return await loader.load(country.currency_id)
  }

  @ResolveField(() => [Currency])
  async shopCurrencies(@Parent() country: Country, @Loader(Currency) loader) {
    return await loader.loadMany(country.shopCurrencies_id)
    
    
  }

  @ResolveField(() => [Plan])
  async plan(@Parent() country: Country, @Loader(Plan) loader) {
    return await loader.load(country.plan_id)
  }

  @ResolveField(() => [PaymentMethod])
  async paymentMethods(@Parent() country: Country, @Loader(PaymentMethod) loader) {
    return await loader.loadMany(country.paymentMethods_id)
  }

  @ResolveField(() => [PayoutMethod])
  async payoutMethods(@Parent() country: Country, @Loader(PayoutMethod) loader) {
    return await loader.loadMany(country.payoutMethods_id)

  }

  @ResolveField(() => [Speciality])
  async specialites(@CurrentAbility() ability: Ability, @Parent() country: Country, @Loader(Speciality) loader) {
    return await this.Models.model(Speciality).find({'$or': [{allCountries: true}, {countries_id: country.id}]}).accessibleBy(ability)
    // return await loader.loadMany(country.payoutMethods_id)
  }
  
}



