// import { PrismaService } from 'nestjs-prisma';
import { Resolver, Query, Parent, Args, ResolveField, Subscription, Mutation, ObjectType, } from '@nestjs/graphql';
// import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { PubSub } from 'graphql-subscriptions/';
import { CurrentUser } from 'src/modules/common/auth/decorators/currentUser.decorator';
import { User } from 'src/modules/common/user/user.model';
import { IdArgs } from 'src/common/args/id.args';
import { EntityParam } from 'src/modules/common/auth/decorators/EntityParam.decorator';
import { BadRequestException, ForbiddenException, Inject, Type, UnauthorizedException } from '@nestjs/common';
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
import { CurrentAbility } from 'src/modules/common/auth/decorators/currentAbility.decorator';
import { Ability } from '@casl/ability';
import ModelService, { AccessibleRecordQueryHelpers } from 'src/modules/models.service';
import { AccessibleRecordModel } from '@casl/mongoose';
import { BaseOrderInputType } from './base.input';
import { UserDocument } from 'src/modules/shop/document/document.model';
import { IsSubscription } from 'src/modules/common/auth/decorators/isSubscription.decorator';
import { BaseService } from './base.service';

// import { Shop } from './gql/shop.model';
// import { ShopOrder } from './gql/shop-order.input';
// import { ShopConnection } from './gql/shop-connection.model';
// import { CreateShopInput } from './dto/createShop.input';
// import { UpdateShopInput } from './dto/updateShop.input';

interface ResolverOptions {
    hasCreatedSubscription?: boolean,
    hasReadItem?: boolean,
    hasReadList?: boolean,
    hasCreate?: boolean,
    hasUpdate?: boolean,
    hasDelete?: boolean,
    nullableFilter?: boolean,
}

export default function BaseAdminResolver<Model extends BaseModel, Paginated, OrderInput extends BaseOrderInputType, CreateInput, UpdateInput>(
        Model: Type<Model>,
        Paginated: Type<Paginated>, 
        OrderInput: Type<OrderInput>, 
        CreateInput: Type<CreateInput>, 
        UpdateInput: Type<UpdateInput>,
        opts:ResolverOptions = {},

    ) {
    const Name = Model.name
    const NameSmall = Name.charAt(0).toLowerCase() + Name.slice(1);
    const NameCapital= Name.charAt(0).toUpperCase() + Name.slice(1);

    const defaultOptions:ResolverOptions = {
        hasCreatedSubscription: true,
        hasReadItem: true,
        hasReadList: true,
        hasCreate: true,
        hasUpdate: true,
        hasDelete: true,
        nullableFilter: false,
    }
    const options:ResolverOptions = Object.assign({}, defaultOptions, opts);

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
                ...data as Partial<Model> /*mohammad albacha */
            }
        }
        protected updateData(data: UpdateInput, user:User): Partial<Model>{
            return {
                ...data as Partial<Model> /* mohammad albacha */
            }
        }
        
        protected canUpdate(item:Model, user:User): Boolean {
            return true;
        }
        
        protected async canDelete(item:Model, user:User): Promise<Boolean> {
            for (let r of this.getDeleteRelations()) {
                const count = await this.Models.model(r.model).count({[r.fieldName]: item.id})
                if (count > 0) {
                    throw new BadRequestException(`Can't delete because there are ${count} relations with ${r.model.name}`)
                }
            }
            
            return true;
        }
        protected getDeleteRelations(): [{model: Type<BaseModel>, fieldName: string}?] {
            return [];
        }   

        // protected async createDataValidation(data: CreateInput, user:User, ability: Ability) {}
        // protected async updateDataValidation(data: UpdateInput, user:User, ability: Ability) {}
        protected async dataValidation(data:CreateInput|UpdateInput, user:User, ability: Ability) {}



        @IsNotGraphQL()
        @IsSubscription()
        @Can([Action.Subscribe, Model])
        @IfDecorator(
            options.hasCreatedSubscription, 
            Subscription(() => Model, { name: NameSmall+'Created', filter: (payload, variables) => { return true; }})
        )
        async created(@CurrentUser() user:User) {
            
            return this.pubSub.asyncIterator(NameSmall + 'Created');
        }

        // @Can([Action.Read, Model])
        @IfDecorator(
            options.hasReadItem, 
            Query(() => Model, {name: NameSmall})
        )
        async item(@CurrentUser() user:User, @Args() id: IdArgs, @EntityParam(Model) item:Model&mongoose.Document) {
            return await item.populate(this.populateFields())
        }
        
        // @Can([Action.Read, Model])
        @IfDecorator(
            options.hasReadList, 
            Query(() => Paginated, {name: NameSmall + 's'})
        )
        async items(
            @CurrentUser() user:User,
            @CurrentAbility() ability: Ability,
            @Args() { limit, skip }: PaginationArgs,
            @Args({ name: 'query', type: () => String, nullable: true }) query: string,
            @Args({ name: 'orderBy', nullable: true }) orderBy: OrderInput
        ) {
            // console.log(await this.model.find({$or: [{countries: "61dc2279bdb75fb3b8fd02f7"}, {countries: {$exists: false}}, {countries: {$size:0}}]}))
            const whereData = this.whereData(query, user);
            return await findManyCursorConnection(
                async (args) => {
                    // let results = await (this.model as any).accessibleBy(ability, Action.Read).find(
                    let results = await this.model.find(
                            {
                                ...whereData,
                                ...(query && query !== "") && {"$text": {'$search': query}}
                            },
                            null,
                            { 
                                skip: skip, 
                                limit: limit,
                                sort: {[(orderBy as any).field?(orderBy as any).field:'createdAt']: ((orderBy as any).direction&&(orderBy as any).direction === 'asc')? 1 : -1}
                            }
                        ).accessibleBy(ability).populate(this.populateFields())
                    return results
                },
                async () => {
                    return await this.model.countDocuments({
                        ...whereData,
                        ...(query && query !== "") && {"$text": {'$search': query}}
                    }).accessibleBy(ability)
                },
            );
        }

        


        
        @Can([Action.Create, Model])
        @IfDecorator(
            options.hasCreate, 
            Mutation(() => Model, {name: 'create' + NameCapital})
        )
        async create(@CurrentUser() user: User, @CurrentAbility() ability: Ability, @Args('data') data: CreateInput): Promise<Model> {
            await this.dataValidation(data, user, ability);
            const createData = this.createData(data, user);
            const newItem = await this.model.create(createData)
            
            this.pubSub.publish(NameSmall + 'Created', { [NameSmall + 'Created']: newItem });
            return newItem;
        }
        
        @Can([Action.Update, Model])
        @IfDecorator(
            options.hasUpdate, 
            Mutation(() => Model, {name: 'update' + NameCapital})
        )
        async update(@CurrentUser() user: User, @CurrentAbility() ability: Ability, @Args('data') data: UpdateInput, @EntityParam(Model) item:Model) {  
            await this.dataValidation(data, user, ability);
            if (this.canUpdate(item, user)) {
                const updateData = this.updateData(data, user);
                return await this.model.findByIdAndUpdate((data as any).id, updateData, {new: true}).populate(this.populateFields())   
            } else {
                throw new ForbiddenException();
            }
        }
        
        @Can([Action.Delete, Model])
        @IfDecorator(
            options.hasDelete, 
            Mutation(() => Model, {name: 'delete' + NameCapital})
        )
        async delete(@CurrentUser() user: User, @Args() id: IdArgs, @EntityParam(Model) item:Model) {
            if (await this.canDelete(item, user)) {
                await this.model.findByIdAndDelete((item as any).id)
                return item;
            } else {
                throw new ForbiddenException();
            }
        }
        

        //   // @ResolveField('owner')
        //   // async owner(@Parent() shop: Shop) {
        //   //   return this.prisma.shop.findUnique({ where: { id: shop.id } }).owner();
        //   // }

    }

    return BaseResolverClass;
}
