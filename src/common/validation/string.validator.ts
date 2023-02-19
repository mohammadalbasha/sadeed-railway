import { applyDecorators } from "@nestjs/common"
import { ArrayUnique, IsOptional, MaxLength, Min, Validate } from "class-validator"
import { IsRef } from "./isRef.validator"

export function StringValidate(maxLength = 1000) {
  return applyDecorators(
    IsOptional(),
    MaxLength(maxLength),
  )
}