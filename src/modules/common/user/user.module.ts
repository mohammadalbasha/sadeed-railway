import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PasswordService } from '../auth/password.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.model';
import { UserResolver } from './common/user.resolver';
import { AdministratorUserResolver } from './central/user.resolver';
import GlobalClass from 'src/common/GlobalClass';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UserResolver,
    ...(GlobalClass.isCentral? [AdministratorUserResolver]: []),
     UserService,
      PasswordService],
  exports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],

})
export class UserModule {}
