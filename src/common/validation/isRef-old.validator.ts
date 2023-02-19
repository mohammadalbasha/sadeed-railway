import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ValidationArguments, ValidatorConstraintInterface, ValidatorConstraint, ValidationOptions, registerDecorator } from 'class-validator';
import { Connection } from 'mongoose';
import { BaseModel } from '../base.model';
import * as mongoose from 'mongoose'

interface IsRefValidationArguments<E> extends ValidationArguments {
  // constraints: [
  //   ObjectType<E> | EntitySchema<E> | string,
  //   ((validationArguments: ValidationArguments) => FindConditions<E>) | keyof E,
  // ];
  constraints: [
    typeof BaseModel,
    Object | null
  ];
}

@ValidatorConstraint({ name: 'isRef', async: true })
@Injectable()
export class IsRef implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private connection: Connection) {}

  public async validate<E>(value: string | Array<string>, args: IsRefValidationArguments<E>) {
    if (args.constraints === undefined) {
      if (Array.isArray(value)) {
        for (const v of value) {
          if (!mongoose.Types.ObjectId.isValid(v)) return false
        }
        return true
      } else {
        return mongoose.Types.ObjectId.isValid(value)
      }
    }


    let [Model, where] = args.constraints;
  
    if (!where) where = {}
    where = {
      isActive: true,
      ...where
    }

    if (Array.isArray(value)) {
      for (const v of value) {
        if (!mongoose.Types.ObjectId.isValid(v)) return false
        const result = await this.connection.models[Model.name].findOne({_id: new mongoose.Types.ObjectId(v), ...where})
        if (!result) return false
      }
      return true
    }

    if (!mongoose.Types.ObjectId.isValid(value)) return false
    const result = await this.connection.models[Model.name].findOne({_id: new mongoose.Types.ObjectId(value), ...where})
    return result? true: false;
  }

  public defaultMessage(args: ValidationArguments) {
    return `invalid ${args.property} value`;
    // if (args.constraints === undefined) {
    //   return `invalid ${args.property} id`;
    // } else {
    //   // const [entity] = args.constraints;
    //   // const entity = EntityClass.name || 'Entity';
    //   return `could not find ${args.property} id`;
    // }
    
  }
}



// export function IsRef(validationOptions?: ValidationOptions) {
//   return function (object: Object, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       constraints: [],
//       validator: IsRefValidator,
//     });
//   };
// }


