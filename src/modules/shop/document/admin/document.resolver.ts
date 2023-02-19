import { Ability, AbilityTuple, MongoQuery, Subject } from '@casl/ability';
import { AnyObject } from '@casl/ability/dist/types/types';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { BaseInput, BaseOrderInputType } from 'src/common/base.input';
import BaseResolver from 'src/common/base.resolver';
import BaseAdminResolver from 'src/common/baseCRUD.resolver';
import { Loader } from 'src/common/dataLoader/dataLoader.decorator';
import IfDecorator from 'src/common/decorators/if.decorator';
import { BusinessType } from 'src/modules/central/businessType/businessType.model';
import { Country } from 'src/modules/central/country/country.model';
import { Currency } from 'src/modules/central/currency/currency.model';
import { PaymentMethod } from 'src/modules/central/paymentMethod/paymentMethod.model';
import { Speciality } from 'src/modules/central/speciality/speciality.model';
import { CurrentAbility } from 'src/modules/common/auth/decorators/currentAbility.decorator';
import { CurrentUser } from 'src/modules/common/auth/decorators/currentUser.decorator';
import { EntityParam } from 'src/modules/common/auth/decorators/EntityParam.decorator';
import { Action } from 'src/modules/common/authorization/casl/action.enum';
import { Can } from 'src/modules/common/authorization/casl/checkPolicies.decorator';
import { MediaFile } from 'src/modules/common/file/file.model';
import { User } from 'src/modules/common/user/user.model';
import { UserDocument, PaginatedUserDocument, UserDocumentStatus } from '../document.model';
import { UserDocumentType } from '../documentType.model'
import { UpdateUserDocumentInput, UserDocumentOrderInput } from './document.input';




@Resolver(() => UserDocument)
export class UserDocumentResolver extends BaseAdminResolver(UserDocument, PaginatedUserDocument, UserDocumentOrderInput, BaseInput, UpdateUserDocumentInput, {
    hasCreate: false,
    hasDelete: false,
    hasCreatedSubscription: false,
}) {

    protected async dataValidation(data:UpdateUserDocumentInput, user:User, ability: Ability) {
        if (data.file_id) {
            const mediaFile:MediaFile = await this.Models.model(MediaFile).findById(data.file_id).accessibleBy(ability)
            if (!mediaFile || mediaFile.isPublic) {
                throw new BadRequestException('invalid file')
            }
        }
    }
    // protected whereData(query: String, user: User): Partial<UserDocument> {
    //     return {
    //         status: {$in: [UserDocumentStatus.requested, UserDocumentStatus.processing, UserDocumentStatus.uploaded]} as any
    //     }
    // }

 
    @ResolveField(() => UserDocumentType)
    async type(@Parent() parent: UserDocument, @Loader(UserDocumentType) loader) {
        return await loader.load(parent.type_id)
    }

    @ResolveField(() => MediaFile)
    async file(@Parent() parent: UserDocument, @Loader(MediaFile) loader) {
      return await loader.load(parent.file_id)
    }
}

