import { Field, HideField, ObjectType } from '@nestjs/graphql';
import Paginated from 'src/common/pagination/pagination';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { defaultLocaleSchemaOptions, defaultSchemaOptions } from 'src/common/defaultSchemaOptions.constants';
import { BaseSchema } from 'src/common/base.schema';
import { BaseModel } from 'src/common/base.model';
import { Ticket } from './ticket.model';
import { User } from '../common/user/user.model';
import { PropObject, PropRef } from 'src/common/decorators/PropRef.decorator';
import { AuthorizeField } from 'src/common/decorators/AuthorizeField.decorator';

@Schema(defaultSchemaOptions)
@ObjectType()
export class TicketMessage extends BaseModel {
  @PropRef(Ticket)
  ticket_id: string;
  @HideField()
  ticket: Ticket;

  @PropRef(User)
  admin_id?: string;
  @PropObject(User)
  admin?: User;

  @Prop({default: false, index: true})
  isAdmin: boolean;

  @Prop()
  message: string;

  @Prop({index: true})
  seenAt?: Date;
}

export type TicketMessageDocument = TicketMessage & Document;
export const TicketMessageSchema = BaseSchema(TicketMessage);


@ObjectType()
export class PaginatedTicketMessage extends Paginated(TicketMessage) {}