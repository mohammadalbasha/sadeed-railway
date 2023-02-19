// import { PrismaClient } from "@prisma/client";
import { BaseModel } from "./base.model";

// type PrismaModels = keyof Omit<
//   PrismaClient,
//   '$disconnect' | '$connect' | '$executeRaw' | '$queryRaw' | '$transaction' | '$on' | '$use' |
//   'disconnect' | 'connect' | 'executeRaw' | 'queryRaw' | 'transaction' | 'on'
// >

export type Models = typeof BaseModel;