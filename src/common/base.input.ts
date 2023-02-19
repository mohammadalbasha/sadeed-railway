import { Type } from '@nestjs/common';
import { Field, InputType } from '@nestjs/graphql';
import { Type as ClassTransformerType } from 'class-transformer';
import { ArrayMinSize, ArrayUnique, IsArray, IsDefined, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { langArray, langObject } from 'src/common/lang.constants'
import { OrderDirection } from './order/order-direction';

@InputType()
export class BaseUpdateInputClass {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Field()
  id: string;
}

export function BaseUpdateInput(CreateInput) {
  @InputType()
  class BaseUpdateInput extends CreateInput {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @Field()
    id: string;
  }
  return BaseUpdateInput;
}

export class BaseOrderInputType {
  field: string;
  direction: OrderDirection;
}

export function BaseOrderInput(isIn: Array<string>) {
  @InputType({ isAbstract: true })
  class BaseOrderInput {
    @IsOptional()
    @IsIn(['createdAt', 'updatedAt', 'isActive', ...isIn])
    @Field()
    field: string;

    @Field(() => OrderDirection)
    direction: OrderDirection;
  }
  return BaseOrderInput
}


export function BaseHasLocaleInput<LocaleInput> (LocaleInput: Type<LocaleInput>) {
  @InputType()
  class BaseHasLocaleInput {
    @Field(() => Boolean, {nullable:true, defaultValue: true})
    isActive: boolean;

    @ClassTransformerType(() => LocaleInput)
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @ArrayUnique((o) => o.locale)
    @Field(() => [LocaleInput], {nullable:true})
    locales?: Array<LocaleInput>;
  }

  return BaseHasLocaleInput;
}

@InputType()
export class BaseLocaleItemInput {
  @IsIn(Object.keys(langObject))
  @IsNotEmpty()
  @Field(() => String, {nullable:false})
  locale: string;
}


@InputType()
export class BaseInput {
  
}

@InputType()
export class BaseFilterInput {
  // query?: string
}
