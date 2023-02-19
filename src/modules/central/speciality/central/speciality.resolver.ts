import { Resolver } from '@nestjs/graphql';
import BaseAdminResolver from 'src/common/baseCRUD.resolver';
import { User } from 'src/modules/common/user/user.model';
import { SpecialityOrderInput, CreateSpecialityInput, UpdateSpecialityInput } from './speciality.input';
import { Speciality, PaginatedSpeciality } from '../speciality.model';

@Resolver(() => Speciality)
export class SpecialityResolver extends BaseAdminResolver(Speciality, PaginatedSpeciality, SpecialityOrderInput, CreateSpecialityInput, UpdateSpecialityInput) {
  protected populateFields(): any[] {
    return [
      'countries'
    ]
  }
}



