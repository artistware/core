import {
    buildSchema
} from 'graphql';

import { build } from 'protobufjs';

export const type = `
    directive @isAuthenticated on FIELD_DEFINITION

    type UserJWT {
        id: String!
    }

    type Query {
        me: UserJWT @isAuthenticated
    }
`;