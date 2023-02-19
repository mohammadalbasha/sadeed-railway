import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import Paginated from 'src/common/pagination/pagination';
import { Float } from '@nestjs/graphql';
import { BaseModelWithLocales, BaseLocaleModel, BaseModel } from 'src/common/base.model';
import { defaultLocaleSchemaOptions, defaultSchemaOptions } from 'src/common/defaultSchemaOptions.constants';
import { Prop, Schema } from '@nestjs/mongoose';
import { BaseSchema } from 'src/common/base.schema';
import * as mongoose from 'mongoose';
import { Country } from '../country/country.model';
import { PropObject, PropRef } from 'src/common/decorators/PropRef.decorator';

@Schema(defaultLocaleSchemaOptions)
@ObjectType()
export class BusinessType_Locale extends BaseLocaleModel {
    @Prop()
    name!: string;

    @Prop()
    desc?: string;
}

@Schema(defaultSchemaOptions)
@ObjectType()
export class BusinessType extends BaseModelWithLocales(BusinessType_Locale) {
    @Prop({default: false, index: true})
    allCountries!: boolean

    @PropRef(Country, true)
    countries_id?: string[]

    @PropObject(Country, true)
    countries?: Country[]
}
export type BusinessTypeDocument = BusinessType & Document;
export const BusinessTypeSchema = BaseSchema(BusinessType);

@ObjectType()
export class PaginatedBusinessType extends Paginated(BusinessType) {}


