import { ArrayUnique, IsDefined, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength, Validate } from 'class-validator';
import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { Unique } from 'src/common/validation/unique.validator';
import { BaseHasLocaleInput, BaseLocaleItemInput, BaseOrderInput, BaseUpdateInput } from 'src/common/base.input';
import { BaseOrder } from 'src/common/order/baseOrder';
import { IsRef } from 'src/common/validation/isRef.validator';
import { Country } from '../../country/country.model';

@InputType()
export class PlanLocaleInput extends BaseLocaleItemInput {
    @MinLength(2)
    name!: string;

    desc?: string;
}

@InputType()
export class CreatePlanInput extends BaseHasLocaleInput(PlanLocaleInput) {
  @Min(0)
  @Field(()=> Float)
  transactionPercentFees!: number;

  @Min(0)
  @Field(()=> Float)
  transactionFixedFees!: number;
}


@InputType()
export class UpdatePlanInput extends BaseUpdateInput(CreatePlanInput){}


@InputType()
export class PlanOrderInput extends BaseOrderInput(['transactionPercentFees', 'transactionFixedFees']) {}
