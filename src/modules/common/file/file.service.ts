import { Injectable } from "@nestjs/common";
import ModelService from "src/modules/models.service";
import { Shop } from "src/modules/shop/shop/shop.model";
import { User } from "../user/user.model";
import { MediaFile } from "./file.model";
import { classToPlain } from 'class-transformer'

// todo: file resolver
@Injectable()
export class MediaFileService {
    constructor(protected Models: ModelService){}

    async saveFile(file: Express.Multer.File, user:User, isPublic:boolean=true, shop:Shop=null) {
        const data = {
            user_id: user.id,
            isPublic: isPublic,
            mimeType: file.mimetype,
            name: file.originalname,
            originalName: file.originalname,
            path: file.path,
            size: file.size,
            filename: file.filename,
          } as MediaFile

        if (shop!== null) {
            data.shop_id = shop.id;
        }

        const result = await this.Models.model(MediaFile).create(data)
        const r = result.toJSON()
        delete r['path']
        return r
    }
}