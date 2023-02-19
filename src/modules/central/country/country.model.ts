import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import Paginated from 'src/common/pagination/pagination';
import { Float } from '@nestjs/graphql';
import { BaseModelWithLocales, BaseLocaleModel, BaseModel } from 'src/common/base.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from 'src/common/base.schema';
import { defaultLocaleSchemaOptions, defaultSchemaOptions } from 'src/common/defaultSchemaOptions.constants';
import { PropObject, PropRef } from 'src/common/decorators/PropRef.decorator';
import { Currency } from '../currency/currency.model';
import { PaymentMethod } from '../paymentMethod/paymentMethod.model';
import { Plan } from '../plan/plan.model';
import { PayoutMethod } from '../payoutMethod/payoutMethod.model';

@Schema(defaultLocaleSchemaOptions)
@ObjectType()
export class Country_Locale extends BaseLocaleModel {
    @Prop()
    @Field(() => String, {nullable:false})
    name!: string;
}

@Schema(defaultSchemaOptions)
@ObjectType()
export class Country extends BaseModelWithLocales(Country_Locale) {
    @PropRef(Plan)
    plan_id: string
    @PropObject(Plan)
    plan: Plan

    @PropRef(Currency)
    currency_id: string
    @PropObject(Currency)
    currency: Currency

    @PropRef(Currency, true)
    shopCurrencies_id: string[]
    @PropObject(Currency, true)
    shopCurrencies: Currency[]

    @PropRef(PaymentMethod, true)
    paymentMethods_id: string[]
    @PropObject(PaymentMethod, true)
    paymentMethods: PaymentMethod[]

    @PropRef(PayoutMethod, true)
    payoutMethods_id: string[]
    @PropObject(PayoutMethod, true)
    payoutMethods: PayoutMethod[]
    


    @Prop()
    @Field(() => String, {nullable:false})
    code!: string;

    @Prop()
    @Field(() => Float)
    invitationPrize!: number;

}
export type CountryDocument = Country & Document;
export const CountrySchema = BaseSchema(Country);

@ObjectType()
export class PaginatedCountry extends Paginated(Country) {}
