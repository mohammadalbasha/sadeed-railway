import { ArrayUnique, IsDefined, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength, Validate } from 'class-validator';
import { InputType, Field  } from '@nestjs/graphql';
import { BaseFilterInput, BaseHasLocaleInput, BaseInput, BaseLocaleItemInput, BaseOrderInput, BaseUpdateInput } from 'src/common/base.input';


@InputType()
export class IpFilterInput extends BaseFilterInput {
}

@InputType()
export class IpOrderInput extends BaseOrderInput([]) {}

@InputType()
export class CreateIpInput extends BaseInput{
    @Field(() => String)
    ip: string;
}


@InputType()
export class UpdateIpInput extends BaseUpdateInput(CreateIpInput){}

