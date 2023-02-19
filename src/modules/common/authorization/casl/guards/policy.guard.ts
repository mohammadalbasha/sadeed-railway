import { Injectable, CanActivate, ExecutionContext, NotFoundException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import getArgEntity from "src/common/args/getArgEntity";
import { BaseModel } from "src/common/base.model";
import { IS_NOT_GRAPHQL } from "src/modules/common/auth/decorators/isNotGraphQL.decorator";
import { IS_SUBSCRIPTION } from "src/modules/common/auth/decorators/isSubscription.decorator";
// import { PrismaService } from "nestjs-prisma";
// import PrismaModels from "src/common/PrismaModels.type";
import { Action } from "../action.enum";
import { CaslAbilityFactory, AppAbility, Subjects } from "../casl-ability.factory";
import { CHECK_POLICIES_KEY } from "../checkPolicies.decorator";
import { PolicyHandler } from "../policyHandler.interface";

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    // private caslAbilityFactory: CaslAbilityFactory,
    // private context: ExecutionContext,
    // private prisma: PrismaService,
    @InjectConnection() private connection: Connection
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const policyHandlers =
    //   this.reflector.get<PolicyHandler[]>(
    //     CHECK_POLICIES_KEY,
    //     context.getHandler(),
    //   ) || [];

    const policyHandlers = this.reflector.getAllAndOverride<PolicyHandler[]>(CHECK_POLICIES_KEY, [
        context.getHandler(),
        context.getClass(),
    ]);

    /* mohammad albasha */
    /* this Guard check the abilities against the route handler 
       we should call the @Can decorator and pass to it the PoiliciesHandlers 
       to make this guard useful
       
       with this guard and @Can(PoliciesHandlers[]) we can apply authorization on the route handler level
     */


    if (!policyHandlers) {
        return true;
    }

    // graphql or rest api
    let req;

    const isNotGraphQL = this.reflector.getAllAndOverride<boolean>(IS_NOT_GRAPHQL, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isSubscription = this.reflector.getAllAndOverride<boolean>(IS_SUBSCRIPTION, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isNotGraphQL && !isSubscription) {
      req = context.switchToHttp().getRequest();
    } else {
      req = GqlExecutionContext.create(context).getContext().req;
    }


    const user = req.user;
    const ability = req.ability;

    let result = true;
    for (const i in policyHandlers) { // each
      const handler = policyHandlers[i];
      const action = handler[0] as Action
      const Model = handler[1] as typeof BaseModel


      /* mohammad albacha */
      /* IMPOOOOOERTANT */
      result = ability.can(action, Model.name)
      /* this code was uncommented but it retuns false always because the entity is always null */
      // if (action == Action.Read || action == Action.Update || action == Action.Delete) {
      //   const entity = await getArgEntity(Model, context);
      //   console.log(entity)
      //   if (!entity) return false;
      //   // entity._prismaTypeName = Model;

      //   result = ability.can(action, entity)
      // } else {
      //   result = ability.can(action, Model.name)
      // }



      if (!result) break;
    }

    return result;

    // return policyHandlers.every((handler) => {
    //     if (typeof handler === 'function') {
    //         return handler(ability);
    //     }
    //     return handler.handle(ability);
    // });
    // return true;
  }
}