import { Args, Mutation, Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import BaseAdminResolver from 'src/common/baseCRUD.resolver';
import { Injectable } from '@nestjs/common';
import { Ip, PaginatedIp } from './ip.model';
import { CreateIpInput, IpOrderInput, UpdateIpInput } from './ip.input';

@Injectable()
@Resolver(() => Ip)
export class IpResolver extends BaseAdminResolver(Ip, PaginatedIp, IpOrderInput, CreateIpInput, UpdateIpInput ) {
     
}
