import { Ability } from "@casl/ability";
import { Injectable, Type } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { BaseModel } from "src/common/base.model";
import { CurrentAbility } from "./common/auth/decorators/currentAbility.decorator";
import { Action } from "./common/authorization/casl/action.enum";
import * as mongoose from 'mongoose'
import { User, UserDocument } from "./common/user/user.model";
// import { AccessibleFieldsDocument, AccessibleModel, AccessibleRecordModel } from "@casl/mongoose";
////////////


// import { Normalize, AnyMongoAbility, Generics } from '@casl/ability';
// import type { Schema, QueryWithHelpers, Model, Document } from 'mongoose';

// declare type GetAccessibleRecords<T extends Document> = <U extends AnyMongoAbility>(ability: U, action?: Normalize<Generics<U>['abilities']>[0]) => QueryWithHelpers<T, T, QueryHelpers<T>>;
// declare type QueryHelpers<T extends Document> = {
//     accessibleBy: GetAccessibleRecords<T>;
// };
// export interface AccessibleRecordModel<T extends Document, K = unknown> extends Model<T, K & QueryHelpers<T>> {
//     accessibleBy: GetAccessibleRecords<T>;
// }

export interface AccessibleRecordQueryHelpers<Model> {
    accessibleBy(ability: Ability, action?: Action): mongoose.Query<any, mongoose.Document<Model> & AccessibleRecordQueryHelpers<Model>>,
}
/////////
@Injectable()
export default class ModelService {
    constructor(@InjectConnection() private connection: Connection) {

    }

    // accessibleModel<ModelType extends typeof BaseModel>(Model: ModelType, action: Action = Action.Read, @CurrentAbility() ability: Ability): mongoose.Model<ModelType & Document> & AccessibleModel<ModelType & Document & AccessibleFieldsDocument>{
    //     return this.model(Model).accessibleBy(ability, action) as mongoose.Model<ModelType>
    // }

    // model<ModelType extends typeof BaseModel>(Model: ModelType): mongoose.Model<ModelType & Document> & AccessibleModel<ModelType & Document & AccessibleFieldsDocument> {
    model<Model extends BaseModel>(Model: Type<Model>): mongoose.Model<Model & mongoose.Document, AccessibleRecordQueryHelpers<Model>> {
        return this.connection.models[Model.name] as any
    }

    /* mohammad albacha */
    getModel(name: string) {
        return this.connection.models[name];
    }

    // async test (@CurrentAbility() ability: Ability) {
    //     let MongoModel = this.model(User)
    //     let k = await MongoModel.find().accessibleBy(ability, Action.Create)
        
    // }
}