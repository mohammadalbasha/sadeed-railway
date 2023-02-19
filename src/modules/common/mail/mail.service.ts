/* mohammad albacha */
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Locale } from 'src/common/lang.constants';
import { User } from '../user/user.model';


@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendAdministratorAccountCreationNotification( user: User ) {
    let subject = "";
    switch(user.locale){
      case "en":
        subject = "new Sedeed Administrator Account has been created for you";
        break;
      
      case "ar":
        subject = "تم إنشاء حساب خاص بك كمسؤول في منصة سديد"
        break;

      default:
        subject = "new Sedeed Administrator Account has been created for you";
    }

    
    let template_language = user.locale || "en";
    const template = `./newAccount.${template_language}.hbs`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: subject,
      template: template, 
      context: { 
        name: user.fullName,
        email: user.email,
        createdDate: user.createdAt,
        phone: user.phone
      },
    }).catch(err => {
      console.log(err)
    });
  }



  async sendEnableOrDisableAdministratorNotification( user: User, administrator: User ) {
    let subject = "";
    let action = ""
    switch(user.locale){
      case "en":
        subject = user.isActive? "your Sadeed account has been enabled": "your Sadeed account has been disabled";
        action = user.isActive? "enabled" : "disabled";
        break;
      
      case "ar":
        subject = user.isActive? "تم تفعيل حسابك في منصة سديد" : "تم الغاء تفعيل حسابك في منصة سديد"
        action = user.isActive? "تفعيل" : "الغاء تفعيل";
        break;

      default:
        subject = user.isActive? "your account has been enabled": "your account has been disabled";
        action = user.isActive? "enabled" : "disabled";
      }


    
    let template_language = user.locale || "en";
    const template = `./administrator_enabledisable.${template_language}.hbs`;
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: subject,
      template: template, 
      context: { 
          name: user.fullName,
          action: action,
          email: administrator.email,
          phone: administrator.phone
      },
    }).catch(err => {
      console.log(err)
    })
    ;
  }


  async sendAdministratorIncorrectLoginNotification( user: User, administrator: User, type: string, disable: boolean, value: string, browser ) {
    let subject = "";
    let action ="";
    let context : "";
    switch(user.locale){
      case "en":
        subject = "incorrect login tries to your Sadeed account";
        action = type;

        break;
      
      case "ar":
        subject = "هناك محاولات تسجيل دخول خاطئة إلى حسابك في منصة سديد"
        action = (type == "password")? "كلمة السر" : "الايبي"
        break;

      default:
        subject = "incorrect login tries to your Sadeed account";
        action = type;
      }



    
    let template_language = user.locale || "en";
    const template = disable? `./administrator_incorrectLogin.${template_language}.disable.hbs` : `./administrator_incorrectLogin.${template_language}.disable.hbs`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: subject,
      template: template, 
      context: { 
          name: user.fullName,
          action: action,
          browser: browser,
          value: value,
          date: new Date(),
          email: administrator.email,
          phone: administrator.phone? administrator.phone : administrator.phone 
      },
    }).catch(err => {
      console.log(err)
    })
    ;
  }

  
  async sendAdministratorTwoFactorsCodeNotification( user: User, code: String ) {
    let subject = "";
    switch(user.locale){
      case "en":
        subject = "Two Factors Code verification to to your Sadeed account";
        break;
      
      case "ar":
        subject = "رمز تأكيد لحسابك في منصة سديد"

        break;

      default:
        subject = "Two Factors Code verification to to your Sadeed account";

      }



    
    let template_language = user.locale || "en";
    const template = `./administratorTwoFactorsCode.${template_language}.hbs`

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: subject,
      template: template, 
      context: { 
          name: user.fullName,
          code: code
        },
    }).catch(err => {
      console.log(err)
    })
    ;
  }

  async sendDeleteAdministratorNotification( user: User, administrator: User ) {
    let subject = "";
    switch(user.locale){
      case "en":
        subject = "your account has been deleted";
        break;
      
      case "ar":
        subject = "تم حذف معلومات حسابك  في منصة سديد"
        break;

      default:
        subject = "your account has been deleted";
      }


    
    let template_language = user.locale || "en";
    const template = `./deleteAdministrator.${template_language}.hbs`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: subject,
      template: template, 
      context: { 
          name: user.fullName,
          email: administrator.email,
          phone: administrator.phone? administrator.phone : administrator.phone 
     
        },
    }).catch(err => {});
  }


  async sendUpdateInformationsNotification( user: User, administrator: User ) {
    let subject = "";
    switch(user.locale){
      case "en":
        subject = "your Sadeed Account login credential has been updated";
        break;
      
      case "ar":
        subject = "تم تعديل معلومات تسجيل الدخول الخاصة بحسابك في منصة سديد "
        break;

      default:
        subject = "your Sadeed Account login credential has been updated";
      }


    
    let template_language = user.locale || "en";
    const template = `./administrator.updateCredentials.${template_language}.hbs`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: subject,
      template: template, 
      context: { 
          name: user.fullName,
          email: administrator.email,
          phone: administrator.phone? administrator.phone : administrator.phone 
      },
    }).catch(err => {});
  }



  async sendUserAccountCreatedByAdministratorNotification( user: User, link: string ) {
    let subject = "";
    switch(user.locale){
      case "en":
        subject = "new Sadeed account has been created for you";
        break;
      
      case "ar":
        subject = "تم إنشاء حساب لك في منصة سديد";
        break;

      default:
        subject = "new Sadeed account has been created for you"; 
           }


    
    let template_language = user.locale || "en";
    const template = `./verifyUserCreatedByAdministrator.${template_language}.hbs`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: subject,
      template: template, 
      context: { 
        name: user.fullName,
        link: link   
      },
    }).catch(err => {});
  }

  

  async   sendUserAccountUpdatedByAdministratorNotification ( user: User, link: string, updatedData: any ) {
    let subject = "";
    switch(user.locale){
      case "en":
        subject = "your Sadeed account informations has been updated";
        break;
      
      case "ar":
        subject = "تم تعديل بعض معلومات حسابك  في منصة سديد";
        break;

      default:
        subject = "your Sadeed account informations has been updated";
           }


    
    let template_language = user.locale || "en";
    const template = `./updateUserByAdministrator.${template_language}.hbs`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: subject,
      template: template, 
      context: { 
        name: user.fullName,
        link: link,
        updatedData

      },
    }).catch(err => {});
  }


  async sendResetUserPasswordRequestByAdministratorNotification( user: User, link: string ) {
    let subject = "";
    switch(user.locale){
      case "en":
        subject = "Sadeed account password resetting";
        break;
      
      case "ar":
        subject = "إعادة تعيين كلمة المرور لحسابك في منصة سديد";
        break;

      default:
        subject = "Sadeed account password resetting";
           }


    
    let template_language = user.locale || "en";
    const template = `./resetUserPasswordByAdministrator.${template_language}.hbs`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: subject,
      template: template, 
      context: { 
        name: user.fullName,
        link: link   
      },
    }).catch(err => {});
  }

  async sendDisableAdminNotification(user: User, administrator: User) {
    let subject = "";
    let action = ""
    switch(user.locale){
      case "en":
        subject =  "your Sadeed account has been disabled";
        break;
      
      case "ar":
        subject =  "تم الغاء تفعيل حسابك في منصة سديد"
        break;

      default:
        subject =  "your Sadeed account has been disabled";
      }


    
    let template_language = user.locale || "en";
    const template = `./disableUser.${template_language}.hbs`;
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: subject,
      template: template, 
      context: { 
          name: user.fullName,
          email: administrator.email,
          phone: administrator.phone,
          reason: user.enableOrDisableNote,
          date: new Date()
      },
    }).catch(err => {
      console.log(err)
    })
    ;
  }


  async sendEnableAdminNotification(user: User, link: string) {
    let subject = "";
    let action = ""
    switch(user.locale){
      case "en":
        subject =  "your Sadeed account has been enabled";
        break;
      
      case "ar":
        subject =  "تم  تفعيل حسابك في منصة سديد"
        break;

      default:
        subject =  "your Sadeed account has been enabled";
      }


    
    let template_language = user.locale || "en";
    const template = `./enableUser.${template_language}.hbs`;
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: subject,
      template: template, 
      context: { 
          name: user.fullName,
          link: link
      },
    }).catch(err => {
      console.log(err)
    })
    ;
  }
  
  async sendSoftDeleteAdminNotification (user: User, reason: string){
    let subject = "";
    
    switch(user.locale){
      case "en":
        subject =  "your Sadeed account has been closed";
        break;
      
      case "ar":
        subject =  "تم إغلاق حسابك في منصة سديد"
        break;

      default:
        subject =  "your Sadeed account has been closed";
      }


    
    let template_language = user.locale || "en";
    const template = `./deleteUser.${template_language}.hbs`;
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: subject,
      template: template, 
      context: { 
          name: user.fullName,
          reason: reason,
          date: new Date()
        },
    }).catch(err => {
      console.log(err)
    })
    ;

  } 

  async sendAdminEmailOtpTwoFactorsCodeNotification(user: User, code: string){
    let subject = "";
    switch(user.locale){
      case "en":
        subject = "Two-Factors Authentication Code to to your Sadeed account";
        break;
      
      case "ar":
        subject = "رمز تأكيد لحسابك في منصة سديد"

        break;

      default:
        subject = "Two-Factors Authentication Code to to your Sadeed account";

      }



    
    let template_language = user.locale || "en";
    const template = `./userTwoFactorsCode.${template_language}.hbs`

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: subject,
      template: template, 
      context: { 
          name: user.fullName,
          code: code
        },
    }).catch(err => {
      console.log(err)
    })
    ;

  }

}


