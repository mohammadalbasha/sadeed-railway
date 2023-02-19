import { Resolver } from '@nestjs/graphql';
import BaseAdminResolver from 'src/common/baseCRUD.resolver';
import { User } from 'src/modules/common/user/user.model';
import { PlanOrderInput, CreatePlanInput, UpdatePlanInput } from './plan.input';
import { PaginatedPlan, Plan } from '../plan.model';

@Resolver(() => Plan)
export class PlanResolver extends BaseAdminResolver(Plan, PaginatedPlan, PlanOrderInput, CreatePlanInput, UpdatePlanInput) {

}



