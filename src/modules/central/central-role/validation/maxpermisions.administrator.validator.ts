import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ValidationArguments, ValidatorConstraintInterface, ValidatorConstraint } from 'class-validator';
import { Connection } from 'mongoose';
import { checkCentralPermision} from 'src/modules/common/authorization/casl/action.enum';
import { BaseModel } from '../../../../common/base.model';

/* mohammad albacha */
/* I have created this decorator to check maximum permisions in the central dashboard that could be given
    to the administrators */

interface AdministratorMaxPermisionsValidationArguments<E> extends ValidationArguments {
  // constraints: [
  //   ObjectType<E> | EntitySchema<E> | string,
  //   ((validationArguments: ValidationArguments) => FindConditions<E>) | keyof E,
  // ];
  constraints: [
    Array<Object>
  ];
}

@ValidatorConstraint({ name: 'administratorMaxPermisions', async: true })
@Injectable()
export class AdministratorMaxPermisions implements ValidatorConstraintInterface {
  //constructor(@InjectConnection() private connection: Connection) {}

  public async validate<E>(value: string, args: AdministratorMaxPermisionsValidationArguments<E>) {
    
    const permisions = args.value ;
    let check_max_permisions = true;
    if (Array.isArray(permisions))
        permisions?.forEach(permision => {
            check_max_permisions = check_max_permisions && checkCentralPermision(permision.subject, permision);
        });
    else check_max_permisions = check_max_permisions && checkCentralPermision(permisions.subject, permisions);

    return check_max_permisions;
  }


  
  public defaultMessage(args: ValidationArguments) {
    //const [entity] = args.constraints;
    // const entity = EntityClass.name || 'Entity';
    return `you have exceeded max permisions`;
  }
}