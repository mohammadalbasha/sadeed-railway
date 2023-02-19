import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/modules/common/user/user.model';

export const CurrentUser = createParamDecorator<User>(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context).getContext();
    // if (ctx.req.isSubscription === true) {
    //   return ctx.req.user
    // }
    /*mohammad albacha*/
    /* here the current user gets from the context, it was added in the GQL_auth_guard*/
    return ctx.req.user;
  }
);

