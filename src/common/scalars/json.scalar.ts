import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind } from 'graphql';

@Scalar('JSON', () => Date)
export class JSONScalar implements CustomScalar<string, JSON> {
  description = 'JSON custom scalar type';

  parseValue(value: string): JSON {
    return JSON.parse(value); // value from the client
  }

  serialize(value: JSON): string {
    return JSON.stringify(value); // value sent to the client
  }

  parseLiteral(ast: any): JSON {
    if (ast.kind === Kind.OBJECT) {
      return JSON.parse(ast.value);
    }
    return null;
  }
}
