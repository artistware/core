/// <path reference="./../types/schema.d.ts" />
import * as express from 'express';
import e from 'express';
import * as graphqlHTTP from 'express-graphql';
import genSchema from './util/genSchema';
import createConnection from './util/createConnection';
import * as cors from 'cors';
import {CORS, isDev} from './config/settings';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import setRequestUser from './middleware/setRequestUser';
import getClientInfo from './util/getClientInfo';

import keys from './config/keys';
const { DB_RESET, PORT } = keys;
const DB_RESET_CHECKED = isDev ? DB_RESET : false;

const start = async ():Promise<e.Application> => {
    const app = express();
    app.set('PORT', PORT);
    app.use(cors(CORS));

    app.use('/graphql',
        bodyParser.json(),
        cookieParser(),
        setRequestUser,
        graphqlHTTP({
            schema: genSchema() as any,
            graphiql: isDev ? true : false,
            context: ({ req, res }) => ({
                info: getClientInfo(req), // TODO logging
                req,
                res
            })
        })
    );

    await createConnection(DB_RESET_CHECKED);
    console.log(`db connected, reset = ${DB_RESET_CHECKED}`);

    return Promise.resolve(app);
};

export default start;