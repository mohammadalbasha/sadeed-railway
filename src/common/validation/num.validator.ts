import { applyDecorators } from "@nestjs/common"
import { ArrayUnique, IsOptional, Max, Min, registerDecorator, Validate } from "class-validator"
import { IsRef } from "./isRef.validator"

export function NumberValidate(min = 0, max= 1000000000) {
  return applyDecorators(
    IsOptional(),
    Min(min),
    Max(max),
  )

  // return function (object: Object, propertyName: string) {
  //   registerDecorator({
  //     // name: 'isRef',
  //     target: object.constructor,
  //     propertyName: propertyName,
  //     // options: validationOptions,
  //     // constraints: [constraints],
  //     validator: Min(0),
  //   });
  //   // return applyDecorators(
  //   //   Min(0),
  //   // )
  // }
  
}