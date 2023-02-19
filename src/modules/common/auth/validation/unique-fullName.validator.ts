import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ValidationArguments, ValidatorConstraintInterface, ValidatorConstraint } from 'class-validator';
import { Connection } from 'mongoose';
import { BaseModel } from '../../../../common/base.model';

interface UniqueFullNameValidationArguments<E> extends ValidationArguments {
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

@ValidatorConstraint({ name: 'uniqueFullname', async: true })
@Injectable()
export class UniqueFullName implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private connection: Connection) {}

  public async validate<E>(value: string, args: UniqueFullNameValidationArguments<E>) {
    const [Model, column, except] = args.constraints;
  
    //@ts-ignore
    // console.log(args.object.admin_isCompanyAccount, args.object.fullName, args.object.admin_dateOfBirth);
    // console.log(args.constraints);
    // console.log(args.object)
    
    let where = {[column]: value};
     //@ts-ignore
    if (!args.object.admin_isCompanyAccount){
       //@ts-ignore
        where = Object.assign(where, {fullName: value, admin_dateOfBirth: args.object.admin_dateOfBirth, admin_isCompanyAccount: false})
    }
    else {
        return true;
    }
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
    return `fullname value already exist`;
  }
}