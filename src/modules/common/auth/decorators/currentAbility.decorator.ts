import { Ability } from '@casl/ability';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentAbility = createParamDecorator<Ability>(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    /* mohammad albacha*/
    /* here the ability gets from the context, it was added in the GQL_auth_guard*/
    return ctx.getContext().req.ability;
  }
);

