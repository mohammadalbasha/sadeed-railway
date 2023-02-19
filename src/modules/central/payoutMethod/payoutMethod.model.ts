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

export enum PayoutMethodType {
    electronic_bank="electronic_bank", transfer_bank="transfer_bank", money_transfer="money_transfer"
}
registerEnumType(PayoutMethodType, {name: "PayoutMethodType", description: ""});

@Schema(defaultLocaleSchemaOptions)
@ObjectType()
export class PayoutMethod_Locale extends BaseLocaleModel {
    @Prop()
    name!: string;

    @Prop()
    desc?: string;
}

@Schema(defaultSchemaOptions)
@ObjectType()
export class PayoutMethod extends BaseModelWithLocales(PayoutMethod_Locale) {
    @Prop()
    @Field(()=> Float)
    minPayout!: number;

    @Prop()
    @Field(()=> Float)
    maxPayout!: number;

    @Prop()
    apiId?: string

    @PropEnum(PayoutMethodType)
    type!: PayoutMethodType

    @PropRef(Currency, true)
    currencies_id!: string[]

    @PropObject(Currency, true)
    currencies!: Currency[]
}
export type PayoutMethodDocument = PayoutMethod & Document;
export const PayoutMethodSchema = BaseSchema(PayoutMethod);

@ObjectType()
export class PaginatedPayoutMethod extends Paginated(PayoutMethod) {}
