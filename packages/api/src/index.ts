import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphiql';
import genSchema from './util/genSchema';

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var root = { hello: () => 'Hello world!' };

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: genSchema() as any,
    rootValue: root,
    graphiql: process.env.NODE_ENV !== 'production',
    context: ({ request }) => ({
        url: request.protocol + "://" + request.get("host"),
        req: request
    })
}));

app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
