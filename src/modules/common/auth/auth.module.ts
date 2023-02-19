import { PasswordService } from './password.service';
import { GqlAuthGuard } from './guards/auth.guard';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.common.resolver';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from 'src/configs/config.interface';
import { APP_GUARD } from '@nestjs/core';
import { User, UserSchema } from '../user/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthCentralResolver } from './auth.central.resolver';
import { MailModule } from '../mail/mail.module';
import { IpModule } from './ip/ip.module';
import GlobalClass from 'src/common/GlobalClass';

@Module({
  imports: [
    /* mohammad albacha */
    /* here where authentication initialized by passportjs*/
    /* I reaaally Don't know how the JwtStrategy are applied*/
    /*{ defaultStrategy: 'jwt' } this line never effect */
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const securityConfig = configService.get<SecurityConfig>('security');
        return {
          secret: configService.get<string>('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: securityConfig.expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
    MailModule
  ],
  providers: [
    AuthService,
    AuthResolver,
    /*mohammad albacha*/
    ...(GlobalClass.isCentral? [AuthCentralResolver]: []),
    /*mohammad albacha*/
    //JwtStartegy are used by passport\lib\middleware\authenticate.js , but I don't know how (maybe because of the super call) */
    JwtStrategy,
    PasswordService,
    /* mohammad albacha*/
    /* here the auth guard applied to the whole app*/
    {
      provide: APP_GUARD,
      useClass: GqlAuthGuard,
      
    },
  ],
  exports: [
    // GqlAuthGuard
    AuthService,
  ],
})
export class AuthModule {}
