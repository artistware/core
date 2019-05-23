/// <path reference="./../types/schema.d.ts" />
import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
// import { buildSchema } from 'graphiql';
import genSchema from './util/genSchema';

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: genSchema() as any,
    graphiql: process.env.NODE_ENV !== 'production',
    context: ({ request }) => ({
        // rootValue: GQL
        url: request.protocol + "://" + request.get("host"),
        req: request
    })
}));

app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
