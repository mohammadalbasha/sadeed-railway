import { Args, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { Can } from 'src/modules/common/authorization/casl/checkPolicies.decorator';
import { User } from 'src/modules/common/user/user.model';
import BaseReadResolver from 'src/common/baseRead.resolver';
import { findManyCursorConnection } from 'src/libs/findManyCursorConnection';
import { Action } from 'src/modules/common/authorization/casl/action.enum';
import { CurrentAbility } from 'src/modules/common/auth/decorators/currentAbility.decorator';
import { Ability } from '@casl/ability';
import { Log, PaginatedLog } from '../log.model';
import { LogOrderInput, LogFilterInput } from './log.input';
import { Loader } from 'src/common/dataLoader/dataLoader.decorator';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { find } from 'rxjs';

@Resolver(() => Log)
export class LogResolver extends BaseReadResolver(Log, PaginatedLog, LogOrderInput, LogFilterInput, {
  hasCreatedSubscription: true,
  nullableFilter: true,
}) {

  

  protected populateFields(): any[] {
    /* mohammad albacha*/
    /* you should not populate fields here */
    /* it is better to use Loader to solve the n+1 problem */
    return []
     //return ['user_id'];
  }

  /* mohammad albacha */ 
  /* Override the baseResolver whereData method to add Date Filtering */
  protected whereData(filterBy: LogFilterInput, user: User) {
    const filterByMongo = {...filterBy} as any;
    if (filterBy.dateFilter ) {
      filterByMongo.createdAt = {
        $gte: new Date(filterBy.dateFilter.gte),
        $lte: new Date(filterBy.dateFilter.lte)
      }
      return filterByMongo;
    }
    
  }
  /*mohammad albacha*/
  /* this dummy resolver written by me */
  /* the code works fine */
  /* but the error mwssage when the user is unauthorized is internal server error*/
  // this query returns a logs related to super admin and admins in the central app
  @Query(() => [Log])
  async centralLogs(@CurrentAbility() ability: Ability) {
    const logs = await this.model.find()
      .accessibleBy(ability)
      .where({endpoint: 'central'})
      // .populate({
      //   path: 'user_id',
      // })
      .populate(this.populateFields())
      .exec();
    return logs
  }

  /* mohammad albacha*/
  // this query returns logs related to admins(seller) in the admin app and to customers in the front app
  
  @Query(() => [Log])
  async frontAndAdminLogs(@CurrentAbility() ability: Ability) {
    const logs = await this.model.find()
      .accessibleBy(ability)
      .where({$or:[{endpoint: 'front'}, {endpoint: 'admin'}]})
      // .populate({
      //   path: 'user_id',
      // })
      .exec();
    return logs
  }

  @Can([Action.Read, Log])
  @Query(() => PaginatedLog,  {name: "paginatedCentralLogs"})
  async centralLogsPaginated(@CurrentAbility() ability: Ability, @Args() { limit, skip }: PaginationArgs) {
    const logs = await this.model.find()
    .where({endpoint: 'central'})
    .skip(skip)
    .limit(limit)
    .accessibleBy(ability)
    //.populate(this.populateFields()) as Log[];

    const totalCount = await this.model.countDocuments({endpoint: 'central'})
        .accessibleBy(ability)

    return {
      items: logs,
      totalCount
    };
      }



  @Query(() => PaginatedLog,  {name: "paginatedFrontAndAdminLogs"})
  async frontAndAdminLogsPaginated(@CurrentAbility() ability: Ability, @Args() { limit, skip }: PaginationArgs) {
   
    const logs = await this.model.find()
    .where({$or:[{endpoint:'admin'},{endpoint: 'front'}]})
    .skip(skip)
    .limit(limit)
    .accessibleBy(ability)
    //.populate(this.populateFields()) as Log[];

    const totalCount = await this.model.countDocuments({$or:[{endpoint:'admin'},{endpoint: 'front'}]})
        .accessibleBy(ability)

    return {
      items: logs,
      totalCount
    };
      }

  

  /* mohammad albacha */
  /* it is preferable to not use Population because it causes n+1 problem 
      you should use Loader and ResolveField to minimise complexity and conevert n+1 to 1+1 */
  @ResolveField(() => User, { nullable: true})
  async user(@Parent() log: Log, @Loader(User) loader) {
    if (!log.user_id) return null
    return await loader.load(log.user_id)
  }

}



