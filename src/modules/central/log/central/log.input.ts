import { ArrayUnique, IsDefined, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength, Validate } from 'class-validator';
import { InputType, Field, Float, ObjectType } from '@nestjs/graphql';
import { Unique } from 'src/common/validation/unique.validator';
import { BaseFilterInput, BaseHasLocaleInput, BaseInput, BaseLocaleItemInput, BaseOrderInput, BaseUpdateInput } from 'src/common/base.input';
import { BaseOrder } from 'src/common/order/baseOrder';
import { IsRef } from 'src/common/validation/isRef.validator';
import { LogType } from '../log.model';
import { Endpoint } from 'src/common/GlobalClass';
import { DateScalar } from 'src/common/scalars/date.scalar';
import graphqlTypeJson from 'graphql-type-json'


@InputType()
export class DateFilter {
    @Field()
    gte: Date;

    @Field()
    lte: Date;
}


@InputType()
export class LogFilterInput extends BaseFilterInput {
    user_id?: string

    endpoint: Endpoint

    hasErrors?: boolean

    type?: LogType

    operationName?: string

    ip?: string

    
    /* mohammad albacha */
    /* graphqlTypeJson to use Object as type in graphql schema*/ 
    @Field(() => DateFilter )
    dateFilter?: DateFilter;



    /* mohammad albacha */
    /* search about that */
    // @Field((type) => dateFilter)
    // dateFilter?:  dateFilter

}

@InputType()
export class LogOrderInput extends BaseOrderInput(['user', 'endpoint', 'hasErrors', 'type', 'operationName']) {}

