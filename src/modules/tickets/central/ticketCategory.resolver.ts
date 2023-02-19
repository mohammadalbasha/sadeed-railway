import { Resolver } from '@nestjs/graphql';
import BaseAdminResolver from 'src/common/baseCRUD.resolver';
import { User } from 'src/modules/common/user/user.model';
import { TicketCategory, PaginatedTicketCategory } from '../ticketCategory.model';
import { TicketCategoryOrderInput, CreateTicketCategoryInput, UpdateTicketCategoryInput } from './ticketCategory.input';

@Resolver(() => TicketCategory)
export class TicketCategoryResolver extends BaseAdminResolver(TicketCategory, PaginatedTicketCategory, TicketCategoryOrderInput, CreateTicketCategoryInput, UpdateTicketCategoryInput) {

  protected async canDelete(item:TicketCategory, user:User): Promise<boolean> {
    // todo: can delete category only if no tickets with it
    return true;
  }
}



