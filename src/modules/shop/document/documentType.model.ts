import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from '../../common/user/user.model';
import { BaseLocaleModel, BaseModel, BaseModelWithLocales } from '../../../common/base.model';
import Paginated from 'src/common/pagination/pagination';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { defaultLocaleSchemaOptions, defaultSchemaOptions } from 'src/common/defaultSchemaOptions.constants';
import { BaseSchema } from 'src/common/base.schema';
import { PropObject, PropRef } from 'src/common/decorators/PropRef.decorator';
import { Currency } from 'src/modules/central/currency/currency.model';
import { Speciality } from 'src/modules/central/speciality/speciality.model';
import PropEnum from 'src/common/decorators/PropEnum.decorator';
import { Locale } from 'src/common/lang.constants';
import { PaymentMethod } from 'src/modules/central/paymentMethod/paymentMethod.model';
import { BusinessType } from 'src/modules/central/businessType/businessType.model';
import { Country } from 'src/modules/central/country/country.model';

@Schema(defaultLocaleSchemaOptions)
@ObjectType()
export class UserDocumentType_Locale extends BaseLocaleModel {
    @Prop()
    subject!: string;

    @Prop()
    desc?: string;
}

@Schema(defaultSchemaOptions)
@ObjectType()
export class UserDocumentType extends BaseModelWithLocales(UserDocumentType_Locale) {

    @PropRef(Country)
    countryId?: string;
    @PropObject(Country)
    country?: Country;

    @Prop()
    nameEN!: string;

    @Prop()
    nameAR!: string;
    
    @Prop()
    descriptionAR!: string;
    
    @Prop()
    descriptionEN!: string;

    @Prop()
    centralNote: string;
}

export type UserDocumentTypeDocument =UserDocumentType & Document;
export const UserDocumentTypeSchema = BaseSchema(UserDocumentType);


@ObjectType()
export class PaginatedUserDocumentType extends Paginated(UserDocumentType) {}