import * as yup from 'yup';

export type YupNum = [number, yup.TestOptionsMessage];
export type YupString = [string, yup.TestOptionsMessage];

export interface Context {
    url: string;
    req: Express.Request;
}

export type Resolver = (
    parent: any,
    args: any,
    context: Context,
    info: any
) => any;

export type GraphQLMiddlewareFunc = (
    resolver: Resolver,
    parent: any,
    args: any,
    context: Context,
    info: any
) => any;

export interface ResolverMap {
    [key: string]: {
        [key: string]: Resolver;
    };
}  
