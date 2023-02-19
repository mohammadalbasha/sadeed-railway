import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, MinLength, Validate } from 'class-validator';
import { Gender } from 'src/common/gender.enum';
import { Locale } from 'src/common/lang.constants';
import { IsRef } from 'src/common/validation/isRef.validator';
import { Unique } from 'src/common/validation/unique.validator';
import { Country } from 'src/modules/central/country/country.model';
import { User } from '../user.model';

@InputType()
export class UpdateUserInput {
  @Field()
  username?: string;

  @Validate(Unique, [User, 'email'])
  @Field()
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field(type => Locale)
//  @IsEnum(Locale)
  locale?: Locale;

  @Field(type => Gender)
  //@IsEnum(Gender)
  gender?: Gender;

  @Field()
  timezone?: string;

  @Field(() => String)
  imageId?: string;

  @Field()
  fullName?: string;

  @Field()
  phone?: string;

  @Validate(IsRef, [Country])
  countryId?: string; // if no country id then didn't init

  @Field()
  city?: string;


}

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsNotEmpty()
  @MinLength(8)
  oldPassword: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;

  
}

@InputType()
export class UserFilter {

  @Validate(IsRef, [User])
  @Field()
  id?: string;

  @Field()
  isActive?: boolean;
  
  @Field()
  deleted?: boolean;

  @IsOptional()
  @IsEmail()
  @Field()
  email?: string;

  @IsOptional()
  @Field()
  username?: string;

  @Field()
  fullName?: string;

  @Field()
  phone?: string;

  @Validate(IsRef, [Country])
  countryId?: string; // if no country id then didn't init

  @Field()
  city?: string;
 
}

