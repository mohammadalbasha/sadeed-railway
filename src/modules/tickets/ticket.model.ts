import { Field, HideField, ObjectType, registerEnumType } from '@nestjs/graphql';
import Paginated from 'src/common/pagination/pagination';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { defaultLocaleSchemaOptions, defaultSchemaOptions } from 'src/common/defaultSchemaOptions.constants';
import { BaseSchema } from 'src/common/base.schema';
import { BaseModel } from 'src/common/base.model';
import { TicketCategory } from './ticketCategory.model';
import { User } from '../common/user/user.model';
import { PropObject, PropRef } from 'src/common/decorators/PropRef.decorator';
import PropEnum from 'src/common/decorators/PropEnum.decorator';
import { AuthorizeField } from 'src/common/decorators/AuthorizeField.decorator';
import { Endpoint } from 'src/common/GlobalClass';

export enum TicketStatus {
  open="open",reopened="reopened",solved="solved",processing="processing",closed="closed",
}
export enum TicketPriority {
  high="high",normal="normal",low="low",
}
registerEnumType(TicketStatus, {name: "TicketStatus", description: ""});
registerEnumType(TicketPriority, {name: "TicketPriority", description: ""});




@Schema(defaultSchemaOptions)
@ObjectType()
export class Ticket extends BaseModel {
  @PropRef(TicketCategory)
  category_id: string;
  @PropObject(TicketCategory)
  category: TicketCategory;

  @PropRef(User)
  user_id: string;
  @PropObject(User)
  user?: User;

  @PropRef(User)
  admin_id?: string;
  @PropObject(User)
  admin?: User;

  @PropEnum(TicketStatus)
  status: TicketStatus; 

  @PropEnum(TicketPriority)
  priority: TicketPriority;

  @Prop()
  subject: string;

  @Prop({default: false, index: true})
  @AuthorizeField(Endpoint.central)
  isCentralSeen: boolean

  @Prop({default: false, index: true})
  isUserSeen: boolean

  @Prop()
  @AuthorizeField(Endpoint.central)
  central_notes?: string;

  @Prop({index: true})
  lastReplyTime: Date;

  @Prop()
  lastReplyMessage: string;

  @Prop({default: false, index: true})
  lastReplyIsByAdmin: boolean
}

export type TicketDocument = Ticket & Document;
export const TicketSchema = BaseSchema(Ticket);

// TicketSchema.virtual('category', {
//   ref: TicketCategory.name,
//   localField: "category_id",
//   foreignField: "_id",
//   justOne: true,
// });

// TicketSchema.virtual('user', {
//   ref: "User",
//   localField: "user_id",
//   foreignField: "_id",
//   justOne: true,
// });

// TicketSchema.virtual('admin', {
//   ref: "User",
//   localField: "admin_id",
//   foreignField: "_id",
//   justOne: true,
// });

@ObjectType()
export class PaginatedTicket extends Paginated(Ticket) {}