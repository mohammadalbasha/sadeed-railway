import { ArrayUnique, IsDefined, IsIn, IsNotEmpty, IsOptional, IsString, Min, MinLength, Validate } from 'class-validator';
import { InputType, Field, OmitType } from '@nestjs/graphql';
import { Unique } from 'src/common/validation/unique.validator';
import { BaseOrder } from 'src/common/order/baseOrder';
import { BaseHasLocaleInput, BaseLocaleItemInput, BaseOrderInput, BaseUpdateInput } from 'src/common/base.input';
import { IsRef, IsRef2 } from 'src/common/validation/isRef.validator';
import { Currency } from 'src/modules/central/currency/currency.model';
import { Speciality } from 'src/modules/central/speciality/speciality.model';
import { Locale } from 'src/common/lang.constants';
import { PaymentMethod } from 'src/modules/central/paymentMethod/paymentMethod.model';
import { BusinessType } from 'src/modules/central/businessType/businessType.model';
import { NumberValidate } from 'src/common/validation/num.validator';
import { UserPayoutMethod } from '../userPayoutMethod.model';
import { PayoutMethod } from 'src/modules/central/payoutMethod/payoutMethod.model';

@InputType()
export class UserPayoutMethodLocaleInput extends BaseLocaleItemInput {
  accountName!: string;
}

@InputType()
export class CreateUserPayoutMethodInput extends BaseHasLocaleInput(UserPayoutMethodLocaleInput) {
  @IsRef2(PayoutMethod)
  payoutMethod_id: string;

  // isDefault!: boolean;

  accountNumber!: string;

  city!: string;

  iban!: string;

  swift!: string;

  email!: string;

  phone!: string;
}

@InputType()
export class UpdateUserPayoutMethodInput extends BaseUpdateInput(OmitType(CreateUserPayoutMethodInput, [] as const)) {

}

@InputType()
export class MakeDefaultUserPayoutMethodInput {
  @IsRef2(UserPayoutMethod)
  id!: string;
}

@InputType()
export class UserPayoutMethodOrderInput extends BaseOrderInput([]) {}
