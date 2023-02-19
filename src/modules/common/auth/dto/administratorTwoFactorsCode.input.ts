import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { Unique } from 'src/common/validation/unique.validator';
import { User } from '../../user/user.model';
import { Locale } from 'src/common/lang.constants';

@InputType()
export class AdministratorTwoFactorsInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  code: string
}

@InputType()
export class ReSendAdministratorTwoFactorCodeInput{
  email: string ;
}