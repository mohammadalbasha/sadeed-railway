// import { PrismaService } from 'nestjs-prisma';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  NotAcceptableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { SignupInput } from './dto/signup.input';
// import { Prisma, User } from '@prisma/client';
import { Token } from './gql/token.model';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from 'src/configs/config.interface';
import { User, UserDocument } from '../user/user.model';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAdministratorBySuperAdminInput, DeleteAdministratorInput, EnableOrDisableAdministratorInput, GrantAdministratorCentralRoleInput, ReActivateAdministratorInput, UpdateAdministratorBySuperAdminInput } from './dto/administrator.input';
import { Ability } from '@casl/ability';
import * as mongoose from 'mongoose'
import { AccessibleRecordQueryHelpers } from 'src/modules/models.service';
import { MailService } from '../mail/mail.service';
import { Locale } from 'src/common/lang.constants';
import { Log } from 'src/modules/central/log/log.model';
import { LoginData } from './dto/login.input';
import { AdminPasswordGenerationTokenInput, AdminPasswordResettingTokenInput, CreateUserByAdministratorInput, DeleteAdminInput, ResetUserPasswordRequestByAdministrator, RestoreAdminInput, SoftDeleteAdminInput, UpdateUserByAdministratorInput  } from './dto/manageUserByAdministrator.input';
const crypto = require("crypto");
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { JwtDto } from './dto/jwt.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly user: mongoose.Model<User & UserDocument, AccessibleRecordQueryHelpers<User>>,
    private mailService: MailService,
    @InjectConnection() protected connection: mongoose.Connection,

  ) { }

  async createUser(data: SignupInput): Promise<Token> {
    delete data.confirmPass;
    const hashedPassword = await this.passwordService.hashPassword(
      data.pass
    );
    const user = await this.user.create({
      ...data,
      is_admin: true,
      pass: hashedPassword,
    })
    // console.log(user)
    return this.generateTokens({
      userId: user.id,
      isAdminGoogleTwoFactorsAuthenticated: false,
      isAdminEmailOtpTwoFactorsAuthenticated: false,
      isValidPasswordToken: ""
    });
    // try {
    //   const user = await this.prisma.user.create({
    //     data: {
    //       ...data,
    //       pass: hashedPassword,
    //       // role: 'USER',
    //     },
    //   });

    //   return this.generateTokens({
    //     userId: user.id,
    //   });
    // } catch (e) {
    //   if (
    //     e instanceof Prisma.PrismaClientKnownRequestError &&
    //     e.code === 'P2002'
    //   ) {
    //     throw new ConflictException(`Email ${data.email} already used.`);
    //   } else {
    //     throw new Error(e);
    //   }
    // }
  }

  async login({ email, pass: password, ip, browser }: LoginData): Promise<Token> {
    const user = await this.user.findOne({ email: email })
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
    /* mohammad albacha */

    // check if user is disabled 
    if (!user.isActive) {
      throw new NotAcceptableException(`Sorry, your account is disable, disableNote: ${user.enableOrDisableNote}`);
    }

    //check if user is deleted
    if (user.deleted || user.admin_isSoftDeleted) {
      throw new NotFoundException(`Sorry, your account has been deleted `);
    }

    // check if administrator is blocked for incorrect login tries (password or ip or browser)
    if (user.is_administrator && !user.administrator_isVerifiedTwoFactorsCode){
      throw new NotAcceptableException(`Sorry, please verify your sadeed account with the code that has been sent to your email.`);
    }

    // check if admin(seller/customer) and account is not verified yet with new(or reset) passwoord 
    if (user.is_admin &&  !user.admin_isVerifiedPasswordGenerationToken ){
      throw new NotAcceptableException(`Sorry, please set account password with the link sent to your email.`);
    }

    

    // check if password is valid 
    await this.checkPassword(user, password, browser);

    // if user is administrator
    // check ip, browser criteria
    if (user.is_administrator){
      await this.checkIp(user, ip, browser);
      await this.checkBrowser(user, browser);
    }

    // set 2FA to unauthenticated, so that admin(seller, customer) has to re authenticated himself
    if (user.is_admin){
      await this.user.findByIdAndUpdate(user.id, {
        admin_isEmailOtpTwoFactorAuthenticated: false,
        admin_isGoogleTwoFactorAuthenticated: false
      })
      // if email otp enabled, send otp code by email
      if (user.admin_isEmailOtpTwoFactorAuthenticationEnabled)
        await this.generateAdminEmailOtpTwoFactorsCodeAndSendIt(user)
    
    }
    

    return this.generateTokens({
      userId: user.id,
      isAdminGoogleTwoFactorsAuthenticated: false,
      isAdminEmailOtpTwoFactorsAuthenticated: false,
      isValidPasswordToken: user.isValidPasswordToken
      
    });
  }

  async checkPassword(user: User, password: string, browser: string) {
    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.pass
    );

    if (!passwordValid) {
      if (!user.is_administrator) {
        throw new BadRequestException('Invalid password');
      }
      else {
        if (user.administrator_incorrectPasswordTries >= 2) {
          await this.user.findByIdAndUpdate(user.id, {
            administrator_incorrectPasswordTries: 3,
            isActive: false,
            enableOrDisableNote: "too many incorrect password tries"
          });
          const superAdmin = await this.user.findOne({ is_super_admin: true });
        /*await*/this.mailService.sendAdministratorIncorrectLoginNotification(user, superAdmin, "password", true, password, browser);

        }
        else {
          await this.user.findByIdAndUpdate(user.id, {
            administrator_incorrectPasswordTries: user.administrator_incorrectPasswordTries + 1
          });
          const superAdmin = await this.user.findOne({ is_super_admin: true });
        /*await*/this.mailService.sendAdministratorIncorrectLoginNotification(user, superAdmin, "password", false, password, browser);
        }
        throw new BadRequestException('Invalid password');

      }
    }
    else {
      await this.user.findByIdAndUpdate(user.id, {
        administrator_incorrectPasswordTries: 0
      });
    }
  }

  async checkIp(user:User, ip: string, browser: string){
    // we check if the SuperAdmin has added a specific ips :
    // -: if yes then the administrator should login from valid ip 
    // -: if not then the administrator can login from any ip
    console.log(ip)
    console.log(user)
    const isIpSet = await this.connection.collection('ips').findOne();
    const foundedIp = await this.connection.collection('ips').findOne({ ip: ip });
    if (!foundedIp && isIpSet) {
      if (user.administrator_incorrectIpTries >= 2) {
        await this.user.findByIdAndUpdate(user.id, {
          administrator_incorrectIpTries: 3,
          isActive: false,
          enableOrDisableNote: "too many incorrect Ip tries"
        });
        const superAdmin = await this.user.findOne({ is_super_admin: true });
      /*await*/this.mailService.sendAdministratorIncorrectLoginNotification(user, superAdmin, "ip", true, ip, browser);

      }
      else {
        await this.user.findByIdAndUpdate(user.id, {
          administrator_incorrectIpTries: user.administrator_incorrectIpTries + 1
        });
        const superAdmin = await this.user.findOne({ is_super_admin: true });
      /*await*/this.mailService.sendAdministratorIncorrectLoginNotification(user, superAdmin, "ip", false, ip, browser);

      }
      throw new BadRequestException('Invalid ip');

    }
    else {
      await this.user.findByIdAndUpdate(user.id, {
        administrator_incorrectIpTries : 0      
      })
    }
  
  }

  async checkBrowser(user: User, browser: string){
    if (user.is_administrator && user.browser != browser){
      await this.generateAdministratorTwoFactorsCodeAndSendIt(user, browser);
      throw new BadRequestException('you try to login from a different browser, we sent a code to your email , please verify it');
    }
   
  }

  async generateAdministratorTwoFactorsCodeAndSendIt(user, browser: string){
    const verificationCode = crypto.randomBytes(16).toString('hex');
    console.log(verificationCode)
    await this.user.findByIdAndUpdate(user.id, {
      administrator_twoFactorsCode: verificationCode,
      administrator_isVerifiedTwoFactorsCode: false      ,
      browser: browser
    })
    /*await*/ this.mailService.sendAdministratorTwoFactorsCodeNotification(user, verificationCode);
    return 'code sent successfully'
  }

  async reSendAdministratorTwoFactorCode(email: string, browser: string){
    const user = await this.user.findOne({email: email});
    if (!user)
      throw new NotFoundException("user with this email not found")
    return this.generateAdministratorTwoFactorsCodeAndSendIt(user, browser);
  }


  async verifyAdministratorTwoFactorsCode(email: string, code: string){
    const user = await this.user.findOne({email: email});
    if (user.administrator_twoFactorsCode == code){
      user.administrator_twoFactorsCode = "";
      user.administrator_isVerifiedTwoFactorsCode = true;
      await user.save();
      return "verified successfully, you can login now";
    }
    throw new NotAcceptableException("code is incorrect");
    
  }

  // async checkPasswordAndIp(user: User, password: string, ip: string, browser: string) {
  //   const passwordValid = await this.passwordService.validatePassword(
  //     password,
  //     user.pass
  //   );

  //   if (!user.is_administrator && !user.is_super_admin) {
  //     if (!passwordValid)
  //       throw new BadRequestException('Invalid password');
  //   }

  //   else {
  //     const foundedIp = await this.connection.collection('ips').findOne({ ip: ip });
  //     const ips = await this.connection.collection('ips').findOne();
  //     if (!foundedIp && ips) {
  //       if (user.administrator_incorrectIpTries >= 2) {
  //         await this.user.findByIdAndUpdate(user.id, {
  //           incorrectIpTries: 3,
  //           isActive: false,
  //           enableOrDisableNote: "too many incorrect Ip tries"
  //         });
  //         const superAdmin = await this.user.findOne({ is_super_admin: true });
  //       /*await*/this.mailService.sendIncorrectLoginNotification(user, superAdmin, "ip", true, ip, browser);

  //       }
  //       else {
  //         await this.user.findByIdAndUpdate(user.id, {
  //           incorrectIpTries: user.incorrectIpTries + 1
  //         });
  //         const superAdmin = await this.user.findOne({ is_super_admin: true });
  //       /*await*/this.mailService.sendIncorrectLoginNotification(user, superAdmin, "ip", false, ip, browser);

  //       }
  //       throw new BadRequestException('Invalid ip');

  //     }
  //     else if (!passwordValid) {

  //       if (!user.is_super_admin && user.incorrectPasswordTries >= 2) {
  //         await this.user.findByIdAndUpdate(user.id, {
  //           incorrectPasswordTries: 3,
  //           isActive: false,
  //           enableOrDisableNote: "too many incorrect password tries"
  //         });
  //         const superAdmin = await this.user.findOne({ is_super_admin: true });
  //         /*await*/this.mailService.sendIncorrectLoginNotification(user, superAdmin, "password", true, password, browser);

  //       }
  //       else {
  //         await this.user.findByIdAndUpdate(user.id, {
  //           incorrectPasswordTries: user.incorrectPasswordTries + 1
  //         });
  //         const superAdmin = await this.user.findOne({ is_super_admin: true });
  //         /*await*/this.mailService.sendIncorrectLoginNotification(user, superAdmin, "password", false, password, browser);

  //       }
  //       throw new BadRequestException('Invalid password');

  //     }

  //   }




  // }




  /* ADMINISTRATOR RELATED FUNCTIONALITY */
  /************************************** */


  /* mohammad albacha */
  async createAdministratorBySuperAdmin(data: CreateAdministratorBySuperAdminInput, currentUser: User) {
    delete data.confirmPass;
    const hashedPassword = await this.passwordService.hashPassword(data.pass);
    const user = await this.user.create({
      ...data,
      is_super_admin: false,
      is_administrator: true,
      pass: hashedPassword,
      administrator_centralRoleId: data.administrator_centralRoleId || [],
      administrator_createdById: currentUser.id,
      administrator_incorrectIpTries: 0,
      administrator_incorrectPasswordTries: 0
    });

    if (user) {
    /*await*/ this.mailService.sendAdministratorAccountCreationNotification(user);
    }
    return user;
  }

  /*mohammad albacha */
  async grantAdministratorCentralRole(data: GrantAdministratorCentralRoleInput) {
    // populate in post middleware causes problem here
    // user.findById causes problem
    const user = await this.user.findById(data.userId)
    if (!user.administrator_centralRoleId)
      user.administrator_centralRoleId = [];

    for (let i = 0; i < data.administrator_centralRoleId.length; i++) {
      if (!user.administrator_centralRoleId.includes(data.administrator_centralRoleId[i])) {
        user.administrator_centralRoleId.push(data.administrator_centralRoleId[i]);
      }

    }

    await user.save();
    return user
  }

  /*mohammad albacha */
  async disGrantAdministratorCentralRole(data: GrantAdministratorCentralRoleInput) {
    const user = await this.user.findById(data.userId);


    user.administrator_centralRoleId = user.administrator_centralRoleId.filter(centralRoleId => {
      return !data.administrator_centralRoleId.includes(centralRoleId.toString());
    });
    return user.save();
  }


  /* mohammad albacha */
  async toggleAdministratorActivationStatus(data: EnableOrDisableAdministratorInput, currentUser: User) {
    const preUpdatedUser = await this.user.findById(data.userId);
    const updatedUser = await this.user.findByIdAndUpdate(data.userId, {
      isActive: !preUpdatedUser.isActive,
      enableOrDisableNote: data.enableOrDisableNote,
      administrator_updatedById: currentUser.id,
    }, {new: true});

    if (updatedUser) {
    /* await*/this.mailService.sendEnableOrDisableAdministratorNotification(updatedUser, currentUser);
    }
    return updatedUser;
  }



  async reActivateAdministrator(data: ReActivateAdministratorInput) {
    const updatedUser = await this.user.findByIdAndUpdate(data.id, {
      incorrectPasswordTries: 0,
      incorrectIpTries: 0,
      isActive: true
    });
    return updatedUser;
  }

  /* mohammad albacha */
  async updateAdministratorBySuperAdmin(data: UpdateAdministratorBySuperAdminInput, currentUser: User) {
    if (data.pass) {
      delete data.confirmPass;
      const  isValidPasswordToken = crypto.randomBytes(16).toString('hex');
 
      const hashedPassword = await this.passwordService.hashPassword(data.pass);
      const updatedUser = await this.user.findByIdAndUpdate(data.id,
        {
          ...data,
          pass: hashedPassword,
          administrator_updatedById: currentUser.id,
          isValidPasswordToken: isValidPasswordToken
        });
      // send email     
      if (updatedUser) {
    /* await*/this.mailService.sendUpdateInformationsNotification(updatedUser, currentUser);
      }
      return updatedUser;
    }
    else {
      const updatedUser = await this.user.findByIdAndUpdate(data.id, {
        ...data,
        administrator_updatedById: currentUser.id
      });
      if (data.email && updatedUser) {
      // send message
      /* await*/this.mailService.sendUpdateInformationsNotification(updatedUser, currentUser);

      }
      return updatedUser;

    }
  }

  /* mohammad albacha */

  async deleteAdministrator(data: DeleteAdministratorInput, currentUser: User) {
    // this should be applied by Logs Service, it is better to not inject connection and access database directly 
    // but we have no logs service
    const session = await this.connection.startSession();
    session.startTransaction({ readConcern: "snapshot" });
    try {
      const relatedLogs = await this.connection.model(Log.name).findOne({ user_id: data.id });
      if (relatedLogs) {
        const user = await this.user.findByIdAndUpdate(data.id, {
          deleted: true
        });
        this.mailService.sendDeleteAdministratorNotification(user, currentUser);
      }
      else {
        const user = await this.user.findByIdAndDelete(data.id);
        this.mailService.sendDeleteAdministratorNotification(user, currentUser);

      }

      await session.commitTransaction();
      return "administrator has been deleted successfully";


    }
    catch (err) {
      await session.abortTransaction();
      return "error, administrator wasn't deleted";
    }

  }



  
  /* ADMIN(SELLER/CUSTOMER) RELATED FUNCTIONALITY */
  /************************************** */


  async createUserByAdministrator(data: CreateUserByAdministratorInput){
    const token = crypto.randomBytes(16).toString('hex');
    const user = await this.user.create({
      ...data,
      is_admin: true,
      admin_passwordGenerationToken: token,
      admin_isVerifiedPasswordGenerationToken: false,
    })
    const link = `http://localhost:3000/verify?email=${user.email}&token=${token}`
    /*await*/ this.mailService.sendUserAccountCreatedByAdministratorNotification(user, link);
    return user;
  }

  async updateUserByAdministrator(data: UpdateUserByAdministratorInput){
    const preUpdatedUser = await this.user.findById(data.id);
    const user = await this.user.findByIdAndUpdate(data.id, {
      ...data
    }, {new: true});

    if (data.sendNotificationEmail){
      const updatedData: {property: any, oldValue: any, newValue: any}[] = [] ;
      for (let key in data){
        if (key == 'id' || key == 'sendNotificationEmail')
          continue;

        updatedData.push ({
          property: key,
          oldValue: preUpdatedUser[key],
          newValue: data[key],
        })
      }
      //updatedData.stringify = JSON.stringify(updatedData);
      const link = "http://localhost:3000/login"
      /*await*/ this.mailService.sendUserAccountUpdatedByAdministratorNotification(user, link, updatedData);
      
    }
    return user;
  }



  async verifyAdminPasswordGenrationToken(data: AdminPasswordGenerationTokenInput){
    delete data.confirmPass;
    const user = await this.user.findOne({email: data.email});
    if (!user){
      throw new NotFoundException("there is no user with this email");
    }
    if (user.admin_passwordGenerationToken != data.token){
      throw new NotAcceptableException("verification Code is incorrect")
    };
    const hashedPassword = await this.passwordService.hashPassword(data.pass);
    user.pass = hashedPassword;
    user.isValidPasswordToken = crypto.randomBytes(16).toString('hex');
    user.admin_passwordGenerationToken = "";
    user.admin_isVerifiedPasswordGenerationToken =  true;
    await user.save();
    return "verified successfully, you can login now";

  }


  async resetUserPasswordRequestByAdministrator(data: ResetUserPasswordRequestByAdministrator){
    const token = crypto.randomBytes(16).toString('hex');
    const user = await this.user.findByIdAndUpdate(data.userId,{
      admin_passwordGenerationToken: token,
      admin_isVerifiedPasswordGenerationToken: false,
    })
    const link = `http://localhost:3000/reset-password?email=${user.email}&token=${token}`
    /*await*/ this.mailService.sendResetUserPasswordRequestByAdministratorNotification(user, link);
    if (!user){
      throw new BadRequestException();
    }
    return "password resetting done successfully";
  }

  
  async verifyAdminPasswordResettingToken(data: AdminPasswordResettingTokenInput){  
    return this.verifyAdminPasswordGenrationToken(data);
  }


  
  /* mohammad albacha */
  async toggleAdminActivationStatus(data: EnableOrDisableAdministratorInput, administrator: User) {
    const preUpdatedUser = await this.user.findById(data.userId);
    // preUpdatedUser.isActive = !preUpdatedUser.isActive;
    // preUpdatedUser.enableOrDisableNote = data.enableOrDisableNote;
    // await preUpdatedUser.save();
    const updatedUser = await this.user.findByIdAndUpdate(data.userId, {
      isActive: !preUpdatedUser.isActive,
      enableOrDisableNote: data.enableOrDisableNote,
    }, {new: true});

    if (updatedUser) {
      if (preUpdatedUser.isActive)
    /* await*/this.mailService.sendDisableAdminNotification(updatedUser, administrator);
      else{/* await*/;
      const link  = `http://localhost:3000/login`
      this.mailService.sendEnableAdminNotification(updatedUser, link);
    }
    }
    return updatedUser;
  }


  
  
  async softDeleteAdmin(data: SoftDeleteAdminInput) {
        const user = await this.user.findByIdAndUpdate(data.id, {
          admin_isSoftDeleted: true,
          admin_deleteNote: data.deleteNote
        }, {new: true});
        this.mailService.sendSoftDeleteAdminNotification(user, data.deleteNote);
        return "admin has been soft deleted successfully";
  }

  async deleteAdmin(data: DeleteAdminInput) {
    // this should be applied by Logs Service, it is better to not inject connection and access database directly 
    // but we have no logs service
    const session = await this.connection.startSession();
    session.startTransaction({ readConcern: "snapshot" });
    try {
      const relatedLogs = await this.connection.model(Log.name).findOne({ user_id: data.id });
      if (relatedLogs) {
        const user = await this.user.findByIdAndUpdate(data.id, {
          deleted: true
        });
      }
      else {
        const user = await this.user.findByIdAndDelete(data.id);

      }

      await session.commitTransaction();
      return "admin has been deleted successfully";


    }
    catch (err) {
      await session.abortTransaction();
      return "error, admin wasn't deleted";
    }

  }

  
  async restoreAdmin(data: RestoreAdminInput) {
    const user = await this.user.findByIdAndUpdate(data.id, {
      admin_isSoftDeleted: false,
      deleted: false,
      admin_deleteNote: ""
    }, {new: true});
    return user;
  }



  /* JWT RELATED FUNCTIONALITY */
  /************************************** */

  async validateUser(payload: JwtDto, operation: string): Promise<User> {
    const user = await this.user.findById(payload.userId);
  
    // if we find no user, we return null and authentication fails
    if (!user) 
        return user; 

    // check if token is the the most recent password token
    const isValidPasswordToken = user.isValidPasswordToken == payload.isValidPasswordToken;
    
    if (!isValidPasswordToken)
      return;

    // if we find user which is not admin(seller/customer) , we will not check 2FA
    if(!user.is_admin)
      return user;


    // check if  an admin(customer/seller) exists and 2fA is not enabled  
    if (!user.admin_isGoogleTwoFactorAuthenticationEnabled && !user.admin_isEmailOtpTwoFactorAuthenticationEnabled) {
      return user;
    }

    // if the user is admin(seller/customer) and google 2FA enabled
    // this route for authenticate google 2FA code so
    // we don't have to check if 2FA is authenticated
    if (user.admin_isGoogleTwoFactorAuthenticationEnabled && operation == "authenticateAdminGoogleTwoFactors"){
      return  user;
    }
  
    // if the user is admin(seller/customer) and email otp 2FA enabled
    // this route for authenticate email otp 2FA code so
    // we don't have to check if 2FA is authenticated  
    if (user.admin_isEmailOtpTwoFactorAuthenticationEnabled && operation == "authenticateAdminEmailOtpTwoFactors"){
      return  user;
    }


    // if the user is admin(seller, customer) and 2FA (google or/and email otp) enabled
    // he must be authenticated by (google or/and email otp) before we give him access to his resources
    if (user.admin_isEmailOtpTwoFactorAuthenticationEnabled && user.admin_isGoogleTwoFactorAuthenticationEnabled){
      if (payload.isAdminGoogleTwoFactorsAuthenticated && payload.isAdminEmailOtpTwoFactorsAuthenticated) {
        return user;
      }
    }
    else if (user.admin_isEmailOtpTwoFactorAuthenticationEnabled){
      if (payload.isAdminEmailOtpTwoFactorsAuthenticated)
        return user;
    }
    else {
      if (payload.isAdminGoogleTwoFactorsAuthenticated)
      return user;
    }
      

    /* mohammad albacha */
    /* populate added */
    // if (user.is_administrator){
    //  await user.populate('administrator_centralRoleId');
    // }

    
  }


  async getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    const user = await this.user.findById(id);
    // if (user.is_administrator){
    //   await user.populate('administrator_centralRoleId');
    // }
    /*mohammad albacha*/
    if (user.deleted) {
      throw new NotFoundException(`Sorry, your account has been deleted `);
    }
    return user;

  }

  async verifyTokenAndGetUser(token: string): Promise<User> {
    const { userId } = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    });
    const user = await this.user.findById(userId);
    // if (user.is_administrator){
    //   await user.populate('administrator_centralRoleId');
    // }
    /* mohammad albacha*/
    if (user.deleted) {
      throw new NotFoundException(`Sorry, your account has been deleted `);
    }
    return user;
  }

  generateTokens(payload: { userId: string, isAdminGoogleTwoFactorsAuthenticated: boolean, isAdminEmailOtpTwoFactorsAuthenticated: boolean, isValidPasswordToken: string  }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: string, isAdminGoogleTwoFactorsAuthenticated: boolean, isAdminEmailOtpTwoFactorsAuthenticated: boolean, isValidPasswordToken: string  }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: string,  isAdminGoogleTwoFactorsAuthenticated: boolean, isAdminEmailOtpTwoFactorsAuthenticated: boolean, isValidPasswordToken: string   }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }

  refreshToken(token: string) {
    try {
      const { userId, isAdminGoogleTwoFactorsAuthenticated, isAdminEmailOtpTwoFactorsAuthenticated, isValidPasswordToken } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        userId,
        isAdminGoogleTwoFactorsAuthenticated,
        isAdminEmailOtpTwoFactorsAuthenticated,
         isValidPasswordToken
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }




  /* 2FA WITH GOOGLE AUTHENTICATOR RELATED FUNCTIONALITY */
  /************************************** */
  /* */
  async generateAdminGoogleTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, 'Sadeed', secret);

    await this.user.findByIdAndUpdate(user.id, {
      admin_googleTwoFactorAuthenticationSecret: secret,
      admin_isGoogleTwoFactorAuthenticated: false
  })
    return {
      otpauthUrl
    }
  }


  async generateAdminGoogleQrCodeDataURL(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }

  async turnOnAdminGoogleTwoFactorAuthentication(userId: string) {
    await this.user.findByIdAndUpdate(userId, {
      admin_isGoogleTwoFactorAuthenticationEnabled: true
    })
  }

  async isAdminGoogleTwoFactorAuthenticationCodeValid(googleTwoFactorAuthenticationCode: string, user: User) {

    const isValid =  authenticator.verify({
      token: googleTwoFactorAuthenticationCode,
      secret: user.admin_googleTwoFactorAuthenticationSecret,
    });
    if (isValid){
      await this.user.findByIdAndUpdate(user.id,{
        admin_isGoogleTwoFactorAuthenticated: true
      })
    }
    return isValid
  }

  async loginWith2fa(userWithoutPsw: Partial<User>) {
    const payload = {
      email: userWithoutPsw.email,
      admin_isGoogleTwoFactorAuthenticationEnabled: !!userWithoutPsw.admin_isGoogleTwoFactorAuthenticationEnabled,
      admin_isGoogleTwoFactorAuthenticated: true,
    };

    return {
      email: payload.email,
      access_token: this.jwtService.sign(payload),
    };
  }

    /* 2FA WITH GOOGLE AUTHENTICATOR RELATED FUNCTIONALITY */
  /************************************** */
  /* */

  
  async turnOnAdminEmailOtpTwoFactorAuthentication(userId: string) {
    await this.user.findByIdAndUpdate(userId, {
      admin_isEmailOtpTwoFactorAuthenticationEnabled: true
    })
  }

  async generateAdminEmailOtpTwoFactorsCodeAndSendIt(user){
    const verificationCode = crypto.randomBytes(16).toString('hex');
    await this.user.findByIdAndUpdate(user.id, {
      admin_emailOtpTwoFactorCode: verificationCode,
      admin_isEmailOtpTwoFactorAuthenticated: false      
    })
    /*await*/ this.mailService.sendAdminEmailOtpTwoFactorsCodeNotification(user, verificationCode);
  }

  async isAdminEmailOtpTwoFactorsCodeValid(email: string, code: string){
    const user = await this.user.findOne({email: email});
    const isValid = user.admin_emailOtpTwoFactorCode == code;
    if (isValid){
      // to update
      // user.admin_isEmailOtpTwoFactorAuthenticated = true;
      // await user.save();
      await this.user.findByIdAndUpdate(user.id,{
        admin_isEmailOtpTwoFactorAuthenticated: true
      });
      return isValid;
    }
    
  }

}