import { ArrayUnique, IsDefined, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Length, MaxLength, Min, MinLength, Validate } from 'class-validator';
import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { Unique } from 'src/common/validation/unique.validator';
import { BaseHasLocaleInput, BaseLocaleItemInput, BaseOrderInput, BaseUpdateInput } from 'src/common/base.input';
import { BaseOrder } from 'src/common/order/baseOrder';
import { IsRef } from 'src/common/validation/isRef.validator';
import { Country } from '../../country/country.model';

@InputType()
export class CurrencyLocaleInput extends BaseLocaleItemInput {
    @MinLength(2)
    name!: string;

    desc?: string;
}

@InputType()
export class CreateCurrencyInput extends BaseHasLocaleInput(CurrencyLocaleInput) {
  @Length(1,5)
  code!: string;
}


@InputType()
export class UpdateCurrencyInput extends BaseUpdateInput(CreateCurrencyInput){}


@InputType()
export class CurrencyOrderInput extends BaseOrderInput(['code']) {}
