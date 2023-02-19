import { Ability, ForbiddenError } from "@casl/ability";
import { ExecutionContext, ForbiddenException, Type } from "@nestjs/common";
import * as DataLoader from "dataloader";
import { Connection } from "mongoose";
import * as mongoose from "mongoose"
import { BaseModel } from "../base.model"

export default class BaseDataLoader {
    private loaders = new Map()

    getLoader<Model extends BaseModel>(Model: Type<Model>, connection: Connection, ability: Ability): DataLoader<string, typeof Model> {
        if (!this.loaders.has(Model.name)) {
            this.loaders.set(Model.name, new DataLoader<string, Model>(async (ids) => {
                let items = []
                let uniqueIds = [... new Set(ids.map(id => id.toString()))]
                try {
                    items = await (connection.models[Model.name] as any).find({_id: {$in: uniqueIds}}).accessibleBy(ability).exec() as Model[]
                } catch (exception) {
                    throw new ForbiddenException(exception.message)
                }
                const itemsMap = new Map(items.map((item) => [item.id, item]));
                const results = ids.map((id) => {
                    if (!itemsMap.has(id.toString())) throw new ForbiddenException('ID: '+id.toString()+', not found or not enough permissions to "read" "'+Model.name+'"') // should fix if he has no permissions
                    const item = itemsMap.get(id.toString())
                    return item

                    // console.log(item.accessibleFieldsBy(ability))
                    
                    // return item.accessibleFieldsBy(ability)
                })
                return results;
            }))
        }

        return this.loaders.get(Model.name)
    }
}
