import { Field, Int } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import Paginated from 'src/common/pagination/pagination';
import { Float } from '@nestjs/graphql';
import { BaseModelWithLocales, BaseLocaleModel } from 'src/common/base.model';
import { defaultLocaleSchemaOptions, defaultSchemaOptions } from 'src/common/defaultSchemaOptions.constants';
import { Prop, Schema } from '@nestjs/mongoose';
import { BaseSchema } from 'src/common/base.schema';
import * as mongoose from 'mongoose';
import { Country } from '../country/country.model';

@Schema(defaultLocaleSchemaOptions)
@ObjectType()
export class Currency_Locale extends BaseLocaleModel {
    @Prop()
    name!: string;

    @Prop()
    desc?: string;
}

@Schema(defaultSchemaOptions)
@ObjectType()
export class Currency extends BaseModelWithLocales(Currency_Locale) {
    @Prop()
    code?: string
}
export type CurrencyDocument = Currency & Document;
export const CurrencySchema = BaseSchema(Currency);

@ObjectType()
export class PaginatedCurrency extends Paginated(Currency) {}
