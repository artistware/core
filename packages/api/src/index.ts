/// <path reference="./../types/schema.d.ts" />
import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
// import { buildSchema } from 'graphiql';
import genSchema from './util/genSchema';
import createConnection from './util/createConnection';
const dotenv = require('dotenv')

dotenv.config();

(async () => {
    const app = express();

    app.use('/graphql', graphqlHTTP({
        schema: genSchema() as any,
        graphiql: process.env.NODE_ENV === 'development' ? true : false,
        context: ({ request }) => ({
            // rootValue: GQL

            url: request.protocol + "://" + request.get("host"),
            req: request
        })
    }));

    await createConnection(true);
    
    app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
})();


