import { Resolver, GraphQLMiddlewareFunc } from '../types/types.common';

export const createMiddleware = (
  middlewareFunc: GraphQLMiddlewareFunc,
  resolverFunc: Resolver
) => (parent: any, args: any, context: any, info: any) =>
  middlewareFunc(resolverFunc, parent, args, context, info);
