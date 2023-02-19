import { Module } from '@nestjs/common';
import { AuthModule } from './common/auth/auth.module';
import { GlobalModule } from './common/global/global.module';
import { SecurityModule } from './common/security/security.module';
import { UserModule } from './common/user/user.module';
import { AuthorizationModule } from './common/authorization/authorization.module';
import { FileController } from './common/file/file.controller';
import { ModelsModule } from './models.module';
import { MediaFileService } from './common/file/file.service';
import { MediaFileModule } from './common/file/file.module';

@Module({
    imports: [
        ModelsModule,

        AuthModule, // Auth Module before Authorization Module (Super Important because of guards order)
        UserModule,

        // no resolvers
        GlobalModule, 
        AuthorizationModule,
        SecurityModule,
        MediaFileModule,
    ],
    
})
export class CommonModule {}
