import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Injectable,
    Scope,
    BadRequestException
} from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectConnection } from '@nestjs/mongoose';
import { parse } from 'graphql';
import * as mongoose from 'mongoose';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

require("dotenv").config();

//import { UserDto } from 'src/users/dtos/user.dto';



@Injectable({scope: Scope.REQUEST})
export class PasswordErrorInterceptor implements NestInterceptor{
    // Here I implement interface to make easy call this class
    // we mustimplement all methods in the interface

    constructor(@InjectConnection() protected connection: mongoose.Connection,    ){}

    
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }
    
    async intercept(context: ExecutionContext, next: CallHandler<any>) {

        const request = this.getRequest(context);
        const mutation = parse(request.body.query);

        const firstOperationDefinition = (ast) => ast.definitions[0];
        const firstFieldValueNameFromOperation = (operationDefinition) =>  operationDefinition.selectionSet.selections[0].name.value;
        console.log('operation', firstOperationDefinition(mutation).operation);
        console.log('firstFieldName', firstFieldValueNameFromOperation(firstOperationDefinition(mutation)));
        // I DONT KNOW HOW TO ACCESS REQUEST BDDY DATA


        // run code after run the request handler
        return next.handle().pipe(
            map(async (data: any) => { // data is the data sent by response
                      return data;
               
            }),
            catchError (async error => {
      
                //throw new BadRequestException();

                console.log(error.response.message == 'Invalid password');
                // CHACK IF INCCORECT TRIES == 3 AND DISABLE USER
                throw error;
            })
        )
    }

}
