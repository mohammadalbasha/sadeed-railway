import { ArrayUnique, IsIn, IsNotEmpty, IsOptional, IsString, Min, MinLength, Validate } from 'class-validator';
import { InputType, Field, OmitType } from '@nestjs/graphql';
import { Unique } from 'src/common/validation/unique.validator';
import { BaseOrder } from 'src/common/order/baseOrder';
import { UserDocument, UserDocumentStatus } from '../document.model';
import { BaseHasLocaleInput, BaseLocaleItemInput, BaseOrderInput, BaseUpdateInput } from 'src/common/base.input';
import { IsRef, IsRef2 } from 'src/common/validation/isRef.validator';
import { Currency } from 'src/modules/central/currency/currency.model';
import { Speciality } from 'src/modules/central/speciality/speciality.model';
import { Locale } from 'src/common/lang.constants';
import { PaymentMethod } from 'src/modules/central/paymentMethod/paymentMethod.model';
import { BusinessType } from 'src/modules/central/businessType/businessType.model';
import { NumberValidate } from 'src/common/validation/num.validator';
import { MediaFile } from 'src/modules/common/file/file.model';
import { UserDocumentType } from '../documentType.model';
import { Shop } from '../../shop/shop.model';
import { User } from 'src/modules/common/user/user.model';

@InputType()
export class CreateUserDocumentInput {
  @IsRef2(User)
  user_id!: string;

  @IsRef2(UserDocumentType)
  type_id!: string;

  @IsRef2(Shop)
  shop_id?: string;

  central_notes?: string;

  // @IsRef2(MediaFile)
  // file?: string;
}

@InputType()
export class UpdateUserDocumentInput extends BaseUpdateInput(OmitType(CreateUserDocumentInput, [] as const)) {
  @IsRef2(User)
  user_id?: string;

  @IsRef2(UserDocumentType)
  type_id?: string;

  status: UserDocumentStatus;
}

@InputType()
export class UserDocumentOrderInput extends BaseOrderInput(['status', 'user_id', 'shop_id']) {}
