import { Type } from '@nestjs/common';
import { SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from './base.model';
import { getMongooseVirtuals } from './decorators/PropRef.decorator';

export function BaseSchema<ModelType>(Model: Type<ModelType>) {
  const Schema = SchemaFactory.createForClass(Model)
  Schema.index({'$**': 'text'})
  
  // virtuals
  const virtuals = getMongooseVirtuals(Model)
  for (const v in virtuals) {
    // console.log(v)
    // console.log(virtuals[v])
    Schema.virtual(v, virtuals[v]);
  }


  return Schema
}
