import { applyDecorators, ForbiddenException } from "@nestjs/common";
import { ArrayUnique, IsOptional, Validate } from "class-validator";
import { BaseModel } from "../base.model";
import { IsRef } from "../validation/isRef.validator";



export function ValidateRef(Model, isArray=false) {
  if (isArray) {
    return applyDecorators(
      IsOptional(),
      ArrayUnique(),
      Validate(IsRef, Model)
    )
  } else {
    return applyDecorators(
      IsOptional(),
      Validate(IsRef, Model)
    )
  }
  
}


