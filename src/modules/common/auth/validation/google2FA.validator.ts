import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ValidationArguments, ValidatorConstraintInterface, ValidatorConstraint } from 'class-validator';
import { Connection } from 'mongoose';
import { BaseModel } from '../../../../common/base.model';

interface Google2FAdValidationArguments<E> extends ValidationArguments {
  // constraints: [
  //   ObjectType<E> | EntitySchema<E> | string,
  //   ((validationArguments: ValidationArguments) => FindConditions<E>) | keyof E,
  // ];
  
}

@ValidatorConstraint({ name: 'google2FA', async: true })
@Injectable()
export class Google2FA implements ValidatorConstraintInterface {

  public async validate<E>(value: boolean, args: Google2FAdValidationArguments<E>) {
    
    // @ts-ignore
    return value == false;
  
}
  
  public defaultMessage(args: ValidationArguments) {
    return `administrator can't set user's google 2fa`;
  }
}