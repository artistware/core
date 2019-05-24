/// <path reference="./../types/schema.d.ts" />
import * as express from 'express';
import e from 'express';
import * as graphqlHTTP from 'express-graphql';
import genSchema from './util/genSchema';
import createConnection from './util/createConnection';
import * as cors from 'cors';
import {CORS, CORS_DEV, isDev} from './config/settings';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import setRequestUser from './middleware/setRequestUser';
import getClientInfo from './util/getClientInfo';

import keys from './config/keys';
const { DB_RESET, PORT } = keys;
const DB_RESET_CHECKED = isDev ? DB_RESET : false;
const ENV_BASED_CORS = isDev ? CORS_DEV : CORS;

const start = async ():Promise<e.Application> => {
    const app = express();
    app.set('PORT', PORT);
    app.use(cors(ENV_BASED_CORS));

    const schema = genSchema() as any;
    app.use('/graphql',
        bodyParser.json(),
        cookieParser(keys.COOKIE_SECRET),
        setRequestUser,
        graphqlHTTP((req, res) => {
            return {
                schema,
                graphiql: isDev ? true : false,
                context: {
                    info: getClientInfo(req), // TODO logging
                    req,
                    res
                }
            }
        })
    );

    await createConnection(DB_RESET_CHECKED);
    console.log(`db connected, reset = ${DB_RESET_CHECKED}`);

    return Promise.resolve(app);
};

export default start;