import { Module } from '@nestjs/common';
import { IpResolver } from './ip.resolver';

@Module({
  providers: [IpResolver]
})
export class IpModule {}
