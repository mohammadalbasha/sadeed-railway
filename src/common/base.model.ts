import { Type } from '@nestjs/common';
import { Field, ObjectType, ID, HideField } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


import {
  AccessibleFieldsDocument
} from '@casl/mongoose';

@Schema({id: true, timestamps: true})
@ObjectType({ isAbstract: true })
export class BaseModel  {
  @Field(() => ID)
  id: string;

  createdAt?: Date;

  updatedAt?: Date;

  @Prop({ default: true})
  isActive?: boolean;


  // @HideField()
  // _prismaTypeName: string;
}

@Schema()
@ObjectType({ isAbstract: true })
export abstract class BaseLocaleModel {
  @Prop()
  locale!: string;
}

export function BaseModelWithLocales<LocaleModel> (LocaleModel: Type<LocaleModel> = null): typeof BaseModel {
  if (LocaleModel === null) {
    return BaseModel;
  } else {
    @Schema()
    @ObjectType({ isAbstract: true })
    class BaseModelWithLocales extends BaseModel {
      @Prop({ type: [SchemaFactory.createForClass(LocaleModel)] })
      @HideField()
      @Field(() => [LocaleModel], {nullable:false})
      locales: LocaleModel[]
    }
    return BaseModelWithLocales;
  }
}
