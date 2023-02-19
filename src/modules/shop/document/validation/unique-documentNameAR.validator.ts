import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ValidationArguments, ValidatorConstraintInterface, ValidatorConstraint } from 'class-validator';
import { Connection } from 'mongoose';
import { BaseModel } from '../../../../common/base.model';

interface UniqueDocumentNameValidationArguments<E> extends ValidationArguments {
  // constraints: [
  //   ObjectType<E> | EntitySchema<E> | string,
  //   ((validationArguments: ValidationArguments) => FindConditions<E>) | keyof E,
  // ];
  constraints: [
    typeof BaseModel,
    string
  ];
}

@ValidatorConstraint({ name: 'uniqueDocumentName', async: true })
@Injectable()
export class UniqueDocumentName implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private connection: Connection) {}

  public async validate<E>(value: string, args: UniqueDocumentNameValidationArguments<E>) {
    const [Model, column] = args.constraints;
       let where = {};
    
       //@ts-ignore
       where = Object.assign(where, {[column]: value,'countryId': args.object.countryId})

        const result = await this.connection.models[Model.name].findOne(where)
        // const result = await this.prisma[entity as string].findFirst({where: where});
    return result? false: true;
  }


  
  public defaultMessage(args: ValidationArguments) {
    return `document already exist in this country`;
  }
}