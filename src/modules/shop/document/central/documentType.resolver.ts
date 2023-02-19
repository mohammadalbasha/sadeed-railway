import { Ability } from '@casl/ability';
import { BadRequestException, ForbiddenException, Type } from '@nestjs/common';
import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Action } from 'rxjs/internal/scheduler/Action';
import { BaseModel } from 'src/common/base.model';
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
import { UserDocument } from '../document.model';
import { UserDocumentType, PaginatedUserDocumentType } from '../documentType.model';
import { UserDocumentTypeOrderInput, CreateUserDocumentTypeInput, UpdateUserDocumentTypeInput } from './documentType.input';




@Resolver(() => UserDocumentType)
export class UserDocumentTypeResolver extends BaseAdminResolver(UserDocumentType, PaginatedUserDocumentType, UserDocumentTypeOrderInput, CreateUserDocumentTypeInput, UpdateUserDocumentTypeInput) {

    protected getDeleteRelations(): [{ model: Type<BaseModel>; fieldName: string; }?] {
        return [
            { 
                model: UserDocument,
                fieldName: "type_id"
            }
        ]
    }

}

