/* mohammad albacha*/

import { Field, InputType } from "@nestjs/graphql";
import { IsDefined, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, Validate } from "class-validator";
import { BaseUpdateInput } from "src/common/base.input";
import { Gender } from "src/common/gender.enum";
import { Locale } from "src/common/lang.constants";
import { DateScalar } from "src/common/scalars/date.scalar";
import { IsAdministrator } from "src/modules/common/auth/validation/isAdministrator.validator";
import { IsRef } from "src/common/validation/isRef.validator";
import { MatchPassword } from "src/modules/common/auth/validation/matchPassword.validator";
import { UniqueCompanyName } from "src/modules/common/auth/validation/unique-companyName.validator";
import { UniqueFullName } from "src/modules/common/auth/validation/unique-fullName.validator";
import { Unique } from "src/common/validation/unique.validator";
import { CentralRole } from "src/modules/central/central-role/central-role.model";
import { Country } from "src/modules/central/country/country.model";
import { UpdateAdministratorInput } from "../../user/central/user.input";
import { User } from "../../user/user.model";
import { UniqueSSN } from "../validation/unique-ssn.valiadtor";
import { UpdateUserInput } from "../../user/common/user.input";
import { Google2FA } from "../validation/google2FA.validator";
import { IsSoftDeletedUser } from "../validation/isSoftDeletedUser.validator";


@InputType()
export class CompanyInput{

  @Field()
  legalName: string;

  @Field()
  businessType: string;

  @Field()
  dateOfEstablishment: Date;

  @Field()
  phone: string;

  @Validate(IsRef, [Country])
  countryId?: string; // if no country id then didn't init

  @Field()
  city?: string;

  @Field()
  region: string;
  
  @Field()
  street: string;

  @Field()
  buildingNumber?: number;
  
  @Field()
  officeNumber?: number;

  @Field()
  postalCode?: number

  


}


@InputType()
export class CreateUserByAdministratorInput {
  
  @IsNotEmpty()
  @Field()
  username: string;

  @Validate(Unique, [User, 'email'])
  @Field()
  @IsEmail()
  email: string;

  @Field(type => Locale)
  locale: Locale;

  @Field(type => Gender)
  gender?: Gender;

//  @Validate(UniqueFullName, [User, 'fullName'])
  @Field()
  fullName: string;

  @Field()
  phone: string;

  @Validate(IsRef, [Country])
  countryId?: string; // if no country id then didn't init

  @Field()
  city?: string;

      
  @Field(() => String)
  imageId?: string;

  /* mohammad albacha */

  @Field()
  admin_isCompanyAccount: boolean

  @Validate(UniqueCompanyName, [User, 'admin_company.legalName'])
  @IsOptional()
  @Field(() => CompanyInput)
  admin_company?: CompanyInput

  @Validate(UniqueSSN, [User, 'admin_socialSecurityNumber'])
  @Field()
  admin_socialSecurityNumber?: string;

  @Field()
  admin_dateOfBirth?: Date;

  @Field()
  admin_postalCode?: number;

  @Field()
  admin_address?: string;

  @Field()
  admin_region: string;

  @Field()
  admin_street: string;

  @Field()
  admin_website?: string;
  
  @Field()
  admin_facebookAccount?: string;
  
  @Field()
  admin_twitterAccount?: string;
  
  @Field()
  admin_linkedinAccount?: string;

  @Field()
  admin_buildingNumber?: number;

  @Field()
  admin_isSubscribedToNews?: boolean;

  @Field()
  admin_notesByCentral?: string


  

}

@InputType()
export class AdminPasswordGenerationTokenInput{
  @Field()
  @IsEmail()
  email: string;

  @Field()
  token: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  pass: string;


  @Validate(MatchPassword)
  @Field()
  @IsNotEmpty()
  @MinLength(8)
  confirmPass: string;


}

@InputType()
export class AdminPasswordResettingTokenInput extends AdminPasswordGenerationTokenInput{}

@InputType()
export class ResetUserPasswordRequestByAdministrator{
  @Validate(IsRef,[User])
  userId: string;

}


@InputType()
export class EnableOrDisableAdminInput {

    @Validate(IsRef, [User])
    userId: string;

    @Field()
    enableOrDisableNote: string;
        
    @Field()
    sendEmail: boolean;

}

@InputType()
export class SoftDeleteAdminInput {
  
  @Validate(IsRef, [User])
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Field()
  id: string;

  @Field()
  deleteNote?: string;
  

}


@InputType()
export class DeleteAdminInput {
  
  @Validate(IsSoftDeletedUser, [User])
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Field()
  id: string;

}


@InputType()
export class RestoreAdminInput {
  
  @Validate(IsRef, [User])
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Field()
  id: string;

}

// @InputType()
// export class UpdateUserByAdministratorInput extends BaseUpdateInput( CreateUserByAdministratorInput) {
@InputType() 
export class UpdateUserByAdministratorInput extends UpdateUserInput {
  @Validate(IsRef, [User])
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Field()
  id: string;   
  
  
  @Field()
  admin_isCompanyAccount?: boolean

  
  @Validate(UniqueCompanyName, [User, 'admin_company.legalName'])
  @IsOptional()
  @Field(() => CompanyInput)
  admin_company?: CompanyInput

  @Validate(UniqueSSN, [User, 'admin_socialSecurityNumber'])
  @IsOptional()
  @Field()
  admin_socialSecurityNumber?: string;

  @Field()
  admin_dateOfBirth?: Date;

  @Field()
  admin_postalCode?: number;

  @Field()
  admin_address?: string;

  @Field()
  admin_region?: string;

  @Field()
  admin_street?: string;

  @Field()
  admin_website?: string;
  
  @Field()
  admin_facebookAccount?: string;
  
  @Field()
  admin_twitterAccount?: string;
  
  @Field()
  admin_linkedinAccount?: string;

  @Field()
  admin_buildingNumber?: number;

  @Field()
  admin_isSubscribedToNews?: boolean;

  @Field()
  admin_notesByCentral?: string


  @Validate(Google2FA)
  @IsOptional()
  @Field()
  admin_isGoogleTwoFactorAuthenticationEnabled?: boolean;
  
  @Field()
  admin_isEmailOtpTwoFactorAuthenticationEnabled?: boolean;

  @Field()
  sendNotificationEmail?: boolean;


  }
  