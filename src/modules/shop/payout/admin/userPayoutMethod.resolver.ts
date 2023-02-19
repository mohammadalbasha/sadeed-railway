import { Ability } from '@casl/ability';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Action } from 'rxjs/internal/scheduler/Action';
import BaseAdminResolver from 'src/common/baseCRUD.resolver';
import { Loader } from 'src/common/dataLoader/dataLoader.decorator';
import IfDecorator from 'src/common/decorators/if.decorator';
import { BusinessType } from 'src/modules/central/businessType/businessType.model';
import { Country } from 'src/modules/central/country/country.model';
import { Currency } from 'src/modules/central/currency/currency.model';
import { PaymentMethod } from 'src/modules/central/paymentMethod/paymentMethod.model';
import { PayoutMethod } from 'src/modules/central/payoutMethod/payoutMethod.model';
import { Speciality } from 'src/modules/central/speciality/speciality.model';
import { CurrentUser } from 'src/modules/common/auth/decorators/currentUser.decorator';
import { EntityParam } from 'src/modules/common/auth/decorators/EntityParam.decorator';
import { Can } from 'src/modules/common/authorization/casl/checkPolicies.decorator';
import { User } from 'src/modules/common/user/user.model';
import { UserPayoutMethod, PaginatedUserPayoutMethod } from '../userPayoutMethod.model';
import { UserPayoutMethodOrderInput, CreateUserPayoutMethodInput, UpdateUserPayoutMethodInput } from './userPayoutMethod.input';

@Resolver(() => UserPayoutMethod)
export class UserPayoutMethodResolver extends BaseAdminResolver(UserPayoutMethod, PaginatedUserPayoutMethod, UserPayoutMethodOrderInput, CreateUserPayoutMethodInput, UpdateUserPayoutMethodInput) {

  
  protected createData(data: CreateUserPayoutMethodInput, user:User): Partial<UserPayoutMethod> {
    return {
      ...data,
      user_id: user.id,
    }
  }

  protected updateData(data, user:User) {
    return {
        ...data
    }
  }

  protected whereData(query, user:User) {
    return {
      user_id: user.id,
      // name: { contains: query || '' },
    }
  }

  protected async canDelete(item:UserPayoutMethod, user:User) {
    return true;
  }



  protected async dataValidation(data:CreateUserPayoutMethodInput|UpdateUserPayoutMethodInput, user:User, ability: Ability) {
    const country:Country = await this.Models.model(Country).findById(user.countryId)
    // country.currency_id

    if (! (country.payoutMethods_id.includes(data.payoutMethod_id))) {
      throw new BadRequestException('the selected payout method is not avaiable for the selected country')
    }
  }
 

  @ResolveField(() => PayoutMethod)
  async payoutMethod(@Parent() parent: UserPayoutMethod, @Loader(PayoutMethod) loader) {
    return await loader.load(parent.payoutMethod_id)
  }
}
