// import { PrismaService } from 'nestjs-prisma';
import { Resolver, Query, Parent, Args, ResolveField, Subscription, Mutation, ObjectType, } from '@nestjs/graphql';
// import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { PubSub } from 'graphql-subscriptions/';
import { CurrentUser } from 'src/modules/common/auth/decorators/currentUser.decorator';
import { User } from 'src/modules/common/user/user.model';
import { IdArgs } from 'src/common/args/id.args';
import { EntityParam } from 'src/modules/common/auth/decorators/EntityParam.decorator';
import { Inject, Type, UnauthorizedException } from '@nestjs/common';
import { IsNotGraphQL } from 'src/modules/common/auth/decorators/isNotGraphQL.decorator';
import { PaginationArgs } from './pagination/pagination.args';
import { Can } from 'src/modules/common/authorization/casl/checkPolicies.decorator';
import { Action } from 'src/modules/common/authorization/casl/action.enum';
import { BaseModel } from './base.model';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { findManyCursorConnection } from 'src/libs/findManyCursorConnection';
import * as mongoose from 'mongoose'
import IfDecorator from './decorators/if.decorator';
import ModelService, { AccessibleRecordQueryHelpers } from 'src/modules/models.service';
import { BaseOrderInputType } from './base.input';

interface ResolverOptions {
    hasCreatedSubscription?: boolean,
    hasReadItem?: boolean,
    hasReadList?: boolean,
    hasCreate?: boolean,
    hasUpdate?: boolean,
    hasDelete?: boolean,
}

export default function BaseResolver<Model extends BaseModel, Paginated, OrderInput extends BaseOrderInputType, CreateInput, UpdateInput>(
        Model: Type<Model>,
        Paginated: Type<Paginated> = null, 
        OrderInput: Type<OrderInput> = null, 
        CreateInput: Type<CreateInput> = null, 
        UpdateInput: Type<UpdateInput> = null,
    ) {
    const Name = Model.name
    const NameSmall = Name.charAt(0).toLowerCase() + Name.slice(1);
    const NameCapital= Name.charAt(0).toUpperCase() + Name.slice(1);

    @Resolver(() => Model)
    abstract class BaseResolverClass {
        protected model: mongoose.Model<Model & mongoose.Document, AccessibleRecordQueryHelpers<Model>>
        constructor(
            // public prisma: PrismaService, 
            // @InjectModel(Model.name) protected readonly model: mongoose.Model<Model>,
            // @InjectConnection() protected connection: Connection,
            @Inject('PUB_SUB') protected pubSub:PubSub,
            protected Models: ModelService,
        ) {
            this.model = Models.model(Model)
        }

        protected populateFields() {
            return [
            ]
        }
        protected whereData(query:String, user:User): Partial<Model> {
            return {
                // name: { contains: query || '' },
            }
        }
        protected orderData(orderBy:OrderInput, user:User): {[P in keyof Model]?: 1|-1} {
            return {
                [orderBy.field?orderBy.field:'createdAt']: (orderBy.direction&&orderBy.direction === 'asc')? 1 : -1
            } as any
        }
        protected createData(data:CreateInput, user:User): Partial<Model>{
            return {
                ...data
            }
        }
        protected updateData(data: UpdateInput, user:User): Partial<Model>{
            return {
                ...data
            }
        }
        protected canUpdate(item:Model, user:User): Boolean {
            return true;
        }
        protected canDelete(item:Model, user:User): Boolean {
            return true;
        }

    }

    return BaseResolverClass;
}
