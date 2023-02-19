import { Args, Mutation, Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import BaseAdminResolver from 'src/common/baseCRUD.resolver';
import { CentralRole, PaginatedCentralRole, Permisions } from './central-role.model';
import { AddPermisionInput, CentralRoleOrderInput, CreateCentralRoleInput, UpdateCentralRoleInput } from './central-role.input';
import { CentralRoleService } from './central-role.service';
import { BadRequestException, Inject, Injectable, NotFoundException, Type } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import ModelService from 'src/modules/models.service';
import { BaseModel } from 'src/common/base.model';
import { User } from 'src/modules/common/user/user.model';

@Injectable()
@Resolver(() => CentralRole)
export class CentralRoleResolver extends BaseAdminResolver(CentralRole, PaginatedCentralRole, CentralRoleOrderInput, CreateCentralRoleInput, UpdateCentralRoleInput ) {

    constructor(private centralRoleService: CentralRoleService,
        @Inject('PUB_SUB') protected pubSub:PubSub,
            protected Models: ModelService){
            super(pubSub, Models);
    }

    protected getDeleteRelations(): [{ model: Type<BaseModel>; fieldName: string; }?] {
      return [{
        model: User,
        fieldName: "centralRoleId"
      }]
    }

    // @Mutation(() => CentralRole)
    // createCentralRoleByService(@Args('data') data: CreateCentralRoleInput){
        
    //     // TO DO
    //     // I should be able to Inject centralRoleService but I can not
    //     // return this.centralRoleService.create(data);

    //     // Now we create, Update, Delete , Fetch, Based on the BaseResolver 
    // }

    // @Mutation(() => CentralRole)
    // async addPermisionToCentralRole(@Args('data') data : AddPermisionInput){

    //     const centralRole = await this.model.findById(data.id);
    //     if (!centralRole){
    //         throw new NotFoundException("role not found");
    //     }
                

    //     centralRole.permisions?.forEach(permision => {
    //         if (deepEqual(permision, data.permision)){
    //             console.log("kaka")
    //             throw new BadRequestException("permision already existed")
        
    //         }
    //             })
        
    //     const result = await this.model.updateOne({id:centralRole.id},{
    //         $push:{
    //             permisions: data.permision
    //         }
    //     })
    //     console.log(result)

    //     return this.model.findById(centralRole.id);
    // }   

     
}
function deepEqual(x, y) {
    const ok = Object.keys, tx = typeof x, ty = typeof y;
    return x && y && tx === 'object' && tx === ty ? (
      ok(x).length === ok(y).length &&
        ok(x).every(key => deepEqual(x[key], y[key]))
    ) : (x === y);
  }