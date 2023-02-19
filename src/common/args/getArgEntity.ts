import { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { isArray } from "class-validator";
import { Action } from "src/modules/common/authorization/casl/action.enum";
import { BaseModel } from "../base.model";

export default async function getArgEntity(Model: typeof BaseModel, context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const entities = ctx.getContext().req.entities || {}
    ctx.getContext().req.entities = entities

    if (Model.name in entities) {
        return entities[Model.name]
    } else {
        const result = await getArgEntityRequest(Model, context)
        entities[Model.name] = result
        return result
    }
}

async function getArgEntityRequest(Model: typeof BaseModel, context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    const args = ctx.getArgs();
    const connection = ctx.getContext().req.connection
    const ability = ctx.getContext().req.ability

    // console.log(connection.models[Model.name])
    // console.log(connection.models[Model.name].accessibleBy(ability))
    // console.log(ability)

    if ('id' in args) {
        return await connection.models[Model.name].findById(args.id).accessibleBy(ability, Action.Read)
    }
    const name = Model.name.charAt(0).toLowerCase() + Model.name.slice(1) + '_id'
    if (name in args) {
        return await connection.models[Model.name].findById(args[name]).accessibleBy(ability, Action.Read)
    }
    for(const i in args) {
        return await connection.models[Model.name].findById(args[i].id).accessibleBy(ability, Action.Read)
    }
    

    return null;
}