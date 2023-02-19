import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { Unique } from 'src/common/validation/unique.validator';
import { User } from '../../user/user.model';
import { Locale } from 'src/common/lang.constants';
import { MatchPassword } from 'src/modules/common/auth/validation/matchPassword.validator';

@InputType()
export class SignupInput {
  @Validate(Unique, [User, 'email'])
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  pass: string;

  @Validate(MatchPassword)
  @Field()
  @IsNotEmpty()
  @MinLength(8)
  confirmPass: string;


  @IsNotEmpty()
  @Field()
  username: string;

  @Field(() => Boolean)
  agree: boolean;

  /* mohammad albacha */
  @Field(() => Locale)
  locale: Locale;

}
