import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { IdArgs } from 'src/common/args/id.args';
import BaseAdminResolver from 'src/common/baseCRUD.resolver';
import { CurrentUser } from 'src/modules/common/auth/decorators/currentUser.decorator';
import { EntityParam } from 'src/modules/common/auth/decorators/EntityParam.decorator';
import { Action } from 'src/modules/common/authorization/casl/action.enum';
import { Can } from 'src/modules/common/authorization/casl/checkPolicies.decorator';
import { User } from 'src/modules/common/user/user.model';
import { Ticket, PaginatedTicket, TicketStatus } from '../ticket.model';
import { TicketOrderInput, CreateTicketInput, UpdateTicketInput } from './ticket.input';
import Paginated from 'src/common/pagination/pagination';
import { TicketMessage } from '../ticketMessage.model';
import { PaginatedTicketCategory, TicketCategory } from '../ticketCategory.model';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { findManyCursorConnection } from 'src/libs/findManyCursorConnection';
import { CurrentAbility } from 'src/modules/common/auth/decorators/currentAbility.decorator';
import { Ability } from '@casl/ability';

@Resolver(() => Ticket)
export class TicketResolver extends BaseAdminResolver(Ticket, PaginatedTicket, TicketOrderInput, CreateTicketInput, UpdateTicketInput, {
  hasCreate: false,
  hasUpdate: false,
  hasDelete: false,
  hasCreatedSubscription: false,
}) {
  protected createData(data: CreateTicketInput, user: User): Partial<Ticket> 
  {
    let result = {
      ...data,
      user_id: user.id,
      status: TicketStatus.open,
      lastReplyMessage: data.message,
      lastReplyTime: new Date(),
      isUserSeen: true,
    } as Partial<Ticket>
    delete (result as any).message 
    return result
  }
  protected whereData(query, user:User) {
    return {
      user_id: user.id
    }
  }
  protected populateFields(): any[] {
    return [
      'category',
      { path: 'user', select: 'name' },
      { path: 'admin', select: 'name' },
    ]
  }


  @Can([Action.Create, Ticket])
  @Mutation(() => Ticket, {name: 'createTicket'})
  async create_(@CurrentUser() user: User, @Args('data') data: CreateTicketInput) {
      const createData = this.createData(data, user);
      const newItem = await this.model.create(createData)

      await this.Models.model(TicketMessage).create({
        ticket_id: newItem.id,
        message: data.message
      })
      
      this.pubSub.publish('ticketCreated', { ['ticketCreated']: newItem });
      return newItem;
  }

  



  // @Can([Action.Read, TicketCategory])
  @Query(() => PaginatedTicketCategory, {name: 'ticketCategories'})
  async ticketCategoryitems(@CurrentUser() user:User, @CurrentAbility() ability: Ability) {
      return await findManyCursorConnection(
          //@ts-ignore
          async (args) => {
              return await this.Models.model(TicketCategory).find(
                      {
                          isActive: true,
                      },
                      null,
                      { 
                          sort: {createdAt: -1}
                      }
                  ).accessibleBy(ability)
          },
          async () => {
              return await this.Models.model(TicketCategory).countDocuments({isActive: true}).accessibleBy(ability)
          },
      );
  }

  // @ResolveField('messages', returns => [TicketMessage])
  // async messages(
  //     @Parent() ticket: Ticket,
  //     @Args() { limit, skip }: PaginationArgs,
  //   ) {
  //     return await this.connection.models[TicketMessage.name].find(
  //       {
  //           ticket_id: ticket.id
  //       },
  //       null,
  //       { 
  //           skip: skip, 
  //           limit: limit,
  //           sort: {createdAt: -1}
  //       }
  //     )
  // }

  // @ResolveField('category', returns => [TicketMessage])
  // async category(@Parent() ticket: Ticket) {
  //   // console.log((await (ticket as any).populate('category')).category)
  //   return (await (ticket as any).populate('category')).category
  // }
  
}



