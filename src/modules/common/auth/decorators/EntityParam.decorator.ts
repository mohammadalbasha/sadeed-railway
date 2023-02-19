import { createParamDecorator, ExecutionContext, NotFoundException, Type } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Connection } from 'mongoose';
import getArgEntity from 'src/common/args/getArgEntity';
import { BaseModel } from 'src/common/base.model';
import * as mongoose from 'mongoose'
// import { PrismaService } from 'nestjs-prisma';
// import PrismaModels from 'src/common/PrismaModels.type';


export const EntityParam = createParamDecorator(
  async <Model extends BaseModel>(Model:Type<Model>, context: ExecutionContext): Promise<Model&mongoose.Document> => {
    if (Model === undefined) throw new NotFoundException();
    const result = await getArgEntity(Model, context)
    if (!result) throw new NotFoundException();
    return result
  },
);