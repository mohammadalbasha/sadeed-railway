import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ModelsModule } from 'src/modules/models.module';
import { CaslAbilityFactory } from './casl-ability.factory';
import { PoliciesGuard } from './guards/policy.guard';

@Global()
@Module({
    providers: [
        { /* mohammad albacha*/
        /* here wwhere the policies authorization guards applie to the whole app */
        /* but we follow another approch , we create applity for user when he login , and before we access to tha database,
        we extract the ability from the context using currentAbility decorator, 
        then we apply the abilito to the mongoose query using accessible by */
            provide: APP_GUARD,
            useClass: PoliciesGuard,
        },
        CaslAbilityFactory,
    ],
    exports: [CaslAbilityFactory],
    /* mohammad alacha*/
    imports: [ModelsModule]
})
export class CaslModule {}
