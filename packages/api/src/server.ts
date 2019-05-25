/// <path reference="./../types/schema.d.ts" />
import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import genSchema from './util/genSchema';
import createConnection from './util/createConnection';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import setRequestUser from './middleware/setRequestUser';
import getClientInfo from './util/getClientInfo';

import keys from './config/keys';
import SETTINGS from './config/settings';
import e from 'express';

const {
    PORT,
    ENV_BASED_CORS,
    ENV_BASED_RESET
} = SETTINGS;

const start = async ():Promise<e.Application> => {
    const app = express();
    app.set('LISTEING_PORT', PORT);
    app.use(cors(ENV_BASED_CORS));

    const schema = genSchema() as any;
    console.log(schema);

    // TODO wrap all middle firsts
    // TODO wrap all middlleware seconds
    // TODO redis 15 min cache access

    app.use('/graphql',
        bodyParser.json(),
        cookieParser(keys.COOKIE_SECRET),
        setRequestUser,
        graphqlHTTP(() => null
            // graph ql non mutation schema and those who dont need response
            // MIDDLEWARED graph ql mutations with res object
            // MY HEADER AND/OR COOKIE RESPONSES/REDIS SESSION
            // MY ERROR HANDLING
        )
    );

    await createConnection(ENV_BASED_RESET);
    console.log(`db connected, reset = ${ENV_BASED_RESET}`);

    return Promise.resolve(app);
};

export default start;