import { ArrayUnique, IsDefined, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength, Validate } from 'class-validator';
import { InputType, Field, Float } from '@nestjs/graphql';
import { Unique } from 'src/common/validation/unique.validator';
import { BaseHasLocaleInput, BaseInput, BaseLocaleItemInput, BaseOrderInput, BaseUpdateInput } from 'src/common/base.input';
import { BaseOrder } from 'src/common/order/baseOrder';
import { IsRef } from 'src/common/validation/isRef.validator';

@InputType()
export class CreateTicketMessageInput extends BaseInput {
    ticket_id!: string;
  
    @MinLength(1)
    message!: string;
}

@InputType()
export class UpdateTicketMessageInput extends BaseUpdateInput(CreateTicketMessageInput){}

@InputType()
export class TicketMessageOrderInput extends BaseOrderInput([]) {}

