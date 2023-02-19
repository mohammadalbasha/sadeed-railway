import { SchemaOptions } from "@nestjs/mongoose";


export const defaultSchemaOptions = {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
} as SchemaOptions

export const defaultLocaleSchemaOptions = {
    timestamps: false,
    _id: false
} as SchemaOptions