import { Field, registerEnumType } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import Paginated from 'src/common/pagination/pagination';
import { BaseModel } from 'src/common/base.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from 'src/common/base.schema';
import { defaultSchemaOptions } from 'src/common/defaultSchemaOptions.constants';
@Schema(defaultSchemaOptions)
@ObjectType()
export class Ip extends BaseModel {

    @Field(() => String)
    @Prop()
    ip: string;
}

export type IpDocument = Ip & Document;
export const IpSchema = BaseSchema(Ip);

@ObjectType()
export class PaginatedIp extends Paginated(Ip) {}
