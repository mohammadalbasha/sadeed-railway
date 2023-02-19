import { Ability } from '@casl/ability';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Action } from 'rxjs/internal/scheduler/Action';
import BaseAdminResolver from 'src/common/baseCRUD.resolver';
import IfDecorator from 'src/common/decorators/if.decorator';
import { BusinessType } from 'src/modules/central/businessType/businessType.model';
import { Country } from 'src/modules/central/country/country.model';
import { Currency } from 'src/modules/central/currency/currency.model';
import { PaymentMethod } from 'src/modules/central/paymentMethod/paymentMethod.model';
import { Speciality } from 'src/modules/central/speciality/speciality.model';
import { CurrentUser } from 'src/modules/common/auth/decorators/currentUser.decorator';
import { EntityParam } from 'src/modules/common/auth/decorators/EntityParam.decorator';
import { Can } from 'src/modules/common/authorization/casl/checkPolicies.decorator';
import { User } from 'src/modules/common/user/user.model';
import { Shop, PaginatedShop } from '../shop.model';
import { ShopOrderInput, CreateShopInput, UpdateShopInput } from './shop.input';

@Resolver(() => Shop)
export class ShopResolver extends BaseAdminResolver(Shop, PaginatedShop, ShopOrderInput, CreateShopInput, UpdateShopInput) {

  
  protected createData(data: CreateShopInput, user:User): Partial<Shop> {
    return {
      ...data,
      // country_id: 'cktfj2bgs0000wjvawdpep000', // Syria
      owner_id: user.id,
    }
  }

  protected updateData(data, user:User) {
    return {
        ...data
    }
  }

  protected whereData(query, user:User) {
    return {
      owner_id: user.id,
      // name: { contains: query || '' },
    }
  }

  protected async canDelete(item:Shop, user:User) {
    return true;
  }



  protected async dataValidation(data:CreateShopInput|UpdateShopInput, user:User, ability: Ability) {
    const country:Country = await this.Models.model(Country).findById(user.countryId)

    if (data.speciality_id !== undefined) {
      const speciality:Speciality = await this.Models.model(Speciality).findById(data.speciality_id)
      if (!speciality.allCountries && !speciality.countries_id?.includes(country.id)) {
          throw new BadRequestException('the selected speciality is not avaiable for the selected country')
      }
    }

    if (data.currency_id !== undefined) {
      const currency:Currency = await this.Models.model(Currency).findById(data.currency_id)
      if (!country.shopCurrencies_id?.includes(currency.id)) {
        throw new BadRequestException('the selected currency is not avaiable for the selected country')
      }
    }

    if (data.viewCurrencies_id !== undefined) {
      
    }

    if (data.business_businessType_id !== undefined) {
      const businessType:BusinessType = await this.Models.model(BusinessType).findById(data.business_businessType_id)
      if (!businessType.allCountries && !businessType.countries_id?.includes(country.id)) {
          throw new BadRequestException('the selected business type is not avaiable for the selected country')
      }
    }

    if (data.paymentMethods_id !== undefined) {
      data.paymentMethods_id.forEach(p_id => {
        if (! (country.paymentMethods_id.includes(p_id))) {
          throw new BadRequestException('the selected payment method are not avaiable for the selected country')
        }
      })
    }
  }
 


  // @ResolveField('owner')
  // async owner(@Parent() shop: Shop) {
  //   return this.prisma.shop.findUnique({ where: { id: shop.id } }).owner();
  // }
}
