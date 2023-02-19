/* mohammad albacha */
import { Auth } from './gql/auth.model';
import { Token } from './gql/token.model';
import { LoginInput } from './dto/login.input';
import {
  Resolver,
  Mutation,
  Args,
  Parent,
  ResolveField,
    Query
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/signup.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { Public } from './decorators/isPublic.decorator';
import { CurrentAbility } from './decorators/currentAbility.decorator';
import { Ability } from '@casl/ability';
import { CaslAbilityFactory } from '../authorization/casl/casl-ability.factory';
import { User } from '../user/user.model';
import { CreateAdministratorBySuperAdminInput, DeleteAdministratorInput, EnableOrDisableAdministratorInput, GrantAdministratorCentralRoleInput, ReActivateAdministratorInput, UpdateAdministratorBySuperAdminInput } from './dto/administrator.input';
import { Can } from '../authorization/casl/checkPolicies.decorator';
import { Action, maximumPermisionsPosibilities, maximumPermisionsPosibilitiesArray } from '../authorization/casl/action.enum'
import { CurrentUser } from './decorators/currentUser.decorator';
import { Loader } from 'src/common/dataLoader/dataLoader.decorator';
import { PermisionsInput } from 'src/modules/central/central-role/central-role.input';
import { Permisions } from 'src/modules/central/central-role/central-role.model';
import { CreateUserByAdministratorInput, DeleteAdminInput, EnableOrDisableAdminInput, ResetUserPasswordRequestByAdministrator, RestoreAdminInput, SoftDeleteAdminInput, UpdateUserByAdministratorInput, } from './dto/manageUserByAdministrator.input';
import { UserBrowser } from './decorators/UserBrowser.decorator';
import { ReSendAdministratorTwoFactorCodeInput } from './dto/administratorTwoFactorsCode.input';


@Resolver(() => Auth)
export class AuthCentralResolver {
  constructor(private readonly auth: AuthService ) {}


  
  /* ADMINISTRATOR RELATED FUNCTIONALITY */
  /************************************** */

  /* mohammad albacha */
  @Can([Action.Create, User])
  @Mutation(() => User)
  async createAdministratorBySuperAdmin(@Args('data') data: CreateAdministratorBySuperAdminInput, @CurrentUser() user: User) {
    data.email = data.email.toLowerCase();
    return await this.auth.createAdministratorBySuperAdmin(data, user);

  }

/* mohammad albacha */
  @Can([Action.Update, User])
  @Mutation(() => User)
  async grantAdministratorCentralRole(@Args('data') data: GrantAdministratorCentralRoleInput) {
    return await this.auth.grantAdministratorCentralRole(data);
  }

/* mohammad albacha */
  @Can([Action.Update, User])
  @Mutation(() => User)
  async disGrantAdministratorCentralRole(@Args('data') data: GrantAdministratorCentralRoleInput) {
    return this.auth.disGrantAdministratorCentralRole(data);
  }

/* mohammad albacha */
  @Can([Action.Update, User])
  @Mutation(() => User)
  async toggleAdministratorActivationStatus(@Args('data') data: EnableOrDisableAdministratorInput, @CurrentUser() currentUser: User){
    return await this.auth.toggleAdministratorActivationStatus(data, currentUser);
  }

/* mohammad albacha */  
  @Can([Action.Update, User])
  @Query((type) => [Permisions])
  maxCentralPermisions(){
    return maximumPermisionsPosibilitiesArray;
  }

  

/* mohammad albacha */
  @Can([Action.Update, User])
  @Mutation(() => User)
  async updateAdministratorBySuperAdmin(@Args('data') data: UpdateAdministratorBySuperAdminInput, @CurrentUser() user: User) {
   if (data.email)
    data.email = data.email?.toLowerCase();
    return await this.auth.updateAdministratorBySuperAdmin(data, user);
  
  }

/* mohammad albacha */
@Can([Action.Update, User])
@Mutation(() => User)
async reActivateAdministrator(@Args('data') data: ReActivateAdministratorInput ) {
 if (data.email)
  data.email = data.email?.toLowerCase();
  return await this.auth.reActivateAdministrator(data);

}


@Can([Action.Update, User])
@Mutation(() => String)
async reSendAdministratorTwoFactorCode(@Args('data') data: ReSendAdministratorTwoFactorCodeInput,  @UserBrowser() userBrowser: string ) {
  return await this.auth.reSendAdministratorTwoFactorCode(data.email.toLowerCase(), userBrowser);

}

  
@Can([Action.Delete, User])
@Mutation(() => String)
async deleteAdministrator(@Args('data') data: DeleteAdministratorInput, @CurrentUser() currentUser: User){
  return this.auth.deleteAdministrator(data, currentUser);
}



  
/* ADMIN(SELLER/CUSTOMER) RELATED FUNCTIONALITY */
/************************************** */

@Can([Action.Create, User])
@Mutation(() => User)
async createUserByAdministrator(@Args('data') data: CreateUserByAdministratorInput){
  return this.auth.createUserByAdministrator(data);
}

@Can([Action.Update, User])
@Mutation(() => User)
async updateUserByAdministrator(@Args('data') data: UpdateUserByAdministratorInput){
  return this.auth.updateUserByAdministrator(data);
}


@Can([Action.Update, User])
@Mutation(() => String)
async resetUserPasswordRequestByAdministrator(@Args('data') data: ResetUserPasswordRequestByAdministrator){
  return this.auth.resetUserPasswordRequestByAdministrator(data);
}
  

@Can([Action.Update, User])
@Mutation(() => User)
async toggleAdminActivationStatus(@Args('data') data: EnableOrDisableAdminInput, @CurrentUser() currentUser: User){
  return await this.auth.toggleAdminActivationStatus(data, currentUser);
}

@Can([Action.Delete, User])
@Mutation(() => String)
async softDeleteAdmin(@Args('data') data: SoftDeleteAdminInput){
  return await this.auth.softDeleteAdmin(data);
}


@Can([Action.Delete, User])
@Mutation(() => String)
async deleteAdmin(@Args('data') data: DeleteAdminInput){
  return await this.auth.deleteAdmin(data);
}


@Can([Action.Delete, User])
@Mutation(() => User)
async restoreAdmin(@Args('data') data: RestoreAdminInput){
  return await this.auth.restoreAdmin(data);
}


}

