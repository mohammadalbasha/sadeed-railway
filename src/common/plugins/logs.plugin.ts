import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { WithRequired, GraphQLRequestContext, BaseContext } from "apollo-server-types";
import { Connection } from "mongoose";
import { Log, LogType } from "src/modules/central/log/log.model";
import ModelService from "src/modules/models.service";
import GlobalClass from "../GlobalClass";
const IP = require('ip');

export default function logginPluginFactory(models: ModelService) {
  return {
    async requestDidStart(requestContext) {
      // console.log('Request started! Query:\n' + requestContext.request.query);
      return {

        // Fires whenever a GraphQL request is received from a client.
        async willSendResponse(requestContext: WithRequired<GraphQLRequestContext<BaseContext>,'metrics' | 'response' | 'logger'>) {
          /*mohammad albacha *.
          /* these two conditions must be uncommented */
          /* I replace them with my conditions because the (in operaton does not work and query operations are not stored)*/
                console.log(requestContext.context.req.id)
          //if (!((requestContext.operation?.selectionSet?.selections[0] as any)?.name?.value in ['logs', 'login', 'me', 'signup'])) {
            //if (requestContext.response?.errors || requestContext.operation?.operation === LogType.mutation) {
            const operation = (requestContext.operation?.selectionSet?.selections[0] as any)?.name?.value;
           if (operation != 'logs' && operation != '__schema'  ) {
            if (true){
              await models.model(Log).create({
                user_id: requestContext.context?.req?.user?.id,
                endpoint: GlobalClass.endpoint,
                hasErrors: requestContext.response?.errors? true: false,
                // errors: JSON.stringify(requestContext.response?.errors),
                type: (requestContext.operation?.operation?? LogType.unknown),
                // variables: JSON.stringify(requestContext.request.variables),
                ip: IP.address(),
                response: !(['login', 
                'createAdministratorBySuperAdmin',
                 'changePassword', 
                 'createUserByAdministrator',
                  'verifyAdminPasswordGenerationToken', 
                  'verifyAdministratorTwoFactorsCode',
                  'authenticateAdminGoogleTwoFactors', 
                  'authenticateAdminEmailOtpTwoFactors'].includes(operation))? JSON.stringify(requestContext.response.data): "",
                request: !(['login', 
                'createAdministratorBySuperAdmin',
                 'changePassword', 
                 'createUserByAdministrator',
                 'verifyAdministratorTwoFactorsCode',
                 'verifyAdminPasswordGenerationToken', 
                  'authenticateAdminGoogleTwoFactors', 
                  'authenticateAdminEmailOtpTwoFactors'].includes(operation) )?JSON.stringify(requestContext.request): "",
                operationName: (requestContext.operation?.selectionSet?.selections[0] as any)?.name?.value?? 'unknown',
              } as Partial<Log>)
            }
          }
          
        },
  
        // Fires whenever Apollo Server will parse a GraphQL
  
        // request to create its associated document AST.
  
        async parsingDidStart(requestContext) {
  
          // console.log('Parsing started!');
  
        },
  
  
        // Fires whenever Apollo Server will validate a
  
        // request's document AST against your GraphQL schema.
  
        async validationDidStart(requestContext) {
  
          // console.log('Validation started!');
  
        },
  
  
      }
  
    },
  
  };
}
