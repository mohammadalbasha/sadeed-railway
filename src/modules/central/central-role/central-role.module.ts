import { Module } from '@nestjs/common';
import { ModelsModule } from 'src/modules/models.module';
import { CentralRole } from './central-role.model';
import { CentralRoleResolver } from './central-role.resolver';
import { CentralRoleService } from './central-role.service';

@Module({
    imports: [ModelsModule ],
    providers: [CentralRoleResolver, CentralRoleService],


})
export class CentralRoleModule {}
