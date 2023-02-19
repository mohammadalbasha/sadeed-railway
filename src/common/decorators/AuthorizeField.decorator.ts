import { applyDecorators, ForbiddenException } from "@nestjs/common";
import { Extensions, Field, FieldMiddleware, HideField, MiddlewareContext, NextFn } from "@nestjs/graphql";
import { Prop } from "@nestjs/mongoose";
import * as mongoose from "mongoose"
import { env } from "process";
import { BaseModel } from "../base.model";
import GlobalClass, { Endpoint } from "../GlobalClass";





export const checkRoleGraphqlFieldMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const { info } = ctx;
  const { extensions } = info.parentType.getFields()[info.fieldName];

  // // const userRole = Role.USER;
  if (!extensions.endpoints.includes(env.CentralOrAdminOrFront)) {
    // or just "return null" to ignore
    throw new ForbiddenException(
      `User does not have sufficient permissions to access "${info.fieldName}" field.`,
    );
  }
  return next();
};



export function AuthorizeField(...endpoints:Endpoint[]) {
  return applyDecorators(
    Field({ middleware: [checkRoleGraphqlFieldMiddleware] }),
    Extensions({ endpoints: endpoints })
  )
}


