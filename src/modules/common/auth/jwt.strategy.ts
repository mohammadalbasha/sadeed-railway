import { JwtDto } from './dto/jwt.dto';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

import { ConfigService } from '@nestjs/config';
import { User } from '../user/user.model';
import { CurrentOperation } from './decorators/currentOperation.decorator';
import { parse } from 'graphql';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-two-factor') {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService
      ) {
    /* mohammad albacha */
    /* look to this line , impoooortant */
    /* I must call the super function */
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
      passReqToCallback: true
    });
  }

  /* mohammad albacha */
  /* authentication applied by passportJs */
  /* we validate user using our auth service to access database */
  /*  really I don't know how to this straegy are called*/
  async validate(request: Request, payload: JwtDto): Promise<User> {
    const user = await this.authService.validateUser(payload, extractOperationFromRequest(request));
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

function extractOperationFromRequest(request: Request){

  //@ts-ignore
  return request.body.operationName;
  // console.log(request.body)
  // //@ts-ignore
  // const mutation = parse(request.body.query);
  //   const firstOperationDefinition = (ast) => ast.definitions[0];
  //   // const operation = firstOperationDefinition(mutation).operation;
  //   // console.log(operation)
  //   const firstFieldValueNameFromOperation = (operationDefinition) =>  operationDefinition.selectionSet.selections[0].name.value;
    
  //   const resolver =  firstFieldValueNameFromOperation(mutation);
  //   console.log(resolver);

  }