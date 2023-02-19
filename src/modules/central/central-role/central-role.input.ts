import { Field, Float, ObjectType, InputType, registerEnumType } from '@nestjs/graphql';
import { IsDefined, IsNotEmpty, IsString, Validate } from 'class-validator';
import { BaseInput, BaseOrderInput, BaseUpdateInput } from 'src/common/base.input';
import { AdministratorMaxPermisions } from 'src/modules/central/central-role/validation/maxpermisions.administrator.validator';
//import { Conditions, ConditionsTypes } from 'src/modules/common/authorization/casl/action.enum';
import {GraphQLJSON, GraphQLJSONObject} from 'graphql-type-json';


/* mohammad albacha */
/* I couldn't use the Permesions ObjectTye as a type for some fileds in a InputType decorated class 
    so I had to create an InputType decorated class PermisionsInput */


    
export enum ConditionsTypes {
    MULTI = "multi",
    VALUI = "value",
    ID = "id"
}

registerEnumType(ConditionsTypes, {name: 'ConditionsTypes', description:""});

//@InputType()
export class Conditions {
    [index: string]: {
    type: ConditionsTypes,
    value?: boolean | string[] | string | {$in: string[]} ; 
    }
}

@InputType()
export class PermisionsInput {
    @Field()
    action: string;

    @Field()
    subject: string;

    @Field(type => [String])
    fields?: string[]

    @Field(type => GraphQLJSON )
    conditions?: Conditions

}

@InputType()
export class CreateCentralRoleInput extends BaseInput {
 
    name: string;
    description : string;
    @Validate(AdministratorMaxPermisions)
    @Field((type) => [PermisionsInput])
    permisions : PermisionsInput[]
}

@InputType()
export class UpdateCentralRoleInput extends BaseUpdateInput(CreateCentralRoleInput){}

@InputType()
export class CentralRoleOrderInput extends BaseOrderInput([]) {}

@InputType()
export class AddPermisionInput {

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @Field()
    id: string;

    @Validate(AdministratorMaxPermisions)
    @Field((type) => PermisionsInput)
    permision : PermisionsInput

    
}

