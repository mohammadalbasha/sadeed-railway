import { Field, Int, registerEnumType } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import Paginated from 'src/common/pagination/pagination';
import { Float } from '@nestjs/graphql';
import { BaseModelWithLocales, BaseLocaleModel } from 'src/common/base.model';
import { defaultLocaleSchemaOptions, defaultSchemaOptions } from 'src/common/defaultSchemaOptions.constants';
import { Prop, Schema } from '@nestjs/mongoose';
import { BaseSchema } from 'src/common/base.schema';
import * as mongoose from 'mongoose';
import { Country } from '../country/country.model';
import PropEnum from 'src/common/decorators/PropEnum.decorator';
import { Currency } from '../currency/currency.model';
import { PropObject, PropRef } from 'src/common/decorators/PropRef.decorator';

export enum PaymentMethodType {
    paypal="paypal", credit_card="credit_card", stripe="stripe"
}
registerEnumType(PaymentMethodType, {name: "PaymentMethodType", description: ""});

@Schema(defaultLocaleSchemaOptions)
@ObjectType()
export class PaymentMethod_Locale extends BaseLocaleModel {
    @Prop()
    name!: string;

    @Prop()
    desc?: string;
}

@Schema(defaultSchemaOptions)
@ObjectType()
export class PaymentMethod extends BaseModelWithLocales(PaymentMethod_Locale) {
    @Prop()
    @Field(()=> Float)
    transactionPercentFees!: number;

    @Prop()
    @Field(()=> Float)
    transactionFixedFees!: number;

    @Prop()
    apiId?: string

    @PropEnum(PaymentMethodType)
    type!: PaymentMethodType

    @PropRef(Currency, true)
    currencies_id!: string[]

    @PropObject(Currency, true)
    currencies!: Currency[]
}
export type PaymentMethodDocument = PaymentMethod & Document;
export const PaymentMethodSchema = BaseSchema(PaymentMethod);

@ObjectType()
export class PaginatedPaymentMethod extends Paginated(PaymentMethod) {}
