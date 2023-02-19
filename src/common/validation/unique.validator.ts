import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ValidationArguments, ValidatorConstraintInterface, ValidatorConstraint } from 'class-validator';
import { Connection } from 'mongoose';
import { BaseModel } from '../base.model';

interface UniqueValidationArguments<E> extends ValidationArguments {
  // constraints: [
  //   ObjectType<E> | EntitySchema<E> | string,
  //   ((validationArguments: ValidationArguments) => FindConditions<E>) | keyof E,
  // ];
  constraints: [
    typeof BaseModel,
    string,
    string | null
  ];
}

@ValidatorConstraint({ name: 'unique', async: true })
@Injectable()
export class Unique implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private connection: Connection) {}

  public async validate<E>(value: string, args: UniqueValidationArguments<E>) {
    const [Model, column, except] = args.constraints;
  
    let where = {[column]: value};
    if ('id' in args.object) {
      where = Object.assign(where, { _id: { "$ne": args.object['id'] }})
    }
    // // third parameter to the validator
    // // if (except) {
    // //   where = Object.assign(where, { id: { not: args.object[except] } })
    // // }

    const result = await this.connection.models[Model.name].findOne(where)
    // const result = await this.prisma[entity as string].findFirst({where: where});
    return result? false: true;
  }


  
  public defaultMessage(args: ValidationArguments) {
    const [entity] = args.constraints;
    // const entity = EntityClass.name || 'Entity';
    return `${args.property} value already exist`;
  }
}