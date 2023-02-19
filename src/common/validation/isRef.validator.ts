import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ValidationArguments, ValidatorConstraintInterface, ValidatorConstraint, ValidationOptions, registerDecorator, arrayUnique } from 'class-validator';
import { Connection } from 'mongoose';
import { BaseModel } from '../base.model';
import * as mongoose from 'mongoose'
import { User } from 'src/modules/common/user/user.model';
import { CurrentUser } from 'src/modules/common/auth/decorators/currentUser.decorator';
import { CONTEXT } from '@nestjs/graphql';
import { Reflector, REQUEST } from '@nestjs/core';

interface IsRefValidationArguments extends ValidationArguments {
  // constraints: [
  //   ObjectType<E> | EntitySchema<E> | string,
  //   ((validationArguments: ValidationArguments) => FindConditions<E>) | keyof E,
  // ];
  constraints: [
    typeof BaseModel,
    Object,
    // ((object: E, user: Connection, connection: Connection) => Promise<boolean>) | null
  ];
}

@ValidatorConstraint({ name: 'isRef', async: true })
@Injectable()
export class IsRef implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private connection: Connection) {}

  public async validate(value: string | Array<string>, args: IsRefValidationArguments) {
    if (value === undefined) return true;


    // check if valid ids
    if (Array.isArray(value)) {
      // if (!arrayUnique(value)) {
      //   (args as any).arrayNotUnique = true
      //   return false
      // }
      for (const v of value) {
        if (!mongoose.Types.ObjectId.isValid(v)) return false
      }
    } else {
      if (!mongoose.Types.ObjectId.isValid(value)) return false
    }

    // no constraints
    if (args.constraints === undefined) {
      return true
    }


    // let [Model, where, checkCallback] = args.constraints;
    let [Model, where] = args.constraints;
  
    if (!where) where = {}
    where = {
      isActive: true,
      ...where
    }

    

    if (Array.isArray(value)) {
      for (const v of value) {

        // if (!mongoose.Types.ObjectId.isValid(v)) return false
        const result = await this.connection.models[Model.name].findOne({_id: new mongoose.Types.ObjectId(v), ...where})
        if (!result) return false
        // if (checkCallback && !(await checkCallback(result, this.connection, this.connection))) {
        //   return false
        // }
      }
      return true
    } else {

      const result = await this.connection.models[Model.name].findOne({_id: new mongoose.Types.ObjectId(value), ...where})
      if (!result) return false
      // if (checkCallback && !(await checkCallback(result, this.connection, this.connection))) {
      //   return false
      // }
      return true
    }
  }

  public defaultMessage(args: ValidationArguments) {
    // if ((args as any).arrayNotUnique) {
    //   return `All {property}'s elements must be unique`
    // }
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



export function IsRef2(constraints: IsRefValidationArguments["constraints"] | [typeof BaseModel] | typeof BaseModel, validationOptions?: ValidationOptions) {
  // if (!Array.isArray(constraints)) {
  //   console.log(constraints)
  //   constraints = [constraints] as any
  // }
  return function (object: Object, propertyName: string) {
    registerDecorator({
      // name: 'isRef',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [constraints],
      validator: IsRef,
    });
  };
}


