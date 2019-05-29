import {
    ResolverMap
} from "../../../types/types.common";
import { buildSchema } from 'graphql';
import User from './../../../entity/User';
import { ResolveOptions } from "dns";

// createMiddleware -> 

// MW param
// resolver: Resolver,
// parent: any,
// args: any,
// context: Context,
// info: any

// Resolver param
// parent: any,
// args: any,
// context: Context,
// info: any

export const resolvers:ResolverMap = {
    Query: {
        me: (a, b, { req }) => {
            console.log('req.usr', req.user);
            return req.user;
        }
    }
};