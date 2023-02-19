import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ValidationArguments, ValidatorConstraintInterface, ValidatorConstraint } from 'class-validator';
import { Connection } from 'mongoose';
import { BaseModel } from '../../../../common/base.model';

interface UniqueCompanyNameValidationArguments<E> extends ValidationArguments {
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

@ValidatorConstraint({ name: 'uniqueCompanyname', async: true })
@Injectable()
export class UniqueCompanyName implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private connection: Connection) {}

  public async validate<E>(value: string, args: UniqueCompanyNameValidationArguments<E>) {
    const [Model, column, except] = args.constraints;
       let where = {};
     //@ts-ignore
     if(args.object.admin_company){
        //@ts-ignore
        where = Object.assign(where, {[column]: args.object.admin_company.legalName,'admin_company.countryId': args.object.admin_company.countryId})
          
     }
     else {
      return true
     }
    
        const result = await this.connection.models[Model.name].findOne(where)
        // const result = await this.prisma[entity as string].findFirst({where: where});
    return result? false: true;
  }


  
  public defaultMessage(args: ValidationArguments) {
    const [entity] = args.constraints;
    // const entity = EntityClass.name || 'Entity';
    return `company legal name value already exist`;
  }
}