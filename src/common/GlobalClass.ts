import { InternalServerErrorException } from "@nestjs/common";
import { registerEnumType } from "@nestjs/graphql";
import { env } from "process";

export enum Endpoint {
    central="central", admin="admin", front="front"
}
registerEnumType(Endpoint, {name: "Endpoint", description: ""});


export default class GlobalClass {
    public static isCentral = (env.CentralOrAdminOrFront === 'central')
    public static isAdmin = (env.CentralOrAdminOrFront === 'admin')
    public static isFront = (env.CentralOrAdminOrFront === 'front')

    public static endpoint:Endpoint = (env.CentralOrAdminOrFront === 'central'?Endpoint.central: (env.CentralOrAdminOrFront === 'admin'?Endpoint.admin: Endpoint.front))

}