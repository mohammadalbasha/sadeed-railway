import { subject } from "@casl/ability";
import { Model } from "mongoose";
import { BaseModel } from "src/common/base.model";
import { BusinessType } from "src/modules/central/businessType/businessType.model";
import { ConditionsTypes, PermisionsInput } from "src/modules/central/central-role/central-role.input";
import { CentralRole, Permisions } from "src/modules/central/central-role/central-role.model";
import { Country } from "src/modules/central/country/country.model";
import { Currency } from "src/modules/central/currency/currency.model";
import { Log } from "src/modules/central/log/log.model";
import { Plan } from "src/modules/central/plan/plan.model";
import { Shop } from "src/modules/shop/shop/shop.model";
import { MediaFile } from "../../file/file.model";
import { User } from "../../user/user.model";
import * as _ from 'lodash';
export enum Action {
  Manage = 'manage',
  Read = 'read', // read one
  // List = 'list', // list many
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
  Subscribe = 'subscribe',
  Init = 'init',
}


export const actionsMap = new Map<String, Action>();
actionsMap.set('read', Action.Read);
actionsMap.set('manage', Action.Manage);
actionsMap.set('create', Action.Create);
actionsMap.set('update', Action.Update);
actionsMap.set('delete', Action.Delete);
actionsMap.set('init', Action.Init);
actionsMap.set('subscribe', Action.Subscribe);




export const modelsMap = new Map<String, typeof BaseModel>();
modelsMap.set('Log', Log);
modelsMap.set('Shop', Shop);
modelsMap.set('Country', Country);
modelsMap.set('BusinessType', BusinessType);
modelsMap.set('User', User);
modelsMap.set('CentralRole', CentralRole)
modelsMap.set('Currency', Currency)
modelsMap.set('MediaFile', MediaFile)



  /* *********** 
  MAXIMUM PERMISIONS CAN BE LIKE THIS FLEXIBLE OBJECT 
  **************** */


  //  const maximumPermisions : Permisions[]= [{
  //         subject: 'Log',
  //         action: Action.Read,
  //         fields:  ['type', 'endpoint', 'user_id', 'createdAt', 'hasErrors'] ,
  //         conditions: {
  //           user_id: {
  //             type : ConditionsTypes.ID
  //           },
  //           endpoint: {
  //             type: ConditionsTypes.MULTI,
  //             value: ['central'],
    
  //           },
  //           type: {
  //             type: ConditionsTypes.MULTI,
  //             value: ['query']
  //           },
  //           operationName: {
  //             type: ConditionsTypes.VALUI,
  //             value: 'addRole',
  //           },
            
  //           hasErrors: {
  //             type: ConditionsTypes.VALUI,
  //             value: false
  //           }
            
  //         }
  //       },
  //       {
  //         subject: "User",
  //         action: Action.Manage
  //       },
  //       {
  //         subject: 'Log',
  //         action: Action.Read,
  //         fields:  ['type', 'endpoint', 'user_id', 'createdAt'] ,
  //         conditions: {
  //           user_id: {
  //             type : ConditionsTypes.ID
  //           },
  //           endpoint: {
  //             type: ConditionsTypes.MULTI,
  //             value: ['central'],
    
  //           },
  //           type: {
  //             type: ConditionsTypes.MULTI,
  //             value: ['query', 'mutation']
  //           }
  //         }
  //       },
  //     ]

const maximumPermisions: Permisions[] = [
  {
    subject: 'Log',
    action: Action.Manage 
  }, 
  {
    subject: 'User',
    action: Action.Manage,
  }, 
  {
    subject: 'Plan',
    action: Action.Manage,
  }, {
    subject: 'Currency',
    action: Action.Manage,
  }, {
    subject: 'PaymentMethod',
    action: Action.Manage,
  }, {
    subject: 'PayoutMethod',
    action: Action.Manage,
  }, {
    subject: 'BusinessType',
    action: Action.Manage,
  }, 
  {
    subject: 'Speciality',
    action: Action.Manage,
  }, {
    subject: 'Ip',
    action: Action.Manage,
  }, {
    subject: 'Country',
    action: Action.Manage,
  },
  {
    subject: 'Country',
    action: Action.Manage,
    fields: ["code"]

  },
   {
    subject: 'Ticket',
    action: Action.Manage,
  }, 
  {
    subject: 'TicketCategory',
    action: Action.Manage,
  }, 
  {
    subject: 'UserDocument',
    action: Action.Manage,
  }, 
  {
    subject: 'TicketMessage',
    action: Action.Manage,
  }, 
  {
    subject: 'UserDocumentType',
    action: Action.Manage,
  }, 
  {
    subject: 'CentralRole',
    action: Action.Manage
  }, 
  {
    subject: 'MediaFile',
    action: Action.Read
  },
  {
    subject: 'MediaFile',
    action: Action.Manage,
    conditions: {
      user_id: {
        type: ConditionsTypes.ID
      }
    }
  }
] 

export const maximumPermisionsPosibilities = new Map<string, Permisions[]>();

maximumPermisions.forEach(maximumPermision => {
  switch(maximumPermision.action){
    case 'manage':{
      
      ["manage", "read", "create", "update", "delete", "init", "subscripe"].forEach(action => {
        maximumPermisionsPosibilities.set(maximumPermision.subject, [...(maximumPermisionsPosibilities.get(maximumPermision.subject) || []), {
          subject: maximumPermision.subject,
          action: action,
          fields: [...(maximumPermision.fields || [])],
          conditions: {...(maximumPermision.conditions || {})}
        } ]);        
      })
      break;
    }

    default:
      maximumPermisionsPosibilities.set(maximumPermision.subject, [...(maximumPermisionsPosibilities.get(maximumPermision.subject) || []), {
        subject: maximumPermision.subject,
        action: maximumPermision.action,
        fields: [...(maximumPermision.fields || [])],
        conditions: {...(maximumPermision.conditions || {})}
      } ]);
  }
}
)
  

export const maximumPermisionsPosibilitiesArray: Permisions[] = [];
maximumPermisionsPosibilities.forEach((permisions, key) => {
  permisions.forEach(permision => {
    maximumPermisionsPosibilitiesArray.push({
      subject: permision.subject,
      action: permision.action,
      fields: permision.fields?.length > 0 ? [...permision.fields] : undefined,
      conditions: permision.conditions ? {...permision.conditions} : undefined 
    })
  })
});


export function checkCentralPermision(subject: string, new_permision: Permisions) {
  const permisions =  maximumPermisionsPosibilities.get(subject);
  if (permisions == undefined)
    return false;

  let foundedPermision = false;
  permisions.forEach(permision => {
    if (_.isEqual(permision, new_permision))
      foundedPermision = true
  })
  return foundedPermision;
}



// const maximumPermisions = {
//   'Plan': 'manage',
//   'Log': 'manage',
//   'Shop': 'manage',
//   'User': 'manage',
//   'BusinessType': 'manage',
//   'CentralRole': 'manage',
//   'MediaFile': 'manage'
// } as Object;

// export const maximumPermisionsPosibilities = new Map<string, string[]>();
// for (const key in maximumPermisions){
//   switch(maximumPermisions[key]){
//     case 'manage':{
//       maximumPermisionsPosibilities.set(key, [ Action.Manage]);
//       maximumPermisionsPosibilities.set(key, [...maximumPermisionsPosibilities.get(key), 'read']);
//       maximumPermisionsPosibilities.set(key, [...maximumPermisionsPosibilities.get(key), 'create']);
//       maximumPermisionsPosibilities.set(key, [...maximumPermisionsPosibilities.get(key), 'update']);
//       maximumPermisionsPosibilities.set(key, [...maximumPermisionsPosibilities.get(key), 'delete']);
//       maximumPermisionsPosibilities.set(key, [...maximumPermisionsPosibilities.get(key), 'init']);
//       maximumPermisionsPosibilities.set(key, [...maximumPermisionsPosibilities.get(key), 'subscribe']);
    
//       break;
//     }

//     default : {
//       maximumPermisionsPosibilities.set(key, [maximumPermisions[key]]);
//     }
//   }
// }

// export const maximumPermisionsPosibilitiesArray: Permisions[] = [];
// maximumPermisionsPosibilities.forEach((permisions, key) => {
//   permisions.forEach(permision => {
//     maximumPermisionsPosibilitiesArray.push({
//       subject: key,
//       action: permision
//     })
//   })
// });

// export function checkCentralPermision(subject: string, action: string) {
//   const permissions =  maximumPermisionsPosibilities.get(subject);
//   return permissions !== undefined && permissions.includes(action);
// }



