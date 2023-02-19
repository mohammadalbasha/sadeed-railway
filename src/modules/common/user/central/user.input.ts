import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, MinLength, Validate } from 'class-validator';
import { Gender } from 'src/common/gender.enum';
import { Locale } from 'src/common/lang.constants';
import { DateScalar } from 'src/common/scalars/date.scalar';
import { IsRef } from 'src/common/validation/isRef.validator';
import { Unique } from 'src/common/validation/unique.validator';
import { Country } from 'src/modules/central/country/country.model';
import { UpdateUserInput, UserFilter } from '../common/user.input';
import { User } from '../user.model';


@InputType()
export class UpdateAdministratorInput extends UpdateUserInput {
  
  @Field()
  administrator_centralNote?: string;

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
export class UpdateSuperAdminInput extends UpdateUserInput {

}

@InputType()
export class AdministratorFilter extends UserFilter {

  @IsOptional()
  @Field(() => [String])
  administrator_centralRoleId?: string[];

  
}


@InputType()
export class CompanyFilter{
  @Field()
  legalName?: string;

  @Field()
  businessType?: string;

  @Field()
  dateOfEstablishment?: Date;

  @Field()
  phone?: string;

  @Validate(IsRef, [Country])
  countryId?: string; // if no country id then didn't init

  @Field()
  city?: string;

  @Field()
  region?: string;
  
  @Field()
  street?: string;

  @Field()
  buildingNumber?: number;
  
  @Field()
  officeNumber?: number;

  @Field()
  postalCode?: number



}



@InputType()
export class AdminFilter extends UserFilter {


  @Field()
  admin_isSoftDeleted?: boolean;
  @Field()
  admin_dateOfBirth?: Date;
  
  @Field()
  admin_isClosedAccount?: boolean;

  @Field()
  admin_isSubscribedToNews?: boolean;
  
  @Field()
  admin_isCompanyAccount?: boolean;


  @Field()
  admin_company?: CompanyFilter
  
  @Field()
  admin_isGoogleTwoFactorAuthenticationEnabled?: boolean;

  @Field()
  admin_socialSecurityNumber?: string;

  @Field()
  admin_postalCode?: string;

  @Field()
  admin_address?: string;

  @Field()
  admin_region?: string;
  
  @Field()
  admin_street?: string;
}

