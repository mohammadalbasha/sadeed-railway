import { Ability } from '@casl/ability';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { existsSync, unlinkSync } from 'fs';
import { Action } from 'rxjs/internal/scheduler/Action';
import { BaseInput } from 'src/common/base.input';
import BaseAdminResolver from 'src/common/baseCRUD.resolver';
import IfDecorator from 'src/common/decorators/if.decorator';
import { BusinessType } from 'src/modules/central/businessType/businessType.model';
import { Country } from 'src/modules/central/country/country.model';
import { Currency } from 'src/modules/central/currency/currency.model';
import { PaymentMethod } from 'src/modules/central/paymentMethod/paymentMethod.model';
import { Speciality } from 'src/modules/central/speciality/speciality.model';
import { CurrentUser } from 'src/modules/common/auth/decorators/currentUser.decorator';
import { EntityParam } from 'src/modules/common/auth/decorators/EntityParam.decorator';
import { Can } from 'src/modules/common/authorization/casl/checkPolicies.decorator';
import { User } from 'src/modules/common/user/user.model';
import { MediaFileOrderInput } from './file.input';
import { MediaFile, PaginatedMediaFile } from './file.model';

@Resolver(() => MediaFile)
export class MediaFileResolver extends BaseAdminResolver(MediaFile, PaginatedMediaFile, MediaFileOrderInput, BaseInput, BaseInput, {
    hasCreate: false,
    hasUpdate: false,
}) {

    protected whereData(query: String, user: User): Partial<MediaFile> {
        return {
            user_id: user.id
        }
    }

    protected async canDelete(item: MediaFile, user: User): Promise<Boolean> {
        if (!super.canDelete(item, user)) return false
        if (existsSync(item.path)) {
            unlinkSync(item.path);
        } 
        return true
    }
  
}
