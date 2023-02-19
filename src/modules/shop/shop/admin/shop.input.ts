import { ArrayUnique, IsIn, IsNotEmpty, IsOptional, IsString, Min, MinLength, Validate } from 'class-validator';
import { InputType, Field, OmitType } from '@nestjs/graphql';
import { Unique } from 'src/common/validation/unique.validator';
import { BaseOrder } from 'src/common/order/baseOrder';
import { PeriodUnit, Shop } from '../shop.model';
import { BaseHasLocaleInput, BaseLocaleItemInput, BaseOrderInput, BaseUpdateInput } from 'src/common/base.input';
import { IsRef, IsRef2 } from 'src/common/validation/isRef.validator';
import { Currency } from 'src/modules/central/currency/currency.model';
import { Speciality } from 'src/modules/central/speciality/speciality.model';
import { Locale } from 'src/common/lang.constants';
import { PaymentMethod } from 'src/modules/central/paymentMethod/paymentMethod.model';
import { BusinessType } from 'src/modules/central/businessType/businessType.model';
import { NumberValidate } from 'src/common/validation/num.validator';

@InputType()
export class ShopLocaleInput extends BaseLocaleItemInput {
    @MinLength(2)
    name!: string;

    desc?: string;

    subscribeTitle?: string;

    subscribeDesc?: string;
}

@InputType()
export class CreateShopInput extends BaseHasLocaleInput(ShopLocaleInput) {
  @Validate(Unique, [Shop, 'slug'])
  slug!: string;

  // @Validate(IsRef, [Speciality])
  @IsRef2(Speciality)
  speciality_id!: string;

  // @Validate(IsRef, [Currency])
  // @Validate(IsRef, [Currency])
  @IsRef2(Currency)
  currency_id!: string;
  
  @Validate(Unique, [Shop, 'host'])
  host?: string;

  defaultLocale?: Locale;
  viewLocales?: Locale[];

  @IsOptional()
  @ArrayUnique()
  // @Validate(IsRef, [Currency])
  @IsRef2(Currency)
  viewCurrencies_id?: string[];

  showDefaultCurrencyByVisitorCountry?: boolean;

  // todo
  @IsOptional()
  @ArrayUnique()
  @IsRef2(PaymentMethod)
  paymentMethods_id?: string[]

  showInCentral?: boolean;

  keepProductStockAndInventory?: boolean;

  @NumberValidate()
  expectedMonthlyTransactionVolume?: number;

  contactEmail?: string;
  contactPhone?: string;

  supportEmail?: string;
  supportPhone?: string;

  primaryColor?: string;
  secondaryColor?: string;

  isAgreementMandetoryBeforeSignup?: boolean;
  isAgreementMandetoryBeforeDownload?: boolean;

  
  // Business
  business_isBusiness?: boolean;
  // todo
  @IsRef2(BusinessType)
  business_businessType_id?: string;
  business_representativeOfBusiness?: boolean;
  business_legalName?: string;
  business_dateOfEstablishment?: Date;
  business_phone?: string;
  business_city?: string;
  business_zip?: string;
  business_address?: string;



  // Central
  // central_maxSubUsers?: number;
  // central_isVerifiedBusiness?: boolean;
  // central_isVerifiedBusinessAddress?: boolean;


  // Default Product Settings
  product_showRating?: boolean;
  product_showVisits?: boolean;
  product_showSales?: boolean;
  product_showStock?: boolean;
  product_showInCentral?: boolean;
  product_canOrderMany?: boolean;

  product_doesSubscriperLoseAccessAfterCanceling?: boolean;
  @NumberValidate()
  product_autoCancelSubscriptionAfterPeriod?: number;
  product_autoCancelSubscriptionAfterPeriodUnit?: PeriodUnit;


  product_maxDownloadAttempts?: number;
  product_downloadExpiryPeriod?: number;
  product_downloadExpiryPeriodUnit?: PeriodUnit;

  product_purchaseMessage?: string;
  product_puchaseRedirectUrl?: string;
  
}

@InputType()
export class UpdateShopInput extends BaseUpdateInput(OmitType(CreateShopInput, ['currency_id'] as const)) {
// export class UpdateShopInput extends BaseUpdateInput(OmitType(CreateShopInput, [] as const)) {
  
  @Validate(Unique, [Shop, 'slug'])
  slug?: string;

  @IsRef2(Speciality)
  speciality_id?: string;

  @IsRef2(Currency)
  currency_id?: string;
}

@InputType()
export class ShopOrderInput extends BaseOrderInput(['host', 'slug']) {}
