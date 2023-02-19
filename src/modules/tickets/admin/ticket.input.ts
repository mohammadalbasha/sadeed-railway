import { ArrayUnique, IsDefined, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength, Validate } from 'class-validator';
import { InputType, Field, Float } from '@nestjs/graphql';
import { Unique } from 'src/common/validation/unique.validator';
import { BaseHasLocaleInput, BaseInput, BaseLocaleItemInput, BaseOrderInput, BaseUpdateInput } from 'src/common/base.input';
import { BaseOrder } from 'src/common/order/baseOrder';
import { IsRef } from 'src/common/validation/isRef.validator';
import { TicketStatus, TicketPriority } from '../ticket.model';
import { TicketCategory } from '../ticketCategory.model';


@InputType()
export class CreateTicketInput extends BaseInput {
    @Validate(IsRef, [TicketCategory])
    category_id!: string;
  
    priority!: TicketPriority;
  
    subject!: string;
  
    message!: string;
}

@InputType()
export class UpdateTicketInput extends BaseUpdateInput(CreateTicketInput){}


@InputType()
export class TicketOrderInput  extends BaseOrderInput([]) {}

