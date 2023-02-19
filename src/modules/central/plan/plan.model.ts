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
export class Plan_Locale extends BaseLocaleModel {
    @Prop()
    name!: string;

    @Prop()
    desc?: string;
}

@Schema(defaultSchemaOptions)
@ObjectType()
export class Plan extends BaseModelWithLocales(Plan_Locale) {
    @Prop()
    @Field(()=> Float)
    transactionPercentFees!: number;

    @Prop()
    @Field(()=> Float)
    transactionFixedFees!: number;
}
export type PlanDocument = Plan & Document;
export const PlanSchema = BaseSchema(Plan);

@ObjectType()
export class PaginatedPlan extends Paginated(Plan) {}
