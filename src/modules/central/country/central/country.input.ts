import { ArrayUnique, IsDefined, IsNotEmpty, Length, MaxLength, Min, MinLength, Validate } from 'class-validator';
import { InputType, Field, Float } from '@nestjs/graphql';
import { Unique } from 'src/common/validation/unique.validator';
import { BaseHasLocaleInput, BaseLocaleItemInput, BaseOrderInput, BaseUpdateInput } from 'src/common/base.input';
import { Country } from '../country.model';
import { ValidateRef } from 'src/common/decorators/ValidateRef.decorator';
import { PayoutMethod } from '../../payoutMethod/payoutMethod.model';
import { Currency } from '../../currency/currency.model';
import { PaymentMethod } from '../../paymentMethod/paymentMethod.model';
import { Plan } from '../../plan/plan.model';

@InputType()
export class CountryLocaleInput extends BaseLocaleItemInput {
    @Field()
    @IsDefined()
    @IsNotEmpty()
    @MinLength(2)
    name?: string;
}

@InputType()
export class CreateCountryInput extends BaseHasLocaleInput(CountryLocaleInput) {
  @ValidateRef([Plan])
  plan_id!: string

  @ValidateRef([Currency])
  currency_id!: string

  @ValidateRef([Currency], true)
  shopCurrencies_id!: string[]

  @ValidateRef([PaymentMethod], true)
  paymentMethods_id!: string[]

  @ValidateRef([PayoutMethod], true)
  payoutMethods_id!: string[]
  
  @Length(2, 2)
  @Validate(Unique, [Country, 'code'])
  code!: string;

  @Min(0)
  @Field(() => Float)
  invitationPrize!: number;
  
}


@InputType()
export class UpdateCountryInput extends BaseUpdateInput(CreateCountryInput)  {}


@InputType()
export class CountryOrderInput extends BaseOrderInput(['code', 'transactionFee', 'invitationPrize']) {}

