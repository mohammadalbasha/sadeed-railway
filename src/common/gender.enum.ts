import { registerEnumType } from "@nestjs/graphql";

export enum Gender {
    male= "male",
    female= "female"
  }

registerEnumType(Gender, {name: "Gender", description: ""});