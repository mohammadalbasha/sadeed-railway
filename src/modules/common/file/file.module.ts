import { Module } from '@nestjs/common';
import { ModelsModule } from 'src/modules/models.module';
import { FileController } from './file.controller';
import { MediaFileResolver } from './file.resolver';
import { MediaFileService } from './file.service';

@Module({
    imports: [
        ModelsModule,
    ],
    controllers: [
        FileController,
    ],
    providers: [
        MediaFileService,
        MediaFileResolver,
    ]
})
export class MediaFileModule {}