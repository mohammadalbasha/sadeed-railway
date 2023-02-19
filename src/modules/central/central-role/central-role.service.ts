import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCentralRoleInput } from './central-role.input';
import { CentralRole } from './central-role.model';

@Injectable()
export class CentralRoleService  {
    constructor(@InjectModel('CentralRole') private model: Model<CentralRole>){}

    async create (data: CreateCentralRoleInput){
        return this.model.create(data);
    }
}
