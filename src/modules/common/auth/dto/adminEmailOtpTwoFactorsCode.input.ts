import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class AdminEmailOtpTwoFactorsCode {

    @Field()
    twoFactorsEmailOtpAuthenticationCode: string
}