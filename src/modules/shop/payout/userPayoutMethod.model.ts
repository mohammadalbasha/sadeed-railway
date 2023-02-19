import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseLocaleModel, BaseModel, BaseModelWithLocales } from '../../../common/base.model';
import Paginated from 'src/common/pagination/pagination';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { defaultLocaleSchemaOptions, defaultSchemaOptions } from 'src/common/defaultSchemaOptions.constants';
import { BaseSchema } from 'src/common/base.schema';
import { PropRef } from 'src/common/decorators/PropRef.decorator';
import { PayoutMethod } from 'src/modules/central/payoutMethod/payoutMethod.model';

@Schema(defaultLocaleSchemaOptions)
@ObjectType()
export class UserPayoutMethod_Locale extends BaseLocaleModel {
    @Prop()
    accountName!: string;
}

@Schema(defaultSchemaOptions)
@ObjectType()
export class UserPayoutMethod extends BaseModelWithLocales(UserPayoutMethod_Locale) {
  @Prop()
  user_id: string;

  @PropRef(PayoutMethod)
  payoutMethod_id: string;

  @Prop()
  isDefault?: boolean;

  @Prop()
  accountNumber: string;

  @Prop()
  city: string;

  @Prop()
  iban: string;

  @Prop()
  swift: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;
}

export type UserPayoutMethodDocument = UserPayoutMethod & Document;
export const UserPayoutMethodSchema = BaseSchema(UserPayoutMethod);


@ObjectType()
export class PaginatedUserPayoutMethod extends Paginated(UserPayoutMethod) {}