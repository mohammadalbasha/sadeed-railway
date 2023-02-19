import { ObjectType, registerEnumType, HideField, Field, Int } from '@nestjs/graphql';
// import { Shop } from 'src/modules/admin/shop/output/shop.model';
import { BaseModel } from 'src/common/base.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { defaultSchemaOptions } from 'src/common/defaultSchemaOptions.constants';
import { Document } from 'mongoose';
import { PropObject, PropRef } from 'src/common/decorators/PropRef.decorator';
import { Country } from 'src/modules/central/country/country.model';
import PropEnum from 'src/common/decorators/PropEnum.decorator';
import { Locale } from 'src/common/lang.constants';
import { Gender } from 'src/common/gender.enum';
import { CentralRole } from 'src/modules/central/central-role/central-role.model';
import * as mongoose from 'mongoose';
import Paginated from 'src/common/pagination/pagination';
import { AccessibleFieldsDocument } from '@casl/mongoose';

// export enum Role {
//   ADMIN = 'ADMIN',
//   USER = 'USER',
// }

// registerEnumType(Role, {
//   username: 'Role',
//   description: 'User role',
// });


//@Schema(defaultSchemaOptions)
@ObjectType()
export class Company{
  @Prop()
  legalName?: string;

  @Prop()
  businessType?: string;

  @Prop()
  dateOfEstablishment?: Date;

  @Prop()
  phone?: string;

  @PropRef(Country)
  countryId?: string; // if no country id then didn't init
  @PropObject(Country)
  country?: Country; 

  @Prop()
  city?: string;

  @Prop()
  region?: string;
  
  @Prop()
  street?: string;

  @Prop()
  buildingNumber?: number;
  
  @Prop()
  officeNumber?: number;

  @Prop()
  postalCode?: number

  


}

@Schema(defaultSchemaOptions)
@ObjectType()
export class User extends BaseModel {
  // Common Things
  
  /* this !username will cause error if we fetch administrator_updatedBy which is null 
  as Baraa about this
  we may make it mandotary in the dto but optional here */
  @Prop({index: true})
  @Field(() => String, {nullable:false})
  username!: string;

  @Prop({index: true})
  @Field(() => String, {nullable:false})
  email!: string;

  @Prop()
  @HideField()
  pass?: string;

  @Prop({default: ""})
  @HideField()
  isValidPasswordToken?: string;
  
  @Prop({default: false})
  @HideField()
  is_super_admin!: boolean;


  @Prop({default: false})
  deleted!: boolean;
  
  @Prop({default: ""})
  enableOrDisableNote: string;

  @Prop({default: ""})
  @Field(() => String)
  browser: string;

  @Prop()
  emailVerifiedAt?: Date;

  @PropEnum(Locale)
  locale?: Locale;

  @PropEnum(Gender)
  gender?: Gender;

  @Prop()
  timezone?: string;

  @Prop()
  imageId?: string


  @Prop({index: true})
  fullName?: string;

  @Prop()
  phone?: string;

  @PropRef(Country)
  countryId?: string; // if no country id then didn't init

  @PropObject(Country)
  country?: Country; 
  
  @Prop()
  city?: string;

  /* mohammad albacha */
  // isActive, createdAt, updatedAt, id are inherited from BaseModel 


  
  //central
 
  
  // administrator 

  
  @Prop({default: false})
  @HideField()
  is_administrator!: boolean;

  @Prop({default: 0})
  @Field(() => Int)
  administrator_incorrectPasswordTries: number;

  @Prop({default: 0})
  @Field(() => Int)
  administrator_incorrectIpTries: number;

  @Prop({default: ""})
  @HideField()
  administrator_twoFactorsCode: string;

  
  @Prop({default: true})
  @HideField()
  administrator_isVerifiedTwoFactorsCode: boolean;

  @Prop()
  administrator_centralNote?: string;

  @PropRef(User)
  administrator_createdById?: string;
  
  @PropObject(User)
  administrator_createdBy: User;
  
  @PropRef(User)
  administrator_updatedById?: string;
  
  @PropObject(User)
  administrator_updatedBy?: User;

  @PropRef(CentralRole, true)
  administrator_centralRoleId?: string[];
  
  @PropObject(CentralRole, true)
  administrator_centralRole: CentralRole[];

  /* it is better to have these properties as common properties */
 
  @Prop()
  administrator_postalCode?: string;

  @Prop()
  administrator_address?: string;

  
  @Prop()
  administrator_website?: string;

  @Prop()
  administrator_facebookAccount?: string;
  
  @Prop()
  administrator_twitterAccount?: string;
  
  @Prop()
  administrator_linkedinAccount?: string;


  // Customer Things
  @Prop()
  customer_isShallowAccount?: boolean;


  // Admin-Seller-Customer Things

  
  @Prop({default: false})
  @HideField()
  is_admin!: boolean;

  @Prop({default: false})
  admin_isSoftDeleted: boolean
  
  @Prop()
  admin_deleteNote?: string
  
  @Prop({default:""})
  @HideField()
  admin_passwordGenerationToken?: string
  
  @Prop({default: false})
  admin_isVerifiedPasswordGenerationToken?: boolean  
  
  //related to 2FA with google authenticator
  @Prop({ nullable: true })
  @HideField()
  admin_googleTwoFactorAuthenticationSecret: string;


  //related to 2FA with google authenticator
  @Prop({default: false})
  admin_isGoogleTwoFactorAuthenticationEnabled: boolean;
  
  //related to 2FA with google authenticator
  @Prop({default: false})
  admin_isGoogleTwoFactorAuthenticated: boolean;


  @Prop({default: ""})
  admin_emailOtpTwoFactorCode: string;


  @Prop({default: false})
  admin_isEmailOtpTwoFactorAuthenticationEnabled: boolean;

  @Prop({default: true})
  admin_isEmailOtpTwoFactorAuthenticated: boolean;
  
  @Prop({default: false})
  admin_isClosedAccount?: boolean;

  @Prop()
  admin_isSubscribedToNews?: boolean;
  
  @Prop({default: false})
  admin_isCompanyAccount: boolean;

  @Prop({default: false})
  admin_isCompanyOwner: boolean;

  @Prop()
  admin_company?: Company
  /* mohammad albacha edit */
  /* I want to make these properties as common properties but changes make error in other modules*/

  @Prop()
  admin_socialSecurityNumber?: string;

  @Prop()
  admin_dateOfBirth?: Date;

  @Prop()
  admin_postalCode?: string;

  @Prop()
  admin_address?: string;

  @Prop()
  admin_region?: string;
  
  @Prop()
  admin_street?: string;

  @Prop()
  admin_website?: string;

  
  @Prop()
  admin_facebookAccount?: string;
  
  @Prop()
  admin_twitterAccount?: string;
  
  @Prop()
  admin_linkedinAccount?: string;

  @Prop()
  admin_buildingNumber?: number;

  
  @Prop()
  admin_notesByCentral?: string

  

  @Prop()
  admin_central_isVerifiedSellerId?: boolean;

  @Prop()
  admin_central_isVerifiedAddress?: boolean;

  @Prop()
  admin_billingEmail?: string;

  @Prop()
  admin_toBeDeletedAt?: Date;

  // @Field(() => [Shop], {nullable:true})
  // shops?: Array<Shop>;

}

//export type UserDocument = User &   AccessibleFieldsDocument;
export type UserDocument = User & Document
export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.pre('save', function() { console.log('Hello from pre save') });
  UserSchema.post('findOne', async function(result) {
    if (!result)
      return result;
    if (result.is_administrator){
      await result.populate('administrator_centralRoleId');
    }
    if(result.administrator_centralRoleId)
      {result.administrator_centralRole = [...result.administrator_centralRoleId];
      result.administrator_centralRoleId = result.administrator_centralRoleId.map (cr => {
        return cr.id;
      })
      }
  
    return result;
});

@ObjectType()
export class paginatedUser extends Paginated(User) {};