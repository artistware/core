/// <path reference="./../types/schema.d.ts" />
import * as express from 'express';
// import * as graphqlHTTP from 'express-graphql';
import { ApolloServer, gql } from 'apollo-server-express';
import genSchema from './util/genSchema';
import createConnection from './util/createConnection';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import setRequestUser from './middleware/setRequestUser';
import getClientInfo from './util/getClientInfo';
import { addDirectiveResolveFunctionsToSchema } from 'graphql-directive';
// import resolverMap from './modules/directives';
import { AuthenticatedRequest } from './types/types.common';

import keys from './config/keys';
import SETTINGS from './config/settings';
import e from 'express';

const {
    PORT,
    ENV_BASED_CORS,
    ENV_BASED_RESET,
    isDev,
    COOKIE_SETTINGS
} = SETTINGS;

const {
    COOKIE_SECRET
} = keys;

// TODO block introspection | https://medium.com/brikl-engineering/graphql-schema-directives-as-orm-ec635fdc942d

const start = async ():Promise<e.Application> => {
    const app = express();
    app.set('LISTENING_PORT', PORT);
    app.use(cors(ENV_BASED_CORS));
    app.set('development', isDev);
    app.use(cookieParser(COOKIE_SECRET));
    app.use(setRequestUser);

    const schema = genSchema() as any;
    // TODO throttling

    // TODO wrap all middle firsts
    // TODO wrap all middlleware seconds
    // TODO redis 15 min cache access

    const apollo = new ApolloServer({
        schema,
        context: async (ctx: { req: AuthenticatedRequest, res: e.Response }) => {
            console.log('requser checked at server: ', ctx.req.user);
            return {
                isAuthenticated: !!(ctx.req.user && ctx.req.user.sub),
                req: ctx.req,
                res: ctx.res
            }
        }
    });
    apollo.applyMiddleware({app});
    await createConnection(ENV_BASED_RESET);

    console.log(`db connected, reset = ${ENV_BASED_RESET}`);

    return Promise.resolve(app);
};

export default start;