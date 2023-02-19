import { Injectable, ExecutionContext, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/modules/common/auth/decorators/isPublic.decorator';
import { IS_NOT_GRAPHQL } from '../decorators/isNotGraphQL.decorator';
// import { PrismaService } from 'nestjs-prisma';
import { CaslAbilityFactory } from '../../authorization/casl/casl-ability.factory';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { IS_SUBSCRIPTION } from '../decorators/isSubscription.decorator';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt-two-factor') {
  constructor(
    private reflector: Reflector,
    // private prisma: PrismaService,
    @InjectConnection() private connection: Connection,
    private caslAbilityFactory: CaslAbilityFactory,
    // , private tenantService:TenantService
    ) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }


  // get user even if it's a public link
  handleRequest(err, user, info, context:ExecutionContext) {

    /*mohammad albacha*/

    if (user && user.deleted){
      throw new NotFoundException(`Sorry, your account has been deleted `);
    }
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    /*mohammad albacha*/
    /*here we can access the current user and add it to the context */
    const isNotGraphQL = this.reflector.getAllAndOverride<boolean>(IS_NOT_GRAPHQL, [
      context.getHandler(),
      context.getClass(),
    ]);


    let req;
    if (isNotGraphQL) {
      req = context.switchToHttp().getRequest();
    } else {
      req = GqlExecutionContext.create(context).getContext().req;
    }

    req.connection = this.connection
    if (user) {
      // add ability to the context

      /* mohammad albacha, here the ability created and addede added to the request*/
      req.ability = this.caslAbilityFactory.createForUser(user);
      return user;
    } else {
      req.ability = this.caslAbilityFactory.createForGuest();
      if (isPublic) return null; // the user return
      throw new UnauthorizedException();
    }
    
  }

  canActivate(context: ExecutionContext) {
    // const isNotGraphQL = this.reflector.getAllAndOverride<boolean>(IS_NOT_GRAPHQL, [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);
    // if (isNotGraphQL) {
    //   return true; // the outcome is allowed
    // }

    const isSubscription = this.reflector.getAllAndOverride<boolean>(IS_SUBSCRIPTION, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isSubscription) {
      return true; // the outcome is allowed
    }
    
    return super.canActivate(context);
  }

  
  // canActivate(context: ExecutionContext) {
  //   const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
  //     context.getHandler(),
  //     context.getClass(),
  //   ]);
  //   if (isPublic) {
  //     return true;
  //   }
  //   return super.canActivate(context);
  // }
}
