
import { ForbiddenError } from '@casl/ability';
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    ForbiddenException,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { GqlContextType } from '@nestjs/graphql';
import { env } from 'process';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    constructor(
      private readonly httpAdapterHost: HttpAdapterHost,
      private reflector: Reflector,
      ) {}
  
    catch(exception: unknown, host: ArgumentsHost): void {
      

      try {
        if (host.getType<GqlContextType>() === 'graphql') {
          if (exception instanceof ForbiddenError) {
            throw new ForbiddenException(exception.message);
          }
        } else {
          const { httpAdapter } = this.httpAdapterHost;
          const ctx = host.switchToHttp();
    
          const httpStatus =
            exception instanceof HttpException
              ? exception.getStatus()
              : HttpStatus.INTERNAL_SERVER_ERROR;
    
          const responseBody = {
            message: exception instanceof HttpException? exception.message : "Internal Server Error",
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
          };
    
          httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    
          // console.log(exception)
        }
        
      } catch (error) {
        if (env.NODE_ENV == 'development') {
          throw new InternalServerErrorException(error)
        } else {
          throw new InternalServerErrorException()
        }
      }
      
    }
  }
  