// import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PasswordService } from '../auth/password.service';
import { ChangePasswordInput,  UpdateUserInput, UserFilter } from './common/user.input';
import { AdminFilter, AdministratorFilter, UpdateAdministratorInput, UpdateSuperAdminInput } from './central/user.input';
import { User, UserDocument } from './user.model';
import * as mongoose from 'mongoose' ;
import { AccessibleRecordQueryHelpers } from 'src/modules/models.service';
import { Ability } from '@casl/ability';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
const crypto = require("crypto");


@Injectable()
export class UserService {
  constructor(
    // private prisma: PrismaService,
    private passwordService: PasswordService,
    @InjectModel(User.name) private readonly user: mongoose.Model<User & UserDocument, AccessibleRecordQueryHelpers<User>>,
  ) {}

  async updateUser(userId: string, newUserData: UpdateUserInput | UpdateAdministratorInput | UpdateSuperAdminInput) {
    return await this.user.findByIdAndUpdate(userId, newUserData, {new: true})
    // return await this.prisma.user.update({
    //   data: newUserData,
    //   where: {
    //     id: userId,
    //   },
    // });
  }

  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordInput
  ) {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword
    );

    const isValidPasswordToken = crypto.randomBytes(16).toString('hex');

    return await this.user.findByIdAndUpdate(userId, {
      pass: hashedPassword,
      isValidPasswordToken: isValidPasswordToken
    })
    // return this.prisma.user.update({
    //   data: {
    //     pass: hashedPassword,
    //   },
    //   where: { id: userId },
    // });

  }
      /*mohammad albacha */
   async fetchUsers(filterBy: UserFilter, ability: Ability, {limit, skip }: PaginationArgs){
    const users = await  this.user.find({
      ...filterBy
    })
    .skip(skip)
    .limit(limit)
    .accessibleBy(ability);
    
    const totalCount = await this.user.countDocuments({...filterBy}).accessibleBy(ability);
    return {
      items: users,
      totalCount
    }
   
  }   

  async fetchAdministratorUsers(filterBy: AdministratorFilter, ability: Ability, {limit, skip }: PaginationArgs){
    const filterByAsMongo = {...filterBy} as any;
    if (filterBy.administrator_centralRoleId)
    filterByAsMongo.administrator_centralRoleId = {
      $elemMatch : {
        $in : filterBy.administrator_centralRoleId
      }
    }
    filterByAsMongo.is_administrator = true;
    if (filterBy.fullName){
      filterByAsMongo.fullName = { $regex: new RegExp(filterBy.fullName), $options: 'i' } 
    }

    if (filterBy.username){
      filterByAsMongo.name = { $regex: new RegExp(filterBy.username), $options: 'i' } 
    }
    const users = await  this.user.find({
      ...filterByAsMongo
    })
    .skip(skip)
    .limit(limit)
    .accessibleBy(ability);
    
    const totalCount = await this.user.countDocuments({...filterByAsMongo}).accessibleBy(ability);
    return {
      items: users,
      totalCount
    }
   
  }
  async fetchAdminUsers(filterBy: AdminFilter, ability: Ability, {limit, skip }: PaginationArgs){
    const { admin_company, fullName,  ...rest  } = filterBy ;
    const filterByAsMongo = {...rest} as any;
    if (filterBy.admin_company)
    {
      for (let key in filterBy.admin_company){
        filterByAsMongo[`admin_company.${key}`] = filterBy.admin_company[key];
      }
    }
    if (filterBy.fullName){
      filterByAsMongo.fullName = { $regex: new RegExp(filterBy.fullName), $options: 'i' } 
    }

    if (filterBy.username){
      filterByAsMongo.name = { $regex: new RegExp(filterBy.username), $options: 'i' } 
    }
    filterByAsMongo.is_administrator = false;
    filterByAsMongo.is_super_admin = false;

    const users = await  this.user.find({
      ...filterByAsMongo
    })
    .skip(skip)
    .limit(limit)
    .accessibleBy(ability);
    
    const totalCount = await this.user.countDocuments({...filterByAsMongo}).accessibleBy(ability);
    return {
      items: users,
      totalCount
    }
   
  }   
  }
   
  
  

  


