import { Auth } from './gql/auth.model';
import { Token } from './gql/token.model';
import { LoginInput } from './dto/login.input';
import {
  Resolver,
  Mutation,
  Args,
  Query,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/signup.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { Public } from './decorators/isPublic.decorator';
import { CurrentAbility } from './decorators/currentAbility.decorator';
import { Ability } from '@casl/ability';
import { CaslAbilityFactory } from '../authorization/casl/casl-ability.factory';
import { User } from '../user/user.model';
import { PasswordErrorInterceptor } from './interceptors/passwordError.interceptor';
import { UserIp } from './decorators/UserIp.decorator';
import { UserBrowser } from 'src/modules/common/auth/decorators/UserBrowser.decorator';
import { AdministratorTwoFactorsInput } from './dto/administratorTwoFactorsCode.input';
import { AdminPasswordGenerationTokenInput, AdminPasswordResettingTokenInput } from './dto/manageUserByAdministrator.input';
import { CurrentUser } from './decorators/currentUser.decorator';
import { Request, UnauthorizedException } from '@nestjs/common';
import {  AdminGoogleTwoFactorsCode } from './dto/adminGoogleTwoFactorsCode.input';
import { AdminEmailOtpTwoFactorsCode } from './dto/adminEmailOtpTwoFactorsCode.input';


@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly auth: AuthService, private caslAbilityFactory: CaslAbilityFactory,) { }

  @Public()
  @Mutation(() => Auth)
  async signup(@Args('data') data: SignupInput) {
    data.email = data.email.toLowerCase();
    const { accessToken, refreshToken } = await this.auth.createUser(data);
    return {
      accessToken,
      refreshToken,
    };
  }

  @Public()
  //@UseInterceptors(PasswordErrorInterceptor)
  @Mutation(() => Auth)
  async login(@Args('data') { email, pass }: LoginInput, @UserIp() userIp: string, @UserBrowser() userBrowser: string) {
    const { accessToken, refreshToken } = await this.auth.login({
      email: email.toLowerCase(),
      pass,
      ip: userIp,
      browser: userBrowser
    });

    return {
      accessToken,
      refreshToken,
    };

  }

  @Public()
  @Mutation(() => String)
  async verifyAdministratorTwoFactorsCode(@Args('data') { email, code }: AdministratorTwoFactorsInput) {
    return this.auth.verifyAdministratorTwoFactorsCode(email, code);
  }


  @Public()
  @Mutation(() => String)
  async verifyAdminPasswordGenerationToken(@Args('data') data: AdminPasswordGenerationTokenInput) {
    return this.auth.verifyAdminPasswordGenrationToken(data);
  }

  @Public()
  @Mutation(() => String)
  async verifyAdminPasswordRessetingToken(@Args('data') data: AdminPasswordResettingTokenInput){
    return this.auth.verifyAdminPasswordResettingToken(data);
  }
  
  @Query(() =>  String)
  async generateAdminGoogleTwoFactorsCode(@CurrentUser() user: User, ) {
    const { otpauthUrl } = await this.auth.generateAdminGoogleTwoFactorAuthenticationSecret(user);
    //return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl) ;
    return this.auth.generateAdminGoogleQrCodeDataURL(otpauthUrl)
  }

  @Mutation(() => String)
  async turnOnGoogleTwoFactorAuthentication(
    @Args('data')  { twoFactorsGoogleAuthenticationCode } : AdminGoogleTwoFactorsCode,
    @CurrentUser() user: User
  ) {
    const isCodeValid = this.auth.isAdminGoogleTwoFactorAuthenticationCodeValid(
      twoFactorsGoogleAuthenticationCode, user
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.auth.turnOnAdminGoogleTwoFactorAuthentication(user.id);
    return "google two factors authentication enabled successfully";
  }

   
  @Mutation(() =>  Auth)
  async authenticateAdminGoogleTwoFactors(
    @CurrentUser() user: User,
    @Args('data') { twoFactorsGoogleAuthenticationCode } : AdminGoogleTwoFactorsCode
  ) {
    const isCodeValid =  await this.auth.isAdminGoogleTwoFactorAuthenticationCodeValid(
      twoFactorsGoogleAuthenticationCode, user
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong google authentication code');
    }

    return this.auth.generateTokens({
      userId: user.id,
      isAdminGoogleTwoFactorsAuthenticated: true,
      isAdminEmailOtpTwoFactorsAuthenticated: user.admin_isEmailOtpTwoFactorAuthenticated,
      isValidPasswordToken: user.isValidPasswordToken
    });
  }


  @Mutation(() => String)
  async turnOnEmailOtpTwoFactorAuthentication(
    @CurrentUser() user: User
  ) {
    await this.auth.turnOnAdminEmailOtpTwoFactorAuthentication(user.id);
    return "email otp two factors authentication enabled successfully";
  }

 
  @Mutation(() =>  Auth)
  async authenticateAdminEmailOtpTwoFactors(
    @CurrentUser() user: User,
    @Args('data') { twoFactorsEmailOtpAuthenticationCode } : AdminEmailOtpTwoFactorsCode
  ) {
    const isCodeValid =  await this.auth.isAdminEmailOtpTwoFactorsCodeValid(user.email, twoFactorsEmailOtpAuthenticationCode)
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong email otp authentication code');
    }

    return this.auth.generateTokens({
      userId: user.id,
      isAdminGoogleTwoFactorsAuthenticated: user.admin_isGoogleTwoFactorAuthenticated,
      isAdminEmailOtpTwoFactorsAuthenticated: true,
      isValidPasswordToken: user.isValidPasswordToken
    });
  }

  

  @Public()
  @Mutation(() => Token)
  async refreshToken(@Args() { token }: RefreshTokenInput) {
    return this.auth.refreshToken(token);
  }

  @ResolveField('user')
  async user(@Parent() auth: Auth) {
    return await this.auth.getUserFromToken(auth.accessToken);
  }

  @ResolveField('ability')
  async ability(@Parent() auth: Auth,
    // @CurrentAbility() ability:Ability
  ) {
    const user: User = await this.auth.getUserFromToken(auth.accessToken) as any;
    const rules = this.caslAbilityFactory.createForUser(user).rules
    // rules.forEach(rule => rule.subject = (rule.subject as any).name)
    return rules
    // return ability.rules;
  }
}
