import { ForbiddenException, Inject, UnauthorizedException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { PubSub } from 'graphql-subscriptions';
import { Connection, Model } from 'mongoose';
import { IdArgs } from 'src/common/args/id.args';
import BaseAdminResolver from 'src/common/baseCRUD.resolver';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { findManyCursorConnection } from 'src/libs/findManyCursorConnection';
import { CurrentUser } from 'src/modules/common/auth/decorators/currentUser.decorator';
import { Action } from 'src/modules/common/authorization/casl/action.enum';
import { Can } from 'src/modules/common/authorization/casl/checkPolicies.decorator';
import { User } from 'src/modules/common/user/user.model';
import { Ticket, TicketStatus } from '../ticket.model';
import { TicketMessage, PaginatedTicketMessage } from '../ticketMessage.model';
import { TicketMessageOrderInput, CreateTicketMessageInput, UpdateTicketMessageInput } from './ticketMessage.input';
import * as mongoose from 'mongoose'
import BaseResolver from 'src/common/base.resolver';
import IfDecorator from 'src/common/decorators/if.decorator';
import { IsNotGraphQL } from 'src/modules/common/auth/decorators/isNotGraphQL.decorator';
import { resolve } from 'path';
import { Ability } from '@casl/ability';
import { CurrentAbility } from 'src/modules/common/auth/decorators/currentAbility.decorator';

@Resolver(() => TicketMessage)
export class TicketMessageResolver extends BaseResolver(TicketMessage) {

  protected populateFields(): any[] {
      return [
          { path: 'admin', select: 'name' },
      ]
  }
  protected createData(data: CreateTicketMessageInput, user: User): Partial<TicketMessage> {
      return {
        ...data,
        isAdmin: false,

      }
  }

  @Can([Action.Subscribe, TicketMessage])
  @IsNotGraphQL()
  @Subscription(() => TicketMessage, { name: 'ticketMessageCreated', filter: (payload, variables) => { return true; }})
  async created(@CurrentUser() user: User) {
        return this.pubSub.asyncIterator('ticketMessageCreated_'+user.id);
  }

  // @Can([Action.Read, TicketMessage])
  @Query(() => PaginatedTicketMessage, {name: 'ticketMessages'})
  async items(
      @CurrentUser() user:User,
      @CurrentAbility() ability: Ability,
      @Args({ name: 'ticket_id'}) ticket_id: string,
      @Args() { limit, skip }: PaginationArgs,
      @Args({ name: 'query', type: () => String, nullable: true }) query: string,
  ) {
      const ticket:Ticket = await this.Models.model(Ticket).findById(ticket_id).accessibleBy(ability)
      if (!ticket || ticket.user_id.toString() !== user.id) {
        throw new ForbiddenException()
      }

      if (!ticket.isUserSeen) {
        this.Models.model(Ticket).findByIdAndUpdate(ticket_id, {isUserSeen: true})
        await this.model.updateMany({ticket_id: ticket_id, seenAt: null, isAdmin: true},{seenAt: new Date()},{multi: true})
      }
      
      const whereData = {
        ...(query && query !== "") && {"$text": {'$search': query}},
        ticket_id: ticket_id
      }
      return await findManyCursorConnection(
            async (args) => {
              let results = await this.model.find(
                      whereData,
                      null,
                      { 
                          skip: skip, 
                          limit: limit,
                          sort: {createdAt: -1}
                      }
                  ).accessibleBy(ability).populate(this.populateFields())
            return results
          },
          async () => {
              return await this.model.count(whereData).accessibleBy(ability)
          },
      );
  }

  @Can([Action.Create, TicketMessage])
  @Mutation(() => TicketMessage, {name: 'createTicketMessage'})
  async create(@CurrentUser() user: User, @Args('data') data: CreateTicketMessageInput) {
      const ticket:Ticket = await this.Models.model(Ticket).findById(data.ticket_id)
      if (!ticket || ticket.user_id.toString() !== user.id || ticket.status === TicketStatus.closed) {
        throw new ForbiddenException()
      }
      
      const createData = this.createData(data, user);
      const newItem = await this.model.create(createData)

      await this.Models.model(Ticket).findByIdAndUpdate(data.ticket_id, {
        lastReplyTime: new Date(),
        lastReplyMessage: createData.message,
        lastReplyIsByAdmin: false,
        status: (ticket.status === TicketStatus.solved? TicketStatus.reopened: ticket.status),
        isCentralSeen: false,
      } as Partial<Ticket>)
      
      this.pubSub.publish('ticketMessageCreated', { ['ticketMessageCreated']: newItem });
      return newItem;
  }


}



