import { Resolver } from '@nestjs/graphql';
import BaseAdminResolver from 'src/common/baseCRUD.resolver';
import { User } from 'src/modules/common/user/user.model';
import { PayoutMethodOrderInput, CreatePayoutMethodInput, UpdatePayoutMethodInput } from './payoutMethod.input';
import { PaginatedPayoutMethod, PayoutMethod } from '../payoutMethod.model';

@Resolver(() => PayoutMethod)
export class PayoutMethodResolver extends BaseAdminResolver(PayoutMethod, PaginatedPayoutMethod, PayoutMethodOrderInput, CreatePayoutMethodInput, UpdatePayoutMethodInput) {

    protected populateFields(): any[] {
        return ['currencies']
    }
}



