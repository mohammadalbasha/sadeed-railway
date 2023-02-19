import { GraphQLModule } from '@nestjs/graphql';
import { DynamicModule, ExecutionContext, Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { DateScalar } from './common/scalars/date.scalar';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './configs/config';
import { GraphqlConfig, MongoConfig, SecurityConfig } from './configs/config.interface';
import { Unique } from './common/validation/unique.validator';
import { CentralModule } from './modules/central.module';
import { AdminModule } from './modules/admin.module';
import { FrontModule } from './modules/front.module';
import { CommonModule } from './modules/common.module';
import { Context } from 'apollo-server-core';
import { JSONScalar } from './common/scalars/json.scalar';
import { MongooseModule } from '@nestjs/mongoose';
import { IsRef } from './common/validation/isRef.validator';
import GlobalClass from './common/GlobalClass';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { env } from 'process';
import { AuthService } from './modules/common/auth/auth.service';
import { AuthModule } from './modules/common/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { CaslModule } from './modules/common/authorization/casl/casl.module';
import { CaslAbilityFactory } from './modules/common/authorization/casl/casl-ability.factory';
import { accessibleRecordsPlugin, AccessibleRecordModel, accessibleFieldsPlugin } from '@casl/mongoose';
import BaseDataLoader from './common/dataLoader/dataLoader.base';
import { Connection } from 'mongoose';
import logginPluginFactory from './common/plugins/logs.plugin';
import ModelService from './modules/models.service';
import { ModelsModule } from './modules/models.module';
import { FileController } from './modules/common/file/file.controller';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { IsAdministrator } from './modules/common/auth/validation/isAdministrator.validator';
import { AdministratorMaxPermisions } from './modules/central/central-role/validation/maxpermisions.administrator.validator';
import { UniqueCompanyName } from './modules/common/auth/validation/unique-companyName.validator';
import { UniqueFullName } from './modules/common/auth/validation/unique-fullName.validator';
import { MatchPassword } from './modules/common/auth/validation/matchPassword.validator';
import { Google2FA } from './modules/common/auth/validation/google2FA.validator';
import { UniqueSSN } from './modules/common/auth/validation/unique-ssn.valiadtor';
import { IsSoftDeletedUser } from './modules/common/auth/validation/isSoftDeletedUser.validator';
import { Deletable } from './common/validation/deleteable.validator';

const url = `mongodb+srv://${env.DATABASE_USERNAME}:${encodeURIComponent(env.DATABASE_PASSWORD)}@cluster0.op0nt.mongodb.net/?retryWrites=true&w=majority`;
@Module({
  imports: [
    ServeStaticModule.forRoot({
      // rootPath: join(__dirname, '..', env.PublicLocalStoragePath),
      rootPath: join(__dirname, '..', env.PublicLocalStoragePath),
      renderPath: '/public/*',
      serveRoot: '/public'
      
    }),
    MulterModule.register({
      dest: './upload',
      limits: {
        fileSize: 10000000
      }
    }),

    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<MongoConfig>('mongodbUrl').url,
        connectionFactory: (connection) => {
          // connection.plugin(require('mongoose-autopopulate'));
          connection.plugin(accessibleRecordsPlugin);
          connection.plugin(accessibleFieldsPlugin);
          return connection;
        } 
      }),
      inject: [ConfigService],
    }),


    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [AuthModule, CaslModule, ModelsModule],
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService, authService: AuthService, caslAbilityFactory: CaslAbilityFactory, models: ModelService) => {
        const graphqlConfig = configService.get<GraphqlConfig>('graphql');
        return {
          plugins: [logginPluginFactory(models)],
          path: '/graphql',
          buildSchemaOptions: { 
            numberScalarMode: 'integer' 
          },
          sortSchema: graphqlConfig.sortSchema,
          autoSchemaFile: graphqlConfig.schemaDestination || './src/schema.graphql',
          debug: graphqlConfig.debug,
          playground: graphqlConfig.playgroundEnabled? {
            subscriptionEndpoint: '/'+env.CentralOrAdminOrFront+'/ws'
          }: false,
          introspection: graphqlConfig.playgroundEnabled?true:false,
          installSubscriptionHandlers: true,
          subscriptions: {
            // 'graphql-ws': true
            'graphql-ws': {
              onConnect: async (context: Context<any>) => {
                const { connectionParams, extra } = context;
                const user = await authService.verifyTokenAndGetUser(connectionParams.Authorization.split(' ')[1])
                if (!user) {
                  throw new Error('Invalid Token');
                }
                const ability = await caslAbilityFactory.createForUser(user)
                context.req = {
                  isSubscription: true,
                  params: connectionParams,
                  user: user,
                  ability: ability,
                }
                // user validation will remain the same as in the example above
                // when using with graphql-ws, additional context value should be stored in the extra field
                // extra.user = { user: {} };
              },
            },
            'subscriptions-transport-ws': {
              path: '/'+env.CentralOrAdminOrFront+'/ws',
              onConnect: async (connectionParams) => {
                const user = await authService.verifyTokenAndGetUser(connectionParams.Authorization.split(' ')[1])
                if (!user) {
                  throw new Error('Invalid Token');
                }
                const ability = await caslAbilityFactory.createForUser(user)
                return {
                  req: {
                    isSubscription: true,
                    params: connectionParams,
                    user: user,
                    ability: ability,
                  }
                }
              },
            },
          },
          context: ({ req, res }) => ({ 
              req,
              res,
              loader: new BaseDataLoader()
            }),
          // include: [
          //   CommonModule,
          //   ...(GlobalClass.isCentral? [CentralModule]: []),
          //   // ...(GlobalClass.isAdmin? [AdminModule]: []),
          //   // ...(GlobalClass.isFront? [FrontModule]: []),
          // ],
        };
      },
      inject: [ConfigService, AuthService, CaslAbilityFactory, ModelService],
    }),
    // PrismaModule.forRoot({
    //   prismaServiceOptions: {
        
    //   },
    //   isGlobal: true,
    // }),

    
 
   
      CommonModule,
    ...(GlobalClass.isCentral? [CentralModule]: []),
    ...(GlobalClass.isAdmin? [AdminModule]: []),
    ...(GlobalClass.isFront? [FrontModule]: []),
    // CentralModule,
    // AdminModule,
    // FrontModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppResolver, DateScalar, JSONScalar,
    // Validators (using AppModule as Container for Validations)
    // Those can be provided by Auth Module
    Unique, 
    IsRef,
    IsAdministrator,
     AdministratorMaxPermisions, 
     UniqueCompanyName, 
     UniqueFullName,
      MatchPassword, 
      Google2FA,
       UniqueSSN,
        IsSoftDeletedUser,
        Deletable
    
  ],
})
export class AppModule {}
