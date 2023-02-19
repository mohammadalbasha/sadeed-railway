import { Config } from './config.interface';
require('dotenv').config();

const config: Config = {
  mongodbUrl: {
    //url: `mongodb+srv://${process.env.DATABASE_USERNAME}:${encodeURIComponent(process.env.DATABASE_PASSWORD)}@cluster0.op0nt.mongodb.net/?retryWrites=true&w=majority`
    url: process.env.MONGO_URL
  },
  nest: {
    port: 3000,
  },
  cors: {
    enabled: false,
  },
  swagger: {
    enabled: true,
    title: 'Nestjs FTW',
    description: 'The nestjs API description',
    version: '1.5',
    path: 'api',
  },
  graphql: {
    playgroundEnabled: true,
    debug: true,
    schemaDestination: './src/schema.graphql',
    sortSchema: false,
  },
  security: {
    expiresIn: '7d', //2m
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
  has: {
    common: true,
    central: false,
    admin: false,
    front: false,
  },
  nodemailerTransport : {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
        clientId: process.env.NODEMAILER_CLIENT_ID,
        clientSecret: process.env.NODEMAILER_CLIENT_SECRET ,
        refreshToken : process.env.NODEMAILER_REFRESH_TOKEN,
        accessToken  : process.env.NODEMAILER_ACCESS_TOKEN
      }
  
    }
 
};

export default (): Config => config;
