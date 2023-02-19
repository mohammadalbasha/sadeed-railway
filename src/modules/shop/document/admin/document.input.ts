import { ArrayUnique, IsIn, IsNotEmpty, IsOptional, IsString, Min, MinLength, Validate } from 'class-validator';
import { InputType, Field, OmitType } from '@nestjs/graphql';
import { Unique } from 'src/common/validation/unique.validator';
import { BaseOrder } from 'src/common/order/baseOrder';
import { UserDocument } from '../document.model';
import { BaseHasLocaleInput, BaseLocaleItemInput, BaseOrderInput, BaseUpdateInput, BaseUpdateInputClass } from 'src/common/base.input';
import { IsRef, IsRef2 } from 'src/common/validation/isRef.validator';
import { Currency } from 'src/modules/central/currency/currency.model';
import { Speciality } from 'src/modules/central/speciality/speciality.model';
import { Locale } from 'src/common/lang.constants';
import { PaymentMethod } from 'src/modules/central/paymentMethod/paymentMethod.model';
import { BusinessType } from 'src/modules/central/businessType/businessType.model';
import { NumberValidate } from 'src/common/validation/num.validator';
import { MediaFile } from 'src/modules/common/file/file.model';


@InputType()
export class UpdateUserDocumentInput extends BaseUpdateInputClass {
  
  user_notes?: string;

  @IsRef2(MediaFile)
  file_id?: string;

}

@InputType()
export class UserDocumentOrderInput extends BaseOrderInput(['status']) {}