import { ArgsType, Field } from '@nestjs/graphql';
import { IsDefined, IsIn, IsOptional, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @IsDefined()
  @Min(0)
  @Field({nullable: true})
  skip?: number = 0;

  @IsDefined()
  @IsIn([2, 5, 10, 15, 20, 25])
  @Field({nullable: true})
  limit?: number = 15;

  // @Field({nullable: true})
  // @IsIn([2, 5, 10, 15, 20, 25])
  // first?: number;

  // @Field({nullable: true})
  // after?: string;

  // @Field({nullable: true})
  // before?: string;

  // @Field({nullable: true})
  // last?: number;
}
