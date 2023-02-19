import { Field, InputType } from '@nestjs/graphql';
import { OrderDirection } from './order-direction';


@InputType({ isAbstract: true })
export abstract class BaseOrder {
  @Field(() => OrderDirection)
  direction: OrderDirection;
}
