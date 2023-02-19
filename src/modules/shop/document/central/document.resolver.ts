import { Ability } from '@casl/ability';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Action } from 'rxjs/internal/scheduler/Action';
import BaseResolver from 'src/common/base.resolver';
import BaseAdminResolver from 'src/common/baseCRUD.resolver';
import { Loader } from 'src/common/dataLoader/dataLoader.decorator';
import IfDecorator from 'src/common/decorators/if.decorator';
import { BusinessType } from 'src/modules/central/businessType/businessType.model';
import { Country } from 'src/modules/central/country/country.model';
import { Currency } from 'src/modules/central/currency/currency.model';
import { PaymentMethod } from 'src/modules/central/paymentMethod/paymentMethod.model';
import { Speciality } from 'src/modules/central/speciality/speciality.model';
import { CurrentUser } from 'src/modules/common/auth/decorators/currentUser.decorator';
import { EntityParam } from 'src/modules/common/auth/decorators/EntityParam.decorator';
import { Can } from 'src/modules/common/authorization/casl/checkPolicies.decorator';
import { MediaFile } from 'src/modules/common/file/file.model';
import { User } from 'src/modules/common/user/user.model';
import { UserDocument, PaginatedUserDocument, UserDocumentStatus } from '../document.model';
import { UserDocumentType } from '../documentType.model'
import { UserDocumentOrderInput, CreateUserDocumentInput, UpdateUserDocumentInput } from './document.input';




@Resolver(() => UserDocument)
export class UserDocumentResolver extends BaseAdminResolver(UserDocument, PaginatedUserDocument, UserDocumentOrderInput, CreateUserDocumentInput, UpdateUserDocumentInput) {
 
  @ResolveField(() => UserDocumentType)
  async type(@Parent() parent: UserDocument, @Loader(UserDocumentType) loader) {
    return await loader.load(parent.type_id)
  }

  @ResolveField(() => MediaFile)
  async file(@Parent() parent: UserDocument, @Loader(MediaFile) loader) {
    return await loader.load(parent.file_id)
  }
}
