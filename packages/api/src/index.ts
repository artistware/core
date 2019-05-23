var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
const genSchema = require('./../buildScripts/genSchema.js');

// var schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);

// var root = { hello: () => 'Hello world!' };

var app = express();
// app.use('/graphql', graphqlHTTP({
//   schema: schema,
//   rootValue: root,
//   graphiql: process.env.NODE_ENV !== 'production'
// }));

const server = new graphqlHTTP({
  schema: genSchema() as any,
  context: ({ request }) => ({
    url: request.protocol + "://" + request.get("host"),
    session: request.session,
    req: request
  })
});

app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
