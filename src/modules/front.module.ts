import { Module } from '@nestjs/common';
import { ModelsModule } from './models.module';

@Module({
    imports: [
        ModelsModule
    ],
})
export class FrontModule {}
