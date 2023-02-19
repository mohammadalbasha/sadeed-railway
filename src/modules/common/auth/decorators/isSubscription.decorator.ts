
import { SetMetadata } from '@nestjs/common';

export const IS_SUBSCRIPTION = 'IsSubscription';
export const IsSubscription = () => SetMetadata(IS_SUBSCRIPTION, true);
