import { Args, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { Can } from 'src/modules/common/authorization/casl/checkPolicies.decorator';
import { User } from 'src/modules/common/user/user.model';
import { Ticket, PaginatedTicket, TicketStatus } from '../ticket.model';
import BaseReadResolver from 'src/common/baseRead.resolver';
import { TicketFilterInput, TicketOrderInput, UpdateTicketInput } from './ticket.input';
import { TicketCategory } from '../ticketCategory.model';
import { TicketMessage } from '../ticketMessage.model';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { findManyCursorConnection } from 'src/libs/findManyCursorConnection';
import { Action } from 'src/modules/common/authorization/casl/action.enum';
import { CurrentUser } from 'src/modules/common/auth/decorators/currentUser.decorator';
import { EntityParam } from 'src/modules/common/auth/decorators/EntityParam.decorator';
import { IsNotGraphQL } from 'src/modules/common/auth/decorators/isNotGraphQL.decorator';
import IfDecorator from 'src/common/decorators/if.decorator';
import { CurrentAbility } from 'src/modules/common/auth/decorators/currentAbility.decorator';
import { Ability } from '@casl/ability';

@Resolver(() => Ticket)
export class TicketResolver extends BaseReadResolver(Ticket, PaginatedTicket, TicketOrderInput, TicketFilterInput, {
  hasCreatedSubscription: true,
  nullableFilter: true,
}) {
  protected populateFields(): any[] {
    return [
      'category',
      { path: 'user', select: 'name' },
      { path: 'admin', select: 'name' },
    ]
  }
  protected orderData(orderBy: TicketOrderInput, user: User): { category_id?: 1 | -1; category?: 1 | -1; user_id?: 1 | -1; user?: 1 | -1; admin_id?: 1 | -1; admin?: 1 | -1; status?: 1 | -1; priority?: 1 | -1; subject?: 1 | -1; isCentralSeen?: 1 | -1; isUserSeen?: 1 | -1; central_notes?: 1 | -1; lastReplyTime?: 1 | -1; lastReplyMessage?: 1 | -1; id?: 1 | -1; createdAt?: 1 | -1; updatedAt?: 1 | -1; isActive?: 1 | -1; } {
    return {lastReplyTime: -1}
  }


  @Can([Action.Update, Ticket])
  @Mutation(() => Ticket, {name: 'updateTicket'})
  async update(@CurrentUser() user: User, @Args('data') data: UpdateTicketInput, @EntityParam(Ticket) item:Ticket) {  
    return await this.model.findByIdAndUpdate(data.id, data, {new: true}).populate(this.populateFields())
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




  // @ResolveField('category', returns => [TicketCategory])
  // async category(@Parent() ticket: Ticket) {
  //   // console.log((await (ticket as any).populate('category')).category)
  //   return (await (ticket as any).populate('category')).category
  // }
  
}



