import { ArrayUnique, IsDefined, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Length, MaxLength, Min, MinLength, Validate } from 'class-validator';
import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { Unique } from 'src/common/validation/unique.validator';
import { BaseHasLocaleInput, BaseLocaleItemInput, BaseOrderInput, BaseUpdateInput } from 'src/common/base.input';
import { BaseOrder } from 'src/common/order/baseOrder';
import { IsRef } from 'src/common/validation/isRef.validator';
import { Country } from '../../country/country.model';
import { PayoutMethodType } from '../payoutMethod.model';
import { Currency } from '../../currency/currency.model';

@InputType()
export class PayoutMethodLocaleInput extends BaseLocaleItemInput {
    @MinLength(2)
    name!: string;

    desc?: string;
}

@InputType()
export class CreatePayoutMethodInput extends BaseHasLocaleInput(PayoutMethodLocaleInput) {
  @Min(0)
  @Field(()=> Float)
  minPayout!: number;

  @Min(0)
  @Field(()=> Float)
  maxPayout!: number;

  apiId?: string

  type!: PayoutMethodType

  @ArrayUnique()
  @Validate(IsRef, [Currency])
  currencies_id!: string[]
}


@InputType()
export class UpdatePayoutMethodInput extends BaseUpdateInput(CreatePayoutMethodInput){}


@InputType()
export class PayoutMethodOrderInput extends BaseOrderInput(['transactionPercentFees', 'transactionFixedFees', 'currencies', 'type']) {}
