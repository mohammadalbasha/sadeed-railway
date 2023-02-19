import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from '../../common/user/user.model';
import { BaseLocaleModel, BaseModel, BaseModelWithLocales } from '../../../common/base.model';
import Paginated from 'src/common/pagination/pagination';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { defaultLocaleSchemaOptions, defaultSchemaOptions } from 'src/common/defaultSchemaOptions.constants';
import { BaseSchema } from 'src/common/base.schema';
import { PropRef } from 'src/common/decorators/PropRef.decorator';
import { Currency } from 'src/modules/central/currency/currency.model';
import { Speciality } from 'src/modules/central/speciality/speciality.model';
import PropEnum from 'src/common/decorators/PropEnum.decorator';
import { Locale } from 'src/common/lang.constants';
import { PaymentMethod } from 'src/modules/central/paymentMethod/paymentMethod.model';
import { BusinessType } from 'src/modules/central/businessType/businessType.model';

export enum PeriodUnit {
  h='h', d='d', w='w', m='m', y='y'
}

registerEnumType(PeriodUnit, {name: "PeriodUnit", description: ""})

@Schema(defaultLocaleSchemaOptions)
@ObjectType()
export class Shop_Locale extends BaseLocaleModel {
    @Prop()
    name!: string;

    @Prop()
    desc?: string;

    @Prop()
    subscribeTitle?: string;

    @Prop()
    subscribeDesc?: string;
}

@Schema(defaultSchemaOptions)
@ObjectType()
export class Shop extends BaseModelWithLocales(Shop_Locale) {

  // Unique Properties
  @Prop()
  slug?: string;
  @Prop()
  host?: string;

  // Mandetory Properties
  @Prop()
  owner_id: string;

  @PropRef(Currency)
  currency_id: string;

  @PropRef(Speciality)
  speciality_id: string;

  // Settings
  @PropEnum(Locale)
  defaultLocale?: Locale;

  @Prop({index: true}) // todo: array of enums
  viewLocales?: Locale[];

  @PropRef(Currency, true)
  viewCurrencies_id?: string[];

  @Prop({default: true})
  showDefaultCurrencyByVisitorCountry?: boolean;

  @PropRef(PaymentMethod, true)
  paymentMethods_id?: string[]

  @Prop()
  showInCentral?: boolean;

  @Prop()
  keepProductStockAndInventory?: boolean;

  @Prop()
  expectedMonthlyTransactionVolume?: number;

  @Prop()
  contactEmail?: string;
  @Prop()
  contactPhone?: string;

  @Prop()
  supportEmail?: string;
  @Prop()
  supportPhone?: string;

  @Prop()
  primaryColor?: string;
  @Prop()
  secondaryColor?: string;

  @Prop()
  isAgreementMandetoryBeforeSignup?: boolean;
  @Prop()
  isAgreementMandetoryBeforeDownload?: boolean;

  
  // Business
  @Prop()
  business_isBusiness?: boolean;
  @PropRef(BusinessType)
  business_businessType_id?: string;
  @Prop()
  business_representativeOfBusiness?: boolean;
  @Prop()
  business_legalName?: string;
  @Prop()
  business_dateOfEstablishment?: Date;
  @Prop()
  business_phone?: string;
  @Prop()
  business_city?: string;
  @Prop()
  business_zip?: string;
  @Prop()
  business_address?: string;



  // Central
  @Prop({default: 5})
  central_maxSubUsers?: number;
  @Prop({default: false})
  central_isVerifiedBusiness?: boolean;
  @Prop({default: false})
  central_isVerifiedBusinessAddress?: boolean;


  // Default Product Settings
  @Prop({default: true})
  product_showRating?: boolean;
  @Prop({default: true})
  product_showVisits?: boolean;
  @Prop({default: true})
  product_showSales?: boolean;
  @Prop({default: true})
  product_showStock?: boolean;
  @Prop({default: true})
  product_showInCentral?: boolean;
  @Prop({default: true})
  product_canOrderMany?: boolean;

  @Prop({default: true})
  product_doesSubscriperLoseAccessAfterCanceling?: boolean;
  @Prop({default: 0})
  product_autoCancelSubscriptionAfterPeriod?: number;
  @PropEnum(PeriodUnit)
  product_autoCancelSubscriptionAfterPeriodUnit?: PeriodUnit;


  @Prop({default: 100})
  product_maxDownloadAttempts?: number;
  @Prop({default: 0})
  product_downloadExpiryPeriod?: number;
  @PropEnum(PeriodUnit)
  product_downloadExpiryPeriodUnit?: PeriodUnit;

  @Prop()
  product_purchaseMessage?: string;
  @Prop()
  product_puchaseRedirectUrl?: string;

  // Files

  

}

export type ShopDocument = Shop & Document;
export const ShopSchema = BaseSchema(Shop);


@ObjectType()
export class PaginatedShop extends Paginated(Shop) {}