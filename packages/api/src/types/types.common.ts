import * as yup from 'yup';
import e from 'express';
import { Redis } from 'ioredis';
import session from 'express-session';
import { SessionState } from 'http2';

export type YupNum = [number, yup.TestOptionsMessage];
export type YupString = [string, yup.TestOptionsMessage];


export interface ClientInfo {

}

export interface ExpressReqUser {
    sub: string;
    app_metadata: AppMetadata;
}

// TODO other mutltitenant iss 
export interface AuthenticatedRequest extends e.Request {
    user: ExpressReqUser;
}

export interface Context {
    req: AuthenticatedRequest;
    res: e.Response;
    isAuthenticated: boolean;
    redis: Redis,
    session: any
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

// aw-admin: not sure what admin should do at tenant level. has all authority across parent lvl
// aw-developer: provisioned access on acl from aw-admin
// owner: tenant level creator who can provision acl at tenant level
// developer: provisioned access on acl from owner at tenant level
// moderator: typical content management
// user: has no tenant host, read access, personal profile etc write only
// export type Roles = ['aw-admin' | 'aw-developer' | 'owner' | 'developer' | 'moderator' | 'user'];
export enum RoleKeys {
    AWADMIN,
    AWDEV,
    OWNER,
    DEV,
    MOD,
    USER
}; 
export enum Roles {
    AWADMIN = 'aw-admin',
    AWDEV = 'aw-developer',
    OWNER = 'owner',
    DEV = 'developer',
    MOD = 'moderator',
    USER = 'user'
};

// TODO determined by api
// action:rescoure
// i.e. create:user
// this should be documented
// ACTIONS
// VIEW

// to
// RESOURCES
export enum ScopeKeys {
    GET_ME
}

export enum Scopes {
    GET_ME = 'get:me'
}

// TODO roles based default scopes

export interface AppMetadata {
    // NOTE May not contain
    // blocked clientID created_at email email_verified global_client_id 
    // globalClientID identities lastIP lastLogin metadata user_id loginsCount
    roles: [Roles];
}

export interface UserMetadata {

}

export interface RefreshTokenPayload {
    count: number;
}

export interface AccessTokenPayload {
    sub: string; // ID
    iss: string; // URL
    iat: number;
    scope: Scopes;
    user_metadata?: UserMetadata;
    app_metadata?: AppMetadata;
}

// response_type: Tells the authorization server which grant to execute. Refer to the How Response Type Works paragraph for details.
// client_id: The id of the application that asks for authorization.
// redirect_uri: Holds a URL. A successful response from this endpoint results in a redirect to this URL.
// scope: A space-delimited list of permissions that the application requires.
// state
