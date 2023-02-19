import { Field, ObjectType } from '@nestjs/graphql';
import Paginated from 'src/common/pagination/pagination';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { defaultLocaleSchemaOptions, defaultSchemaOptions } from 'src/common/defaultSchemaOptions.constants';
import { BaseSchema } from 'src/common/base.schema';
import { BaseModelWithLocales, BaseLocaleModel, BaseModel } from 'src/common/base.model';


@Schema(defaultLocaleSchemaOptions)
@ObjectType()
export class TicketCategory_Locale extends BaseLocaleModel {
    @Prop()
    name!: string; // the name
}


@Schema(defaultSchemaOptions)
@ObjectType()
export class TicketCategory extends BaseModelWithLocales(TicketCategory_Locale)  {
    
}

export type TicketCategoryDocument = TicketCategory & Document;
export const TicketCategorySchema = BaseSchema(TicketCategory);


@ObjectType()
export class PaginatedTicketCategory extends Paginated(TicketCategory) {}