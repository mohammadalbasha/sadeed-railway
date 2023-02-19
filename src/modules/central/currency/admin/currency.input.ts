import { ArrayUnique, IsDefined, IsNotEmpty, Length, MaxLength, Min, MinLength, Validate } from 'class-validator';
import { InputType, Field, Float } from '@nestjs/graphql';
import { Unique } from 'src/common/validation/unique.validator';
import { BaseFilterInput, BaseHasLocaleInput, BaseLocaleItemInput, BaseOrderInput, BaseUpdateInput } from 'src/common/base.input';
import { ValidateRef } from 'src/common/decorators/ValidateRef.decorator';
import { PayoutMethod } from '../../payoutMethod/payoutMethod.model';
import { Currency } from '../currency.model';
import { PaymentMethod } from '../../paymentMethod/paymentMethod.model';
import { Plan } from '../../plan/plan.model';


@InputType()
export class CurrencyFilterInput extends BaseFilterInput {
  isActive?: boolean
}

@InputType()
export class CurrencyOrderInput extends BaseOrderInput([]) {}



