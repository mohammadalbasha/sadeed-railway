import { BadRequestException } from '@nestjs/common';
import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind } from 'graphql';

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<string, Date> {
  description = 'Date custom scalar type';

  parseValue(value: string): Date {
    console.log(value)
    return new Date(value); // value from the client
  }

  serialize(value: Date): string {
    return new Date(value).toISOString(); // value sent to the client
  }

  parseLiteral(ast: any): Date {
    // if (ast.kind === Kind.INT) {
    if (ast.kind === Kind.STRING) {
      const date = new Date(ast.value)
      if (isNaN(date.getDate())) {
        throw new BadRequestException('Invalid Date')
      }
      return date;
    }
    return null;
  }
}
