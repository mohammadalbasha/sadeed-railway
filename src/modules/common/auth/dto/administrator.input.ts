/* mohammad albacha*/

import { Field, InputType } from "@nestjs/graphql";
import { IsDefined, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, Validate } from "class-validator";
import { Gender } from "src/common/gender.enum";
import { Locale } from "src/common/lang.constants";
import { Deletable } from "src/common/validation/deleteable.validator";
import { IsRef } from "src/common/validation/isRef.validator";
import { Unique } from "src/common/validation/unique.validator";
import { CentralRole } from "src/modules/central/central-role/central-role.model";
import { Country } from "src/modules/central/country/country.model";
import { Log } from "src/modules/central/log/log.model";
import { UpdateAdministratorInput } from "../../user/central/user.input";
import { User } from "../../user/user.model";
import { IsAdministrator } from "../validation/isAdministrator.validator";
import { MatchPassword } from "../validation/matchPassword.validator";

@InputType()
export class CreateAdministratorBySuperAdminInput {
  
  @IsNotEmpty()
  @Field()
  username: string;


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

  @Field(type => Locale)
//  @IsEnum(Locale)
  locale: Locale;

  @Field(type => Gender)
  //@IsEnum(Gender)
  gender?: Gender;


  @Field()
  timezone?: string;

  
  @Field()
  fullName?: string;

  @Field()
  phone?: string;

  @Validate(IsRef, [Country])
  countryId?: string; // if no country id then didn't init

  @Field()
  city?: string;



  /* mohammad albacha */
  @Validate(IsRef,[CentralRole])
  administrator_centralRoleId?: string[]
  @Field()
  administrator_postalCode?: string;

  @Field()
  administrator_address?: string;

  @Field()
  administrator_website?: string;

  @Field()
  administrator_facebookAccount?: string;
  
  @Field()
  administrator_twitterAccount?: string;
  
  @Field()
  administrator_linkedinAccount?: string;

}

@InputType()
export class GrantAdministratorCentralRoleInput {

    @Validate(IsAdministrator, [User])
    userId: string;

    @Validate(IsRef, [CentralRole])
    administrator_centralRoleId: string[]


  }

@InputType()
export class EnableOrDisableAdministratorInput {

    @Validate(IsAdministrator, [User])
    userId: string;

    @Field()
    enableOrDisableNote?: string;


}

@InputType()
export class UpdateAdministratorBySuperAdminInput extends UpdateAdministratorInput{
  
  @Validate(IsAdministrator, [User])
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Field()
  id: string;
  
  @Field()
  @MinLength(8)
  @IsOptional()
  pass?: string;

  
  @Field()
  @Validate(MatchPassword)
  @IsOptional()
  confirmPass?: string;


}


@InputType()
export class ReActivateAdministratorInput extends UpdateAdministratorInput{
  
  @Validate(IsAdministrator, [User])
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Field()
  id: string;
  
  
}


@InputType()
export class DeleteAdministratorInput {
  
  @Validate(Deletable, [{model: Log, name: 'user_id'}])
  @Validate(IsAdministrator, [User])
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Field()
  id: string;
  

}