// import { PrismaService } from 'nestjs-prisma';
import {
    Resolver,
    Query,
    Parent,
    Mutation,
    Args,
    ResolveField,
    Field,
    ObjectType,
  } from '@nestjs/graphql';
  import { UseGuards } from '@nestjs/common';
  import { AdminFilter, AdministratorFilter, UpdateAdministratorInput, UpdateSuperAdminInput } from './user.input';
  import { UserService } from 'src/modules/common/user/user.service';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { CurrentUser } from '../../auth/decorators/currentUser.decorator';
  import { GqlAuthGuard } from '../../auth/guards/auth.guard';
  import { paginatedUser, User, UserDocument } from '../user.model';
  import graphqlTypeJson from 'graphql-type-json'
  import { CurrentAbility } from '../../auth/decorators/currentAbility.decorator';
  import { Ability } from '@casl/ability';
  import { CentralModule } from 'src/modules/central.module';
  import { CentralRole } from 'src/modules/central/central-role/central-role.model';
  import { Loader } from 'src/common/dataLoader/dataLoader.decorator';
  import Paginated from 'src/common/pagination/pagination';
  import { PaginationArgs } from 'src/common/pagination/pagination.args';
  import { Can } from '../../authorization/casl/checkPolicies.decorator';
  import { Action } from '../../authorization/casl/action.enum';
  
  
  
  @Resolver(() => User)
  @UseGuards(GqlAuthGuard)
  export class AdministratorUserResolver {
    constructor(
      private userService: UserService,
      // private prisma: PrismaService
      @InjectModel(User.name) private readonly user: Model<UserDocument>,
    ) {}
  
    @UseGuards(GqlAuthGuard)
    @Mutation(() => User)
    async updateAdministrator(
      @CurrentUser() user: User,
      @Args('data') newUserData: UpdateAdministratorInput
  ) {
      return this.userService.updateUser(user.id, newUserData);
    }
  
    
    @UseGuards(GqlAuthGuard)
    @Mutation(() => User)
    async updateSuperAdmin(
      @CurrentUser() user: User,
      @Args('data') newUserData: UpdateSuperAdminInput
  ) {
      return this.userService.updateUser(user.id, newUserData);
    }
  
    /* mohammad albacha */
    
    @Can([Action.Read, User])
    @Query(() => paginatedUser)
    async administratorUsers(@CurrentAbility() ability: Ability,
                @Args() { limit, skip }: PaginationArgs,      
                @Args('filterBy') filterBy: AdministratorFilter
            ){
              return await this.userService.fetchAdministratorUsers(filterBy, ability, {limit: limit, skip: skip});
    }

    @Can([Action.Read, User])
    @Query(() => paginatedUser)
    async adminUsers(@CurrentAbility() ability: Ability,
                @Args() { limit, skip }: PaginationArgs,      
                @Args('filterBy') filterBy: AdminFilter
            ){
              return await this.userService.fetchAdminUsers(filterBy, ability, {limit: limit, skip: skip});
    }
  
    @ResolveField(() =>  [CentralRole], { nullable: true})
    async administrator_centralRole(@Parent() user: User, @Loader(CentralRole) loader) {
      if (!user.administrator_centralRoleId) return null
      return await loader.loadMany(user.administrator_centralRoleId);
    }
  
    @ResolveField(() => User, {nullable: true})
    async administrator_updatedBy(@Parent() user: User, @Loader(User) loader) {
      if (!user.administrator_updatedById) return null;
      return await loader.load(user.administrator_updatedById);
    }
  
  
    // @ResolveField('shops')
    // shops(@Parent() owner: User) {
    //   return this.prisma.user.findUnique({ where: { id: owner.id } }).shops();
    // }
  }
  