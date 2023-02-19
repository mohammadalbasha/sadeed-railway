import { ArrayUnique, IsDefined, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Length, MaxLength, Min, MinLength, Validate } from 'class-validator';
import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { Unique } from 'src/common/validation/unique.validator';
import { BaseHasLocaleInput, BaseLocaleItemInput, BaseOrderInput, BaseUpdateInput } from 'src/common/base.input';
import { BaseOrder } from 'src/common/order/baseOrder';
import { IsRef } from 'src/common/validation/isRef.validator';
import { Country } from '../../country/country.model';
import { PaymentMethodType } from '../paymentMethod.model';
import { Currency } from '../../currency/currency.model';

@InputType()
export class PaymentMethodLocaleInput extends BaseLocaleItemInput {
    @MinLength(2)
    name!: string;

    desc?: string;
}

@InputType()
export class CreatePaymentMethodInput extends BaseHasLocaleInput(PaymentMethodLocaleInput) {
  @Min(0)
  @Field(()=> Float)
  transactionPercentFees!: number;

  @Min(0)
  @Field(()=> Float)
  transactionFixedFees!: number;

  apiId?: string

  type!: PaymentMethodType

  @ArrayUnique()
  @Validate(IsRef, [Currency])
  currencies_id!: string[]
}


@InputType()
export class UpdatePaymentMethodInput extends BaseUpdateInput(CreatePaymentMethodInput){}


@InputType()
export class PaymentMethodOrderInput extends BaseOrderInput(['transactionPercentFees', 'transactionFixedFees', 'currencies', 'type']) {}
