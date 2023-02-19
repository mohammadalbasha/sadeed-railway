import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/user.model';
import { Token } from './token.model';
import graphqlTypeJson from 'graphql-type-json'

@ObjectType()
export class Auth extends Token {
  @Field(() => User)
  user: User;

  @Field(() => graphqlTypeJson, { nullable: true })
  ability?: object
}
