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
import {  ChangePasswordInput, UpdateUserInput, UserFilter } from './user.input';
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

@ObjectType()
export class Me {
  @Field(() => User)
  user: User;

  @Field(() => graphqlTypeJson, { nullable: true })
  ability?: object
}

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(
    private userService: UserService,
    // private prisma: PrismaService
    @InjectModel(User.name) private readonly user: Model<UserDocument>,
  ) {}

  @Query(() => Me)
  async me(@CurrentUser() user: User, @CurrentAbility() ability: Ability): Promise<Me> {
    return {
      user: user,
      ability: ability.rules
    };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @CurrentUser() user: User,
    @Args('data') newUserData: UpdateUserInput
) {
    return this.userService.updateUser(user.id, newUserData);
  }


  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async changePassword(
    @CurrentUser() user: User,
    @Args('data') changePassword: ChangePasswordInput
  ) {
    return this.userService.changePassword(user.id, user.pass, changePassword);
  }

  /* mohammad albacha */
  @Can([Action.Read, User])
  @Query(() => paginatedUser)
  async users(@CurrentAbility() ability: Ability,
              @Args() { limit, skip }: PaginationArgs,      
              @Args('filterBy') filterBy: UserFilter
          ){
            return await this.userService.fetchUsers(filterBy, ability, {limit: limit, skip: skip});
  }

  // @ResolveField('shops')
  // shops(@Parent() owner: User) {
  //   return this.prisma.user.findUnique({ where: { id: owner.id } }).shops();
  // }
}
