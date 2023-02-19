export interface Config {
  nest: NestConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  graphql: GraphqlConfig;
  security: SecurityConfig;
  has: HasConfig;
  nodemailerTransport: NodemailerTransport;
  mongodbUrl : MongoConfig;
}

export interface MongoConfig {
  url: string;
}

export interface HasConfig {
  common: boolean;
  central: boolean;
  admin: boolean;
  front: boolean;
}

export interface NestConfig {
  port: number;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface GraphqlConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  schemaDestination: string;
  sortSchema: boolean;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
}

export interface NodemailerTransport {
  service: string,
  auth: {
    type: string,
    user: string,
    pass: string,
    clientId: string,
    clientSecret: string,
    refreshToken: string,
    accessToken: string
  }
}
