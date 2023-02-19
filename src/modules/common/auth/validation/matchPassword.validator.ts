import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ValidationArguments, ValidatorConstraintInterface, ValidatorConstraint } from 'class-validator';
import { Connection } from 'mongoose';
import { BaseModel } from '../../../../common/base.model';

interface MatchPasswordValidationArguments<E> extends ValidationArguments {
  // constraints: [
  //   ObjectType<E> | EntitySchema<E> | string,
  //   ((validationArguments: ValidationArguments) => FindConditions<E>) | keyof E,
  // ];
  
}

@ValidatorConstraint({ name: 'matchPassword', async: true })
@Injectable()
export class MatchPassword implements ValidatorConstraintInterface {

  public async validate<E>(value: string, args: MatchPasswordValidationArguments<E>) {
    // @ts-ignore
    return value == args.object.pass;
  
}
  
  public defaultMessage(args: ValidationArguments) {
    return `passwords must match`;
  }
}