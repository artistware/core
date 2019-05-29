/// <path reference="./../types/schema.d.ts" />
import * as express from 'express';
import { ApolloServer } from 'apollo-server-express';
import genSchema from './util/genSchema';
import createConnection from './util/createConnection';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import setRequestUser from './util/setRequestUser';
import { AuthenticatedRequest } from './types/types.common';
import devApolloLogging from './util/devApolloLogging';

import keys from './config/keys';
import SETTINGS from './config/settings';
import e from 'express';

const {
    PORT,
    ENV_BASED_CORS,
    ENV_BASED_RESET,
    isDev
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
    // TODO redis 15 min cache access

    const apollo = new ApolloServer({
        schema,
        context: async (ctx: { req: AuthenticatedRequest, res: e.Response }) => {
            isDev ? devApolloLogging : (() => null)();
            return {
                isAuthenticated: !!(ctx.req.user && ctx.req.user.sub),  // it could be a directive resolver.  this is just t/f
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