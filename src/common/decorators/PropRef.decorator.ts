import { Prop } from "@nestjs/mongoose";
import * as mongoose from "mongoose"
import { BaseModel } from "../base.model";
// import "reflect-metadata";

// const metaDataName = Symbol("MongooseVirtuals");

export function PropRef(Model: typeof BaseModel, isArray:boolean = false): PropertyDecorator {
  if (isArray) {
    return Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Model.name, index: true })
  }
  return Prop({ type: mongoose.Schema.Types.ObjectId, ref: Model.name, index: true })
}


export function PropObject(Model: typeof BaseModel, isArray:boolean = false, foreignField: string=''): PropertyDecorator {
  return (target, key) => {
    let meta = {ref: Model.name, localField:key.toString()+"_id", foreignField: "_id", justOne: !isArray}
    if (foreignField !== '') {
      meta.localField = "_id"
      meta.foreignField = foreignField
    }
    const virtuals = Reflect.getOwnMetadata('MongooseVirtuals', target.constructor) || {};
    virtuals[key] = meta
    Reflect.defineMetadata('MongooseVirtuals', virtuals, target.constructor)
  }
}

export function getMongooseVirtuals(Model: any) {
  return Reflect.getMetadata('MongooseVirtuals', Model);
}

// function format(formatString: string) {
//   return Reflect.metadata(formatMetadataKey, formatString);
// }
// function getRefObjectMetadataKey(target: any, propertyKey: string) {
//   return Reflect.getMetadata(refObjectMetadataKey, target, propertyKey);
// }

// workerSchema.virtual('department', {
//   ref: "Department",
//   localField: ["locationCode", "departmentCode"],
//   foreignField: ["locationCode", "code"]
// });