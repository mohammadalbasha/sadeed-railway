import { createParamDecorator, ExecutionContext, Type } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { BaseModel } from '../base.model';

export const Loader = createParamDecorator(
  (Model: Type<BaseModel>, context: ExecutionContext):  DataLoader<string, typeof Model> => {
    const ctx = GqlExecutionContext.create(context).getContext();
    const loader = ctx.loader.getLoader(Model, ctx.req.connection, ctx.req.ability)
    return {
      load: (key) => {
        if (!key) return null
        return loader.load(key)
      },
      loadMany: (key) => {
        if (!key) return null
        return loader.loadMany(key)
      },
    } as any
  }
);

