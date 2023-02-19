import { InputType } from "@nestjs/graphql";
import { BaseFilterInput, BaseOrderInput } from "src/common/base.input";

// @InputType()
// export class MediaFileFilterInput extends BaseFilterInput {
//   name?: string
// }

@InputType()
export class MediaFileOrderInput extends BaseOrderInput([]) {}