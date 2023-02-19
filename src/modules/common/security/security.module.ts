import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './AllExceptionsFilter';
// import { GqlThrottlerGuard } from './throttle/GqlThrottlerGuard.service';
// import { APP_GUARD } from '@nestjs/core';


@Module({
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: GqlThrottlerGuard,
    // },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: FieldsInterceptor,
    // },

  ],
  imports: []
})
export class SecurityModule {}
