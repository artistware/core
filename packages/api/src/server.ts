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
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import { redis } from './util/createRedisConnection';

import keys from './config/keys';
import SETTINGS, { _refreshMaxAge } from './config/settings';
import e from 'express';

const {
    PORT,
    ENV_BASED_CORS,
    ENV_BASED_RESET,
    isDev,
    REDIS_SETTINGS,
    
} = SETTINGS;

const {
    COOKIE_SECRET,
    SESSION_SECRET
} = keys;

const RedisStore = connectRedis(session as any);

// TODO block introspection | https://medium.com/brikl-engineering/graphql-schema-directives-as-orm-ec635fdc942d

const start = async ():Promise<e.Application> => {
    const app = express();
 
    app.set('trust proxy', 1);
    app.set('LISTENING_PORT', PORT);
    app.use(cors(ENV_BASED_CORS));
    app.set('development', isDev);
    app.use(cookieParser(COOKIE_SECRET));

    app.use(
        session({
            store: new RedisStore({
                client: redis as any,
                prefix: REDIS_SETTINGS.prefix
            }),
            name: "rs",
            secret: SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: !isDev,
                signed: true,
                expires: true,
                maxAge: REDIS_SETTINGS.ttl
            }
        })
    );

    app.use(setRequestUser(redis));

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
                res: ctx.res,
                redis,
                session: ctx.req.session
            }
        }
    });
    apollo.applyMiddleware({app});
    await createConnection(ENV_BASED_RESET);

    console.log(`db connected, reset = ${ENV_BASED_RESET}`);

    return Promise.resolve(app);
};

export default start;