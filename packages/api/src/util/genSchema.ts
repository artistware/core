import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import * as path from 'path';
import * as fs from 'fs';
import { makeExecutableSchema } from 'graphql-tools';
import * as glob from 'glob';
import { schemaDirectives } from './../directives';

const genSchema = () => {
  const pathToModules = path.join(__dirname, '../modules');

  const graphqlTypes = glob
    .sync(`${pathToModules}/**/*.graphql`)
    .map(x => fs.readFileSync(x, { encoding: 'utf8' }));

  const graphQlScriptTypes = glob
    .sync(`${pathToModules}/**/*.graphql.?s`)
    .map(schema => require(schema).type);
  
  let typeDefs = graphQlScriptTypes.concat(graphqlTypes);

  const resolvers = glob
    .sync(`${pathToModules}/**/resolvers.?s`)
    .map(resolver => require(resolver).resolvers);

  return makeExecutableSchema({
    typeDefs: mergeTypes(typeDefs),
    resolvers: mergeResolvers(resolvers),
    schemaDirectives
  });
};

export default genSchema;
