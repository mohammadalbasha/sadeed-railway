import { ArrayUnique, IsDefined, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength, Validate } from 'class-validator';
import { InputType, Field, Float } from '@nestjs/graphql';
import { Unique } from 'src/common/validation/unique.validator';
import { BaseFilterInput, BaseHasLocaleInput, BaseInput, BaseLocaleItemInput, BaseOrderInput, BaseUpdateInput } from 'src/common/base.input';
import { BaseOrder } from 'src/common/order/baseOrder';
import { IsRef } from 'src/common/validation/isRef.validator';
import { TicketStatus, TicketPriority } from '../ticket.model';
import { TicketCategory } from '../ticketCategory.model';

@InputType()
export class UpdateTicketInput {
    id!: string;

    status?: TicketStatus;

    central_notes?: string;
}

@InputType()
export class TicketFilterInput extends BaseFilterInput {
    @IsOptional()
    @Validate(IsRef, [TicketCategory])
    category_id?: string;
  
    priority?: TicketPriority;

    status?: TicketStatus;

    isCentralSeen?: boolean;

    @IsOptional()
    @Validate(IsRef)
    admin_id?: string;

    lastReplyIsByAdmin?: boolean;
}

@InputType()
export class TicketOrderInput extends BaseOrderInput(['category_id', 'priority', 'status', 'isCentralSeen', 'admin_id', 'lastReplyIsByAdmin']) {}

