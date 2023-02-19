import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from "@casl/ability";
import { ConsoleLogger, Injectable, Post, Type } from "@nestjs/common";
import { BaseModel } from "src/common/base.model";
import { Shop } from "src/modules/shop/shop/shop.model";
import { BusinessType } from "src/modules/central/businessType/businessType.model";
import { Country } from "src/modules/central/country/country.model";
import { Speciality } from "src/modules/central/speciality/speciality.model";
import { Plan } from "src/modules/central/plan/plan.model";
import { User } from "../../user/user.model";
import { Action, actionsMap, modelsMap } from "./action.enum";
import { TicketCategory } from "src/modules/tickets/ticketCategory.model";
import { Ticket } from "src/modules/tickets/ticket.model";
import { TicketMessage } from "src/modules/tickets/ticketMessage.model";
import { env } from "process";
import GlobalClass, { Endpoint } from "src/common/GlobalClass";
import { Currency } from "src/modules/central/currency/currency.model";
import { PaymentMethod } from "src/modules/central/paymentMethod/paymentMethod.model";
import { PayoutMethod } from "src/modules/central/payoutMethod/payoutMethod.model";
import { Log } from "src/modules/central/log/log.model";
import { UserPayoutMethod } from "src/modules/shop/payout/userPayoutMethod.model";
import { UserPayoutRequest } from "src/modules/shop/payout/userPayoutRequest.model";
import { MediaFile } from "../../file/file.model";
import { UserDocumentType } from "src/modules/shop/document/documentType.model";
import { UserDocument, UserDocumentStatus } from "src/modules/shop/document/document.model";
import { Connection } from "mongoose";
import { MongooseModule } from "@nestjs/mongoose";
import { ModelsModule } from "src/modules/models.module";
import ModelService from "src/modules/models.service";
import { ConditionsTypes } from "src/modules/central/central-role/central-role.input";
import { CentralRole } from "src/modules/central/central-role/central-role.model";
import { Ip } from "../../auth/ip/ip.model";

// type Subjects = InferSubjects<PrismaModels> | 'all';
// export type Subjects = PrismaModels | 'all' | typeof BaseModel;
export type Subjects = typeof BaseModel | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {

  
  createForUser(user: User) {
    
    if (!user) return null;

    const ability = new CaslAbility();
    
    if (GlobalClass.isCentral) {
      if (user.is_super_admin) {
        

        //Central
        ability.can(Action.Manage, Plan);
        ability.can(Action.Manage, Currency)
        ability.can(Action.Manage, PaymentMethod)
        ability.can(Action.Manage, PayoutMethod)
        ability.can(Action.Manage, Country); 
        ability.can(Action.Manage, Country, null, ["code"]); //do we need code here?
        ability.can(Action.Manage, BusinessType);
        ability.can(Action.Manage, Speciality);

        ability.can(Action.Manage, Log);
        ability.can(Action.Manage, User);

        // Tickets
        ability.can(Action.Manage, TicketCategory)
        ability.can(Action.Manage, Ticket) // only super can udpate, central and admins can't
        ability.can(Action.Manage, TicketMessage) // only super can udpate, central and admins can't

        // Documents
        ability.can(Action.Manage, UserDocumentType)
        ability.can(Action.Manage, UserDocument)

        // Files
        ability.can(Action.Read, MediaFile)
        ability.can(Action.Manage, MediaFile, {user_id: user.id})

        /*mohammad albacha */
        //Central Roles
        ability.can(Action.Manage, CentralRole)

        /*mohammad albacha */
        //Ipss
        ability.can(Action.Manage, Ip)

        

       }
      // give permissions to admin
      else if (user.is_administrator){
        /* mohammad albacha*/
        // this dummy code written by me 
        //ability.can(Action.Manage, Log)

        // user.administrator_centralRole?.forEach(central_role => {
        //   central_role.permisions?.forEach(permision => {
        //     ability.can(actionsMap.get(permision.action), modelsMap.get(permision.subject));
        //   } )
        // })
        
        user.administrator_centralRole?.forEach(central_role => {
          central_role.permisions?.forEach(permision => {
            const subject = permision.subject;
            const action = permision.action;
            const fields = permision.fields?.length > 0 ? [...permision.fields] : undefined;
            const conditions = {}
            for (let key in permision.conditions){
              switch(permision.conditions[key].type){
                case ConditionsTypes.ID:
                  conditions[key] = user.id;
                  break;
                
                case ConditionsTypes.MULTI:
                  conditions[key] = {$in: [...(permision.conditions[key].value as string[])]};
                  break;
                
                case ConditionsTypes.VALUI:
                  conditions[key] = permision.conditions[key].value;
                  break;
              }
            
            }

            if (fields && fields.length > 0 ){
              // @ts-ignore
              ability.can(actionsMap.get(action), modelsMap.get(subject), {...conditions}, [...fields] );       
                  
            }
            else{
              ability.can(actionsMap.get(action), modelsMap.get(subject), {...conditions} );
            }
            

          } )
        })
        
      }
     
    }

    if (GlobalClass.isAdmin) {

      
      // Central
      ability.can(Action.Read, Plan, {isActive: true});
      ability.can(Action.Read, Currency, {isActive: true})
      ability.can(Action.Read, PaymentMethod, {isActive: true})
      ability.can(Action.Read, PayoutMethod, {isActive: true})
      ability.can(Action.Read, Country, {isActive: true});
      ability.can(Action.Read, BusinessType, {isActive: true});
      ability.can(Action.Read, Speciality, {isActive: true});

      if (!user.countryId) {
        ability.can(Action.Init, User)
      } else {
        // Files
        ability.can(Action.Read, MediaFile, {isPublic: true})
        ability.can(Action.Manage, MediaFile, {user_id: user.id})
        // ability.can(Action.Manage, MediaFile, {shop_id: shop.id})

        // Documents
        ability.can(Action.Read, UserDocument, {user_id: user.id, status: {$in: [UserDocumentStatus.requested, UserDocumentStatus.processing, UserDocumentStatus.uploaded]} as any})
        ability.can(Action.Update, UserDocument, {user_id: user.id, status: {$in: [UserDocumentStatus.requested, UserDocumentStatus.processing, UserDocumentStatus.uploaded]} as any})
        ability.can(Action.Read, UserDocumentType)

        // Shop User
        ability.can(Action.Read, User, {id: user.id})
        ability.can(Action.Update, User, {id: user.id})
        ability.can(Action.Delete, User, {id: user.id, })

        

        // Shop
        ability.can(Action.Manage, Shop, {owner_id: user.id});

        // Tickets
        ability.can(Action.Read, TicketCategory)
        ability.can(Action.Manage, Ticket, {user_id: user.id})
        ability.can(Action.Manage, TicketMessage)

        // Payout
        ability.can(Action.Manage, UserPayoutMethod, {user_id: user.id})
        ability.can(Action.Manage, UserPayoutRequest, {user_id: user.id})

      }
      

      

    }

    if (GlobalClass.isFront) {
    }

    // if (user.role == Role.Admin) {
        // ability.can(Action.Manage, 'all'); // read-write access to everything
    // } else {
        // ability.can(Action.Read, 'all'); // read-only access to everything
    // }
    

    // Must be this
    // storeId in every related subject
    // ability.can(Action.Manage, [Store], { id: { $in: [userStoreIds]}})
    // ability.can(Action.Manage, [Product, Store], { storeId: { $in: [userStoreIds]}})

    // ability.can(Action.Manage, [Product, Store], { userId: user.id })
    // ability.cannot(Action.Delete, Product, { userId: user.id, name: "soso" });

    // ability.can(Action.Read, ['shop'])
    // ability.cannot(Action.Delete, Product, { name: "soso" });




    return ability.build()
  }


  createForGuest() {
    const ability = new CaslAbility();
    ability.can(Action.Read, MediaFile, {isPublic: true})
    return ability.build()
  }
}


class CaslAbility {
  protected innerCan
  protected innerBuild
  protected innerCannot
  constructor() {
    const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>);
    this.innerCan = can
    this.innerCannot = cannot
    this.innerBuild = build
  }

  can <Model extends BaseModel>(action:Action, subject: Type<Model>, conditions?:{[P in keyof Model]?: Model[P]}, fields?: [keyof Model], cannotFields?: [keyof Model]) {
    this.innerCan(action, subject.name, fields, conditions)
    if (cannotFields) {
      this.innerCannot(action, subject.name, cannotFields, conditions)
    }
  }

  /* mohammad albacha */ 
  can2 <Model extends BaseModel>(action:Action, subject: string, conditions?:{[P in keyof Model]?: Model[P]}, fields?: [keyof Model], cannotFields?: [keyof Model]) {
    this.innerCan(action, subject , fields, conditions)
    if (cannotFields) {
      this.innerCannot(action, subject , cannotFields, conditions)
    }
  }

  cannot <Model extends typeof BaseModel>(action:Action, subject: Model, conditions?:{[P in keyof Model]?: Model[P]}, fields?: [keyof Model]) {
    this.innerCannot(action, subject.name, fields, conditions)
  }

  build () {
    return this.innerBuild({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item:BaseModel) => {
        return (item.constructor as any).modelName as ExtractSubjectType<Subjects>
        // return (item as any)._prismaTypeName; 
      },
    });
  }

}