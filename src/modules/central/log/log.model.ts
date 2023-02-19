import { Field, registerEnumType } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import Paginated from 'src/common/pagination/pagination';
import { Float } from '@nestjs/graphql';
import { BaseModelWithLocales, BaseLocaleModel, BaseModel } from 'src/common/base.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from 'src/common/base.schema';
import { defaultLocaleSchemaOptions, defaultSchemaOptions } from 'src/common/defaultSchemaOptions.constants';
import { PropObject, PropRef } from 'src/common/decorators/PropRef.decorator';
import { Currency } from '../currency/currency.model';
import { PaymentMethod } from '../paymentMethod/paymentMethod.model';
import { Plan } from '../plan/plan.model';
import { PayoutMethod } from '../payoutMethod/payoutMethod.model';
import { User } from 'src/modules/common/user/user.model';
import graphqlTypeJson from 'graphql-type-json'
import { Endpoint } from 'src/common/GlobalClass';

export enum LogType {
    query='query', mutation='mutation', unknown='unknown'
}
registerEnumType(LogType, {name: "LogType", description: ""});

@Schema(defaultSchemaOptions)
@ObjectType()
export class Log extends BaseModelWithLocales() {
   
    /* mohammad albacha */
    /* this code must be uncommented */
    // @PropRef(User)
    // user_id?:string


    /* mohammad albacha */
    /* this dummy code writen by me */
    /* this solution for populated fields */
    /* in schema first approach we can define a type for input and a type for returned docuemnts */
    /* here we define the returned graphql documents always as User so we must populate the user */
    /* with mongoose we could either use string or User */
    /*
    https://medium.com/swlh/populate-subdocument-in-graphql-4e7f9ede5a1c
    https://lotfimeziani.dev/blog/001
    */
    // @PropRef(User)
    // // or     @Prop({type: [MongooseSchema.Types.ObjectId], ref: Hobby.name})
    // @Field((type) =>  User  )
    // user_id? :User | string; 


    /* I will be back to the first solution */ 
    /* I will not use population , I will user the Loader */
    @PropRef(User)
    // or     @Prop({type: [MongooseSchema.Types.ObjectId], ref: Hobby.name})
    @Field((type) =>  String  )
    user_id? : string; 





    @Prop({index: true})
    endpoint: Endpoint

    @Prop({index: true})
    hasErrors: boolean

    @Prop({index: true})
    type?: LogType

    @Prop({index: true})
    operationName?: string

    @Prop()
    request?: string

    @Prop()
    response?: string


    @Prop()
    ip?: string
}

export type LogDocument = Log & Document;
export const LogSchema = BaseSchema(Log);

@ObjectType()
export class PaginatedLog extends Paginated(Log) {}
