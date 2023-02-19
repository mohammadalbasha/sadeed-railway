// import { ForbiddenException } from "@nestjs/common";
// import { FieldMiddleware, MiddlewareContext, NextFn } from "@nestjs/graphql";
// import { Role } from "src/users/authorization/roles/role.enum";

// export const checkRoleMiddleware: FieldMiddleware = async (
//     ctx: MiddlewareContext,
//     next: NextFn,
//   ) => {
//     const { info } = ctx;
//     const { extensions } = info.parentType.getFields()[info.fieldName];
  
//     /**
//      * In a real-world application, the "userRole" variable
//      * should represent the caller's (user) role (for example, "ctx.user.role").
//      */
//     if (!ctx.source.containsRole(extensions.role)) {
//       // or just "return null" to ignore
//       throw new ForbiddenException(
//         `User does not have sufficient permissions to access "${info.fieldName}" field.`,
//       );
//     }
//     return next();
//   };
  