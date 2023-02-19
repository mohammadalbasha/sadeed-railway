import { Field, InputType } from "@nestjs/graphql";
import { IsDate, IsNotEmpty, Validate } from "class-validator";
import { IsRef } from "src/common/validation/isRef.validator";
import { Unique } from "src/common/validation/unique.validator";
import { Country } from "src/modules/central/country/country.model";
import { Currency } from "src/modules/central/currency/currency.model";
import { Speciality } from "src/modules/central/speciality/speciality.model";
import { Shop } from "../../shop/shop.model";

@InputType()
export class ShopUserUpdateInput {
    admin_isSubscribedToNews?: boolean;
  
    fullName?: string;
  
    admin_ssn?: string;
  
    admin_dob?: Date;
  
    phone?: string;
  
    city?: string;
  
    admin_zip?: string;
  
    admin_address?: string;
  
    // central things
    // admin_central_isVerifiedSellerId?: boolean;
    // admin_central_isVerifiedAddress?: boolean;
  
    admin_billingEmail?: string;
}

@InputType()
export class ShopUserInitInput {
    @Validate(IsRef, [Country])
    country!: string;

    isSubscribedToNews: boolean;

    // shop things
    @Validate(Unique, [Shop, 'slug'])
    slug!: string;

    @Validate(IsRef, [Speciality])
    speciality!: string;

    @Validate(IsRef, [Currency])
    currency!: string;
}