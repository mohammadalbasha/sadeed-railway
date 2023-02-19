import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseLocaleModel, BaseModel, BaseModelWithLocales } from '../../../common/base.model';
import Paginated from 'src/common/pagination/pagination';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { defaultLocaleSchemaOptions, defaultSchemaOptions } from 'src/common/defaultSchemaOptions.constants';
import { BaseSchema } from 'src/common/base.schema';
import { PropRef } from 'src/common/decorators/PropRef.decorator';
import { UserPayoutMethod } from './userPayoutMethod.model';

@Schema(defaultLocaleSchemaOptions)
@ObjectType()
export class UserPayoutRequest_Locale extends BaseLocaleModel {
    @Prop()
    accountName!: string;
}

@Schema(defaultSchemaOptions)
@ObjectType()
export class UserPayoutRequest extends BaseModelWithLocales(UserPayoutRequest_Locale) {
  @Prop()
  user_id: string;

  @PropRef(UserPayoutMethod)
  userPayoutMethod_id: string;

  
}

export type UserPayoutRequestDocument = UserPayoutRequest & Document;
export const UserPayoutRequestSchema = BaseSchema(UserPayoutRequest);


@ObjectType()
export class PaginatedUserPayoutRequest extends Paginated(UserPayoutRequest) {}