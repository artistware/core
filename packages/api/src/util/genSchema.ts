import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import * as path from 'path';
import * as fs from 'fs';
import { makeExecutableSchema } from 'graphql-tools';
import * as glob from 'glob';

const genSchema = () => {
  const pathToModules = path.join(__dirname, '../modules');

  let typeDefs;

  const graphqlTypes = glob
    .sync(`${pathToModules}/**/*.graphql`)
    .map(x => fs.readFileSync(x, { encoding: 'utf8' }));

  typeDefs = graphqlTypes;

  const graphQlScriptTypes = glob
    .sync(`${pathToModules}/**/*.graphql.?s`)
    .map(schema => require(schema).type);
  
  typeDefs = typeDefs.concat(graphQlScriptTypes);

  const resolvers = glob
    .sync(`${pathToModules}/**/resolvers.?s`)
    .map(resolver => require(resolver).resolvers);

  return makeExecutableSchema({
    typeDefs: mergeTypes(typeDefs),
    resolvers: mergeResolvers(resolvers)
  });
};

export default genSchema;
