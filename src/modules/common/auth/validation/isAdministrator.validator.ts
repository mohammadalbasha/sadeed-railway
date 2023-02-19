import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ValidationArguments, ValidatorConstraintInterface, ValidatorConstraint, ValidationOptions, registerDecorator, arrayUnique } from 'class-validator';
import { Connection } from 'mongoose';
import { BaseModel } from '../../../../common/base.model';
import * as mongoose from 'mongoose'
import { User } from 'src/modules/common/user/user.model';
import { CurrentUser } from 'src/modules/common/auth/decorators/currentUser.decorator';
import { CONTEXT } from '@nestjs/graphql';
import { Reflector, REQUEST } from '@nestjs/core';

interface IsAdministratorValidationArguments extends ValidationArguments {
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

@ValidatorConstraint({ name: 'isAdministrator', async: true })
@Injectable()
export class IsAdministrator implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private connection: Connection) {
  }

  public async validate(value: string , args: IsAdministratorValidationArguments) {

    if (value === undefined) return true;

    if (!mongoose.Types.ObjectId.isValid(value)) return false
    

    // no constraints
    if (args.constraints === undefined) {
      return true
    }


    // let [Model, where, checkCallback] = args.constraints;
    let [Model, where] = args.constraints;
  
    if (!where) where = {}
    where = {
        /*mohammad albacha */
      //isActive: true,
      is_administrator: true,
      ...where
    }

    
 const result = await this.connection.models[Model.name].findOne({_id: new mongoose.Types.ObjectId(value), ...where})
 if (!result) return false
      // if (checkCallback && !(await checkCallback(result, this.connection, this.connection))) {
      //   return false
      // }
      return true
    }
  
    public defaultMessage(args: ValidationArguments) {
    // if ((args as any).arrayNotUnique) {
    //   return `All {property}'s elements must be unique`
    // }
    return `user is not administrator`;
    // if (args.constraints === undefined) {
    //   return `invalid ${args.property} id`;
    // } else {
    //   // const [entity] = args.constraints;
    //   // const entity = EntityClass.name || 'Entity';
    //   return `could not find ${args.property} id`;
    // }
    
  }
}



