import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
const IP = require('ip');

export const UserIp = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    return IP.address();
},
);

