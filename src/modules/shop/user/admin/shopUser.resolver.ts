import { Ability } from "@casl/ability";
import { BadRequestException } from "@nestjs/common";
import { Args, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import BaseResolver from "src/common/base.resolver";
import { Loader } from "src/common/dataLoader/dataLoader.decorator";
import { Country } from "src/modules/central/country/country.model";
import { Currency } from "src/modules/central/currency/currency.model";
import { Speciality } from "src/modules/central/speciality/speciality.model";
import { CurrentAbility } from "src/modules/common/auth/decorators/currentAbility.decorator";
import { CurrentUser } from "src/modules/common/auth/decorators/currentUser.decorator";
import { Action } from "src/modules/common/authorization/casl/action.enum";
import { Can } from "src/modules/common/authorization/casl/checkPolicies.decorator";
import { User } from "src/modules/common/user/user.model";
import { Shop } from "../../shop/shop.model";
import { ShopUserInitInput, ShopUserUpdateInput } from "./shopUser.input";

@Resolver(() => User)
export class ShopUserResolver extends BaseResolver(User) {

    
    @Can([Action.Init, User])
    @Mutation(() => User, {name: 'shopUserInit'})
    async shopUserInit(@CurrentUser() user: User, @CurrentAbility() ability: Ability, @Args('data') data:ShopUserInitInput){
        const country:Country = await this.Models.model(Country).findById(data.country).accessibleBy(ability)
        const currency:Currency = await this.Models.model(Currency).findById(data.currency).accessibleBy(ability)
        const speciality:Speciality = await this.Models.model(Speciality).findById(data.speciality).accessibleBy(ability)

        if (!speciality.allCountries && !speciality.countries_id?.includes(country.id)) {
            throw new BadRequestException('the selected speciality is not avaiable for the selected country')
        }

        if (!country.shopCurrencies_id?.includes(currency.id)) {
            throw new BadRequestException('the selected currency is not avaiable for the selected country')
        }

        const newUser = await this.model.findByIdAndUpdate(user.id, {
            countryId: country.id,
            admin_isSubscribedToNews: data.isSubscribedToNews
        } as Partial<User>, {new: true})

        const shop = await this.Models.model(Shop).create({
            owner_id: user.id,
            slug: data.slug,
            currency_id: currency.id,
            speciality_id: speciality.id
        } as Partial<Shop>)

        return newUser
    }

    // @Can([Action.Update, User])
    @Mutation(() => User, {name: 'shopUserUpdate'})
    async shopUserUpdate(@CurrentUser() user: User, @CurrentAbility() ability: Ability, @Args('data') data:ShopUserUpdateInput){
        const newUser = await this.model.findByIdAndUpdate(user.id, data as Partial<User>, {new: true}).accessibleBy(ability, Action.Update)

        return newUser
    }


    // @Can([Action.Delete, User])
    @Mutation(() => User, {name: 'shopUserDelete'})
    async shopUserDelete(@CurrentUser() user: User, @CurrentAbility() ability: Ability){
        const now = new Date()
        const afterMonth = new Date(now.setMonth(now.getMonth() + 1))
        const newUser = await this.model.findByIdAndUpdate(user.id, {admin_toBeDeletedAt: afterMonth} as Partial<User>, {new: true}).accessibleBy(ability, Action.Delete)

        return newUser
    }


    // @Can([Action.Delete, User])
    @Mutation(() => User, {name: 'shopUserDeleteCancel'})
    async shopUserDeleteCancel(@CurrentUser() user: User, @CurrentAbility() ability: Ability){
        const newUser = await this.model.findByIdAndUpdate(user.id, {admin_toBeDeletedAt: null} as Partial<User>, {new: true}).accessibleBy(ability, Action.Delete)

        return newUser
    }

 
    @ResolveField(() => Country)
    async admin_country(@Parent() parent: User, @Loader(Country) loader) {
      return await loader.load(parent.countryId)
    }

}