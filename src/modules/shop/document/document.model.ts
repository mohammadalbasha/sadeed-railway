import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from '../../common/user/user.model';
import { BaseLocaleModel, BaseModel, BaseModelWithLocales } from '../../../common/base.model';
import Paginated from 'src/common/pagination/pagination';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { defaultLocaleSchemaOptions, defaultSchemaOptions } from 'src/common/defaultSchemaOptions.constants';
import { BaseSchema } from 'src/common/base.schema';
import { PropRef } from 'src/common/decorators/PropRef.decorator';
import { Currency } from 'src/modules/central/currency/currency.model';
import { Speciality } from 'src/modules/central/speciality/speciality.model';
import PropEnum from 'src/common/decorators/PropEnum.decorator';
import { Locale } from 'src/common/lang.constants';
import { PaymentMethod } from 'src/modules/central/paymentMethod/paymentMethod.model';
import { BusinessType } from 'src/modules/central/businessType/businessType.model';
import { Shop } from '../shop/shop.model';
import { MediaFile } from 'src/modules/common/file/file.model';
import { UserDocumentType } from './documentType.model';
import { AuthorizeField } from 'src/common/decorators/AuthorizeField.decorator';
import { Endpoint } from 'src/common/GlobalClass';

export enum UserDocumentStatus {
  requested='requested', uploaded='uploaded', processing='processing', accepted='accepted', rejected='rejected',
}
registerEnumType(UserDocumentStatus, {name: "DocumentStatus", description: ""})

@Schema(defaultLocaleSchemaOptions)
@ObjectType()
export class UserDocument_Locale extends BaseLocaleModel {

}

@Schema(defaultSchemaOptions)
@ObjectType()
export class UserDocument extends BaseModelWithLocales() {

  @PropRef(User)
  user_id?: string;

  @PropRef(Shop)
  shop_id?: string;

  @PropRef(UserDocumentType)
  type_id?: string;

  @Prop()
  user_notes?: string;

  @AuthorizeField(Endpoint.central)
  @Prop()
  central_notes?: string;

  @PropRef(MediaFile)
  file_id?: string;

  file?: MediaFile

  @PropEnum(UserDocumentStatus, UserDocumentStatus.requested)
  status: UserDocumentStatus;
}

export type UserDocumentDocument = UserDocument & Document;
export const UserDocumentSchema = BaseSchema(UserDocument);


@ObjectType()
export class PaginatedUserDocument extends Paginated(UserDocument) {}