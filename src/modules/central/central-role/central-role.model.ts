import { Field, registerEnumType } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import Paginated from 'src/common/pagination/pagination';
import { Float } from '@nestjs/graphql';
import { BaseModelWithLocales, BaseLocaleModel, BaseModel } from 'src/common/base.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from 'src/common/base.schema';
import { defaultLocaleSchemaOptions, defaultSchemaOptions } from 'src/common/defaultSchemaOptions.constants';
import { PropObject, PropRef } from 'src/common/decorators/PropRef.decorator';
import { Injectable } from '@nestjs/common';
import { ConditionsTypes } from './central-role.input';
import {GraphQLJSON, GraphQLJSONObject} from 'graphql-type-json';



//@ObjectType()
class Conditions  {
    [index: string]: {
    type: ConditionsTypes,
    value?: boolean | string[] | string | {$in: string[]} ; 
    }
}

@ObjectType()
export class Permisions {
    @Field()
    action: string;

    @Field()
    subject: string;

    @Field(type => [String])
    fields?: string[]

    @Field((type) => GraphQLJSON)
    conditions? : Conditions;

}


@Injectable()
@Schema(defaultSchemaOptions)
@ObjectType()
export class CentralRole extends BaseModelWithLocales() {
   
    @Prop({index: true})
    name: string

    @Prop()
    description: string

    @Prop(type => [Permisions])
    permisions: Permisions[];

}

export type CentralRoleDocument = CentralRole & Document;
export const CentralRoleSchema = BaseSchema(CentralRole);

@ObjectType()
export class PaginatedCentralRole extends Paginated(CentralRole) {}
