// const resolverMap = {
//     // directiveName(resolve, obj, directiveArgs, context, info) { result }
//     // These arguments have the following conventional names and meanings:

//     // resolve: Resolve is a function that returns the result of the directive field. For consistency,
//     // it always returns a promise resolved with the original field resolver.

//     // obj: The object that contains the result returned from the resolver on the parent field, or,
//     // in the case of a top-level Query field, the rootValue passed from the server configuration. This argument enables the nested nature of GraphQL queries.
    
//     // directiveArgs: An object with the arguments passed into the directive in the query or schema.
//     // For example, if the directive was called with @dateFormat(format: "DD/MM/YYYY"), the args object would be: 
//     // { "format": "DD/MM/YYYY" }.

//     // context: This is an object shared by all resolvers in a particular query, and 
//     // is used to contain per-request state, including authentication information, dataloader
//     // instances, and anything else that should be taken into account when resolving the query.

//     // info: This argument should only be used in advanced cases, but it contains
//     // information about the execution state of the query, including the field name, path to
//     // the field from the root, and more. It’s only documented in the GraphQL.js source code.

//     // NOTE
//     // you can wait on `await resolve()` and augment valu
//     // you can check context for what the express MW does or scope, roles, authentication status

//     async isAuthenticated({resolve, context, info}) {
//         const { user } = context.req;
//         if (user && user.sub) {
//             return resolve();
//         }

//         throw new Error(`You must be authenticated to access "${info.fieldName}"`)
//     }
// }

// export default resolverMap;