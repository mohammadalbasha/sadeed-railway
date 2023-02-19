import { ArrayUnique, IsIn, IsNotEmpty, IsOptional, IsString, Min, MinLength, Validate } from 'class-validator';
import { InputType, Field, OmitType } from '@nestjs/graphql';
import { Unique } from 'src/common/validation/unique.validator';
import { BaseOrder } from 'src/common/order/baseOrder';
import { UserDocumentType } from '../documentType.model';
import { BaseHasLocaleInput, BaseLocaleItemInput, BaseOrderInput, BaseUpdateInput } from 'src/common/base.input';
import { IsRef, IsRef2 } from 'src/common/validation/isRef.validator';
import { Currency } from 'src/modules/central/currency/currency.model';
import { Speciality } from 'src/modules/central/speciality/speciality.model';
import { Locale } from 'src/common/lang.constants';
import { PaymentMethod } from 'src/modules/central/paymentMethod/paymentMethod.model';
import { BusinessType } from 'src/modules/central/businessType/businessType.model';
import { NumberValidate } from 'src/common/validation/num.validator';
import { Country } from 'src/modules/central/country/country.model';
import { UniqueDocumentName } from '../validation/unique-documentNameAR.validator';

@InputType()
export class UserDocumentTypeLocaleInput extends BaseLocaleItemInput {
   // subject!: string;

   // desc?: string;
}

@InputType()
export class CreateUserDocumentTypeInput extends BaseHasLocaleInput(UserDocumentTypeLocaleInput) {
   
   @IsRef2(Country)
   @Field()
    countryId?: string;
  
    @Validate(UniqueDocumentName, [UserDocumentType, 'nameEN'])
    @Field()
    nameEN!: string;

    @Validate(UniqueDocumentName, [UserDocumentType, 'nameAR'])
    @Field()
    nameAR!: string;
    
    @Field()
    descriptionAR!: string;
    
    @Field()
    descriptionEN!: string;

    @Field()
    centralNote?: string;
}

@InputType()
export class UpdateUserDocumentTypeInput extends BaseUpdateInput(OmitType(CreateUserDocumentTypeInput, [] as const)) {

}

@InputType()
export class UserDocumentTypeOrderInput extends BaseOrderInput([]) {}
