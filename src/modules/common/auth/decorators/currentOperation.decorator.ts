import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { parse } from 'graphql';

export const CurrentOperation = createParamDecorator<String>(
  (data: unknown, context: ExecutionContext) => {
    console.log("kaka");

    const ctx = GqlExecutionContext.create(context);

    const request = ctx.getContext().req;
    const mutation = parse(request.body.query);
    
    const firstOperationDefinition = (ast) => ast.definitions[0];
    const firstFieldValueNameFromOperation = (operationDefinition) =>  operationDefinition.selectionSet.selections[0].name.value;

    return firstFieldValueNameFromOperation
  
}
);

