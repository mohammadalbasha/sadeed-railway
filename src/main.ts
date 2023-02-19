import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
// import { PrismaClientExceptionFilter } from 'nestjs-prisma';
require('dotenv').config()
import { AppModule } from './app.module';
import { i18nValidationPip } from './common/validation/i18n.validation-pipe';
import helmet from 'helmet';

import {
  CorsConfig,
  NestConfig,
  SwaggerConfig,
} from './configs/config.interface';

import * as mongoose from 'mongoose';
import * as express from 'express';
if (process.env.DebugMongo === 'true') {
  mongoose.set('debug', true);
}


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.urlencoded({ extended: true, limit: '2gb' }));

  const isDevelopment = process.env.NODE_ENV === 'development'
 
 
  /* edit by mohammad albacha*/
  /* comment helmet because it causes a problem to graphql playground */
  // app.use(helmet({
  //   crossOriginEmbedderPolicy: !isDevelopment,
  //   contentSecurityPolicy: !isDevelopment,
  // }),);

  // Validation
  // app.useGlobalPipes(new ValidationPipe({transform: true}));
  app.useGlobalPipes(
    // new ValidationPipe({
    //   forbidUnknownValues: true
    // }),
    i18nValidationPip({
      transform: true,
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true, fallback: true }); // for custom validators like unique

  // // Prisma Client Exception Filter for unhandled exceptions
  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');


  // // Swagger Api
  // const swaggerConfig = configService.get<SwaggerConfig>('swagger');
  // if (swaggerConfig.enabled) {
  //   const options = new DocumentBuilder()
  //     .setTitle(swaggerConfig.title || 'Nestjs')
  //     .setDescription(swaggerConfig.description || 'The nestjs API description')
  //     .setVersion(swaggerConfig.version || '1.0')
  //     .build();
  //   const document = SwaggerModule.createDocument(app, options);

  //   SwaggerModule.setup(swaggerConfig.path || 'api', app, document);
  // }

  // Cors
  if (corsConfig.enabled) {
    app.enableCors();
  }

  await app.listen(process.env.PORT || nestConfig.port || 3000);
}
bootstrap();
