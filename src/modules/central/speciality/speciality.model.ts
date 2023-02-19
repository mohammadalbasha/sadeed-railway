import { Field, HideField } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import Paginated from 'src/common/pagination/pagination';
import { Float } from '@nestjs/graphql';
import { BaseModelWithLocales, BaseLocaleModel, BaseModel } from 'src/common/base.model';
import { defaultLocaleSchemaOptions, defaultSchemaOptions } from 'src/common/defaultSchemaOptions.constants';
import { Prop, Schema } from '@nestjs/mongoose';
import { BaseSchema } from 'src/common/base.schema';
import * as mongoose from 'mongoose';
import { Country } from '../country/country.model';
import { PropRef, PropObject } from 'src/common/decorators/PropRef.decorator';

@Schema(defaultLocaleSchemaOptions)
@ObjectType()
export class Speciality_Locale extends BaseLocaleModel {
    @Prop()
    name!: string;

    @Prop()
    desc?: string;
}

@Schema(defaultSchemaOptions)
@ObjectType()
export class Speciality extends BaseModelWithLocales(Speciality_Locale) {
    @Prop({default: false, index: true})
    allCountries!: boolean

    @PropRef(Country, true)
    countries_id: string[]

    @PropObject(Country, true)
    countries?: Country[]
}
export type SpecialityDocument = Speciality & Document;
export const SpecialitySchema = BaseSchema(Speciality);

@ObjectType()
export class PaginatedSpeciality extends Paginated(Speciality) {}


