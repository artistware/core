import {
    ResolverMap
} from "../../../types/types.common";


export const resolvers:ResolverMap = {
    Query: {
        me: (_, __, ctx) => {
            return ctx.req.user;
        }
    }
};