import { Resolver } from '@nestjs/graphql';
import BaseAdminResolver from 'src/common/baseCRUD.resolver';
import { User } from 'src/modules/common/user/user.model';
import { BusinessTypeOrderInput, CreateBusinessTypeInput, UpdateBusinessTypeInput } from './businessType.input';
import { BusinessType, PaginatedBusinessType } from '../businessType.model';

@Resolver(() => BusinessType)
export class BusinessTypeResolver extends BaseAdminResolver(BusinessType, PaginatedBusinessType, BusinessTypeOrderInput, CreateBusinessTypeInput, UpdateBusinessTypeInput) {
  protected populateFields(): any[] {
      return [
        'countries'
      ]
  }
}



