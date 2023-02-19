import { Resolver, Query, Args } from '@nestjs/graphql';
import { Public } from './modules/common/auth/decorators/isPublic.decorator';

@Resolver()
export class AppResolver {
  @Public()
  @Query(() => String)
  helloWorld(): string {
    return 'Hello World!';
  }
  // @Query(() => String)
  // hello(@Args('name') name: string): string {
  //   return `Hello ${name}!`;
  // }
}
