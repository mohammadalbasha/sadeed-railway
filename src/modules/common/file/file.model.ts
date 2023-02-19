import { Field, HideField, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from '../user/user.model';
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
import { Shop } from 'src/modules/shop/shop/shop.model';
import { classToPlain, Exclude } from 'class-transformer';


enum MediaFileStorageType {
  local="local"
}

registerEnumType(MediaFileStorageType, {name: "MediaFileStorageType", description: ""})

@Schema(defaultLocaleSchemaOptions)
@ObjectType()
export class MediaFile_Locale extends BaseLocaleModel {

}

@Schema(defaultSchemaOptions)
@ObjectType()
export class MediaFile extends BaseModelWithLocales() {
  // @PropRef(DocumentType)
  // documentType_id: string;

  @PropRef(User)
  user_id?: string;

  @PropRef(Shop)
  shop_id?: string;

  @PropEnum(MediaFileStorageType, MediaFileStorageType.local)
  storage?: MediaFileStorageType;

  @Prop()
  @Exclude()
  @HideField()
  path?: string;

  @Prop()
  filename?: string;

  @Prop()
  originalName?: string;

  @Prop()
  name?: string;

  @Prop()
  size?: number;

  @Prop()
  mimeType?: string;

  @Prop({default: true})
  isPublic?: boolean;

  toJSON() { return classToPlain(this); }
}

export type MediaFileDocument = MediaFile & Document;
export const MediaFileSchema = BaseSchema(MediaFile);


@ObjectType()
export class PaginatedMediaFile extends Paginated(MediaFile) {}