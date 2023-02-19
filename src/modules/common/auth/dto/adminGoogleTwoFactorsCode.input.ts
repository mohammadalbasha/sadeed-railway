import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class AdminGoogleTwoFactorsCode {

    @Field()
    twoFactorsGoogleAuthenticationCode: string
}