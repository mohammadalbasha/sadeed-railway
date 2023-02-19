import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Global()
@Module({
    providers: [
        {
            provide: 'PUB_SUB',
            // useValue: new PubSub(),
            useValue: new RedisPubSub(),
        },
    ],
    exports: [
        'PUB_SUB'
    ]
})
export class GlobalModule {}
