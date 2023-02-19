// import { PrismaService } from 'nestjs-prisma';
import { Resolver, Query, Parent, Args, ResolveField, Subscription, Mutation, ObjectType, InputType, } from '@nestjs/graphql';
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
import { BaseFilterInput, BaseOrderInput, BaseOrderInputType } from './base.input';
import { CurrentAbility } from 'src/modules/common/auth/decorators/currentAbility.decorator';
import ModelService, { AccessibleRecordQueryHelpers } from 'src/modules/models.service';
import { AccessibleRecordModel } from '@casl/mongoose';
import { Ability } from '@casl/ability';
import { IsSubscription } from 'src/modules/common/auth/decorators/isSubscription.decorator';
import { Log } from 'src/modules/central/log/log.model';

// import { Shop } from './gql/shop.model';
// import { ShopOrder } from './gql/shop-order.input';
// import { ShopConnection } from './gql/shop-connection.model';
// import { CreateShopInput } from './dto/createShop.input';
// import { UpdateShopInput } from './dto/updateShop.input';

interface ResolverOptions {
    hasCreatedSubscription?: boolean,
    hasReadItem?: boolean,
    hasReadList?: boolean,
    nullableFilter?: boolean,
}

export default function BaseReadResolver<Model extends BaseModel, Paginated, OrderInput extends BaseOrderInputType, FilterInput extends BaseFilterInput>(
        Model: Type<Model>,
        Paginated: Type<Paginated>, 
        OrderInput: Type<OrderInput>, 
        FilterInput: Type<FilterInput>, 
        opts:ResolverOptions = {}
    ) {
    const Name = Model.name
    const NameSmall = Name.charAt(0).toLowerCase() + Name.slice(1);
    const NameCapital= Name.charAt(0).toUpperCase() + Name.slice(1);

    const defaultOptions:ResolverOptions = {
        hasCreatedSubscription: false,
        hasReadItem: true,
        hasReadList: true,
        nullableFilter: false,
    }
    const options:ResolverOptions = Object.assign({}, defaultOptions, opts);

    @Resolver(() => Model)
    abstract class BaseResolverClass {
        protected model: mongoose.Model<Model & mongoose.Document, AccessibleRecordQueryHelpers<Model>>

        constructor(
            // public prisma: PrismaService, 
            // @InjectModel(Model.name) protected readonly model: mongoose.Model<Model>,
            //@InjectConnection() protected connection: Connection,
            @Inject('PUB_SUB') protected pubSub:PubSub,
            protected Models: ModelService,
        ) {
            this.model = Models.model(Model)
        }

        protected populateFields() {
            return [
            ]
        }
        protected whereData(filterBy:FilterInput, user:User)/*: Partial<Model> mohammad albacha*/ {
            return filterBy;
        }
        protected orderData(orderBy:OrderInput, user:User): {[P in keyof Model]?: 1|-1} {
            return {
                [orderBy.field?orderBy.field:'createdAt']: (orderBy.direction&&orderBy.direction === 'asc')? 1 : -1
            } as any
        }


        


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

        /* mohammad albacha */
        /* I found that Read Authorization applied by .accessible
            while Create/Update/Delete Authorization applied by @Can on the resolver handler*/
        // @Can([Action.Read, Model])
        @IfDecorator(
            options.hasReadItem, 
            Query(() => Model, {name: NameSmall})
        )
        async item(@CurrentUser() user:User, @CurrentAbility() ability: Ability, @Args() id: IdArgs, @EntityParam(Model) item:Model&mongoose.Document) {
            return await item.populate(this.populateFields())
        }
        

        //mohammad albacha
        @Can([Action.Read, Model])
        @IfDecorator(
            options.hasReadList, 
            Query(() => Paginated, {name: NameSmall + 's'})
        )
        async items(
            @CurrentUser() user:User,
            @CurrentAbility() ability: Ability,
            @Args() { limit, skip }: PaginationArgs,
            @Args({ name: 'query', type: () => String, nullable: true }) query: string,
            @Args({ name: 'filterBy', nullable: options.nullableFilter }) filterBy: FilterInput,
            @Args({ name: 'orderBy', nullable: true }) orderBy: OrderInput,
        
        ) {

            /*mohammad albacha */
            console.log(ability.can("read", Log.name,"hasErrors")); // false
            console.log(ability.can("read", Log.name,"createdAt")); // true 

            // console.log(await this.model.find({$or: [{countries: "61dc2279bdb75fb3b8fd02f7"}, {countries: {$exists: false}}, {countries: {$size:0}}]}))
            
            const whereData = this.whereData(filterBy, user);
            const orderData = this.orderData(orderBy, user);
            return await findManyCursorConnection(
                async (args) => {
                    let results = await this.model.find(
                            {
                                ...whereData,
                                ...(query && query !== "") && {"$text": {'$search': query}}
                            },
                            null,
                            {
                                skip: skip, 
                                limit: limit,
                                sort: orderData
                            }
                        /* mohammad albacha */
                        /* here is where the ability used actually and authorizaton applied */
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

        //   // @ResolveField('owner')
        //   // async owner(@Parent() shop: Shop) {
        //   //   return this.prisma.shop.findUnique({ where: { id: shop.id } }).owner();
        //   // }

    }

    return BaseResolverClass;
}
