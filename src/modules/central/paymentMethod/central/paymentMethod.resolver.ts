import { Resolver } from '@nestjs/graphql';
import BaseAdminResolver from 'src/common/baseCRUD.resolver';
import { User } from 'src/modules/common/user/user.model';
import { PaymentMethodOrderInput, CreatePaymentMethodInput, UpdatePaymentMethodInput } from './paymentMethod.input';
import { PaginatedPaymentMethod, PaymentMethod } from '../paymentMethod.model';

@Resolver(() => PaymentMethod)
export class PaymentMethodResolver extends BaseAdminResolver(PaymentMethod, PaginatedPaymentMethod, PaymentMethodOrderInput, CreatePaymentMethodInput, UpdatePaymentMethodInput) {

    protected populateFields(): any[] {
        return ['currencies']
    }
}



