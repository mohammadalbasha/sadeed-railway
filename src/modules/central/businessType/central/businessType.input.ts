import { ArrayUnique, IsDefined, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength, Validate } from 'class-validator';
import { InputType, Field, Float } from '@nestjs/graphql';
import { Unique } from 'src/common/validation/unique.validator';
import { BaseHasLocaleInput, BaseLocaleItemInput, BaseOrderInput, BaseUpdateInput } from 'src/common/base.input';
import { BaseOrder } from 'src/common/order/baseOrder';
import { IsRef } from 'src/common/validation/isRef.validator';
import { Country } from '../../country/country.model';
import { ValidateRef } from 'src/common/decorators/ValidateRef.decorator';

@InputType()
export class BusinessTypeLocaleInput extends BaseLocaleItemInput {
    @MinLength(2)
    name!: string;

    desc?: string;
}

@InputType()
export class CreateBusinessTypeInput extends BaseHasLocaleInput(BusinessTypeLocaleInput) {
    @ValidateRef([Country], true)
    countries_id?: string[];
  
    allCountries!: boolean
}


@InputType()
export class UpdateBusinessTypeInput extends BaseUpdateInput(CreateBusinessTypeInput){}



@InputType()
export class BusinessTypeOrderInput  extends BaseOrderInput(['countries']) {}
  
