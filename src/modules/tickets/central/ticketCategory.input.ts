import { ArrayUnique, IsDefined, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength, Validate } from 'class-validator';
import { InputType, Field, Float } from '@nestjs/graphql';
import { Unique } from 'src/common/validation/unique.validator';
import { BaseHasLocaleInput, BaseLocaleItemInput, BaseOrderInput, BaseUpdateInput } from 'src/common/base.input';
import { BaseOrder } from 'src/common/order/baseOrder';
import { IsRef } from 'src/common/validation/isRef.validator';

@InputType()
export class TicketCategoryLocaleInput extends BaseLocaleItemInput {
    @IsDefined()
    @IsNotEmpty()
    @MinLength(2)
    @Field()
    name?: string;
}

@InputType()
export class CreateTicketCategoryInput extends BaseHasLocaleInput(TicketCategoryLocaleInput) {
    
}


@InputType()
export class UpdateTicketCategoryInput extends BaseUpdateInput(CreateTicketCategoryInput){}



@InputType()
export class TicketCategoryOrderInput  extends BaseOrderInput([]) {}
  
