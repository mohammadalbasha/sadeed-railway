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

interface DeletableValidationArguments extends ValidationArguments {
  // constraints: [
  //   ObjectType<E> | EntitySchema<E> | string,
  //   ((validationArguments: ValidationArguments) => FindConditions<E>) | keyof E,
  // ];
  constraints: 
    {
       model:  typeof BaseModel,
       fieldName:  string
    }  [];         
    // ((object: E, user: Connection, connection: Connection) => Promise<boolean>) | null
}

@ValidatorConstraint({ name: 'deletable', async: true })
@Injectable()
export class Deletable implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private connection: Connection) {}

  public async validate(value: string , args: DeletableValidationArguments) {
    for (let i = 0 ; i< args.constraints.length ; i++){
        let {model, fieldName } = args.constraints[i];
            const result = await this.connection.models[model.name].findOne({[`${name}`]: new mongoose.Types.ObjectId(value)})
            if (result)
            return false;
    }
    
    
    return true;

    
}

  public defaultMessage(args: ValidationArguments) {
    return `can not delete document which is related with other documents`;
    
  }
}



