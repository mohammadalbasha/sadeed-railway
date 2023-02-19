import { IsEmail, isNotEmpty, IsNotEmpty, MinLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  pass: string;

  @Field(() => Boolean)
  remember: Boolean;
}

export class LoginData {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  pass: string;

  @IsNotEmpty()
  ip: string;
  
  
  @IsNotEmpty()
  browser: string;
  
  
}
