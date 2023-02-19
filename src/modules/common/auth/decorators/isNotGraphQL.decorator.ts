
import { SetMetadata } from '@nestjs/common';

export const IS_NOT_GRAPHQL = 'isNotGraphQL';
export const IsNotGraphQL = () => SetMetadata(IS_NOT_GRAPHQL, true);
