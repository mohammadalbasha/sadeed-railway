import { SetMetadata } from "@nestjs/common";
import { Action } from "./action.enum";
import { Subjects } from "./casl-ability.factory";
import { PolicyHandler } from "./policyHandler.interface";

export const CHECK_POLICIES_KEY = 'check_policy';

export const Can = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);

// export const CheckPolicies = (...handlers: PolicyHandler[]) =>
//   SetMetadata(CHECK_POLICIES_KEY, handlers);
